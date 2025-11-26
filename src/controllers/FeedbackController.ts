import Feedback, {
  FeedbackStoreData,
  FeedbackStoreDataWithSlug,
  FeedbackUpdateData,
} from "../entities/Feedback";
import { IFeedbackGateway } from "../gateway/FeedbackGateway/IFeedbackGateway";
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
}
