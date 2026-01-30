import Feedback, {
  FeedbackStoreData,
  FeedbackStoreDataWithSlug,
  FeedbackUpdateData,
} from "../entities/Feedback";
import {
  IFeedbackGateway,
  FeedbackReportFilters,
} from "../gateway/FeedbackGateway/IFeedbackGateway";
import { IBoxesGateway } from "../gateway/BoxesGateway/IBoxesGateway";
import { IFeedbackOptionGateway } from "../gateway/FeedbackOptionGateway/IFeedbackOptionGateway";
import { getPlanFeatures, getFeatureValue } from "../utils/PlanFeaturesHelper";
import KnexConfig from "../config/knex";

export interface FeedbackListResponse {
  feedbacks: Feedback[];
  pagination: {
    total: number;
    visible: number;
    limit_reached: boolean;
    current_month: string;
  };
}

export default class FeedbackController {
  constructor(
    private readonly gateway: IFeedbackGateway,
    private readonly boxesGateway: IBoxesGateway,
    private readonly feedbackOptionGateway: IFeedbackOptionGateway,
  ) {}

  async list(enterpriseId: number): Promise<Feedback[] | FeedbackListResponse> {
    const allFeedbacks = await this.gateway.findAllByEnterprise(enterpriseId);

    // Buscar features do plano
    const planFeaturesResult = await getPlanFeatures(KnexConfig, enterpriseId);

    const maxResponsesPerMonthValue = getFeatureValue(
      planFeaturesResult.features,
      "max_responses_per_month",
      null,
    );

    // Sem features (subscription ausente), aplicar limite do plano Free
    const maxResponsesPerMonth = maxResponsesPerMonthValue ?? 15;

    // Filtrar feedbacks do mês atual
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
    );

    const currentMonthFeedbacks = allFeedbacks.filter((fb) => {
      if (!fb.created_at) return false;
      const fbDate = new Date(fb.created_at);
      return fbDate >= firstDayOfMonth && fbDate < firstDayOfNextMonth;
    });

    // Se não há mais feedbacks que o limite, retorna todos do mês
    if (currentMonthFeedbacks.length <= maxResponsesPerMonth) {
      // Retornar apenas feedbacks do mês atual
      return currentMonthFeedbacks;
    }

    // Ordenar por data crescente (mais antigos primeiro) e pegar os N primeiros
    const sortedFeedbacks = [...currentMonthFeedbacks].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateA - dateB;
    });

    const limitedFeedbacks = sortedFeedbacks.slice(0, maxResponsesPerMonth);

    // Retornar resposta com metadados
    return {
      feedbacks: limitedFeedbacks,
      pagination: {
        total: currentMonthFeedbacks.length,
        visible: limitedFeedbacks.length,
        limit_reached: true,
        current_month: `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, "0")}`,
      },
    };
  }

  async listByBox(boxId: number): Promise<Feedback[]> {
    return this.gateway.findAllByBox(boxId);
  }

  async listWithFilters(
    enterpriseId: number,
    filters: {
      boxId?: number;
      category?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<Feedback[]> {
    return this.gateway.findWithFilters({
      enterprise_id: enterpriseId,
      box_id: filters.boxId,
      category: filters.category,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
  }

  async get(id: number): Promise<Feedback | null> {
    return this.gateway.findById(id);
  }

  async getWithDetails(
    id: number,
    enterpriseId: number,
  ): Promise<
    | (Feedback & {
        box?: {
          id: number;
          name: string;
          slug: string;
        } | null;
        feedbackOption?: {
          id: number;
          name: string;
          slug: string;
          type: "criticism" | "suggestion" | "praise";
        } | null;
      })
    | null
  > {
    const feedback = await this.gateway.findById(id);
    if (!feedback) {
      return null;
    }

    // Busca informações da box
    let box = null;
    try {
      const boxData = await this.boxesGateway.findById(feedback.box_id);
      if (boxData) {
        box = {
          id: boxData.id,
          name: boxData.name,
          slug: boxData.slug,
        };
      }
    } catch (error) {
      // Box não encontrada, continua sem box
    }

    // Busca informações da opção de feedback (se category for um slug válido)
    let feedbackOption = null;
    if (feedback.category) {
      try {
        const option = await this.feedbackOptionGateway.findBySlug(
          enterpriseId,
          feedback.category,
        );
        if (option) {
          feedbackOption = {
            id: option.id,
            name: option.name,
            slug: option.slug,
            type: option.type,
          };
        }
      } catch (error) {
        // Opção não encontrada, continua sem opção
      }
    }

    return {
      ...feedback,
      box,
      feedbackOption,
    };
  }

  async store(data: FeedbackStoreData): Promise<Feedback> {
    return this.gateway.create({
      ...data,
      status: data.status || "pending",
      response: data.response || null,
      rating: data.rating || null,
      attachments: data.attachments || null,
    });
  }

  async storeWithSlug(
    data: FeedbackStoreDataWithSlug,
    enterpriseId: number,
  ): Promise<Feedback> {
    // Busca a box pelo slug para obter o ID
    const box = await this.boxesGateway.findBySlug(data.box_slug);
    if (!box) {
      throw new Error("Box não encontrada com o slug fornecido.");
    }

    // Cria o feedback com o box_id resolvido
    return this.gateway.create({
      enterprise_id: enterpriseId,
      box_id: box.id,
      text: data.text,
      category: data.category,
      status: data.status || "pending",
      response: data.response || null,
      rating: data.rating || null,
      attachments: data.attachments || null,
    });
  }

  async update(data: FeedbackUpdateData): Promise<Feedback | null> {
    const { id, ...updateFields } = data;
    return this.gateway.update(id, updateFields);
  }

  async destroy(id: number): Promise<boolean> {
    return this.gateway.delete(id);
  }

  async getReport(
    enterpriseId: number,
    filters: {
      boxId?: number;
      category?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    const feedbacks = await this.gateway.findWithFilters({
      enterprise_id: enterpriseId,
      box_id: filters.boxId,
      category: filters.category,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    // Agrupa por categoria
    const groupedByCategory: Record<string, number> = {};
    feedbacks.forEach((feedback) => {
      groupedByCategory[feedback.category] =
        (groupedByCategory[feedback.category] || 0) + 1;
    });

    // Agrupa por dia
    const groupedByDay: Record<string, number> = {};
    feedbacks.forEach((feedback) => {
      if (feedback.created_at) {
        const date = new Date(feedback.created_at).toISOString().split("T")[0];
        groupedByDay[date] = (groupedByDay[date] || 0) + 1;
      }
    });

    return {
      id: `report-${Date.now()}`,
      boxId: filters.boxId?.toString() || null,
      category: filters.category || null,
      startDate: filters.startDate || null,
      endDate: filters.endDate || null,
      totalFeedbacks: feedbacks.length,
      groupedByCategory,
      groupedByDay,
    };
  }
}
