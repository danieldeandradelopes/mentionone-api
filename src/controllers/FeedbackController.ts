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

export default class FeedbackController {
  constructor(
    private readonly gateway: IFeedbackGateway,
    private readonly boxesGateway: IBoxesGateway
  ) {}

  async list(enterpriseId: number): Promise<Feedback[]> {
    return this.gateway.findAllByEnterprise(enterpriseId);
  }

  async listByBox(boxId: number): Promise<Feedback[]> {
    return this.gateway.findAllByBox(boxId);
  }

  async get(id: number): Promise<Feedback | null> {
    return this.gateway.findById(id);
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
    enterpriseId: number
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
    }
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
