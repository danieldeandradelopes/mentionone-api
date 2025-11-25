import Feedback from "../entities/Feedback";
import { IFeedbackGateway } from "../gateway/FeedbackGateway/IFeedbackGateway";

type FeedbackStoreData = {
  enterprise_id: number;
  box_id: number;
  text: string;
  category: string;
  status?: string;
  response?: string | null;
  rating?: number | null;
  attachments?: string[] | null;
};

type FeedbackUpdateData = Partial<
  Omit<FeedbackStoreData, "enterprise_id" | "box_id">
> & { id: number };

export default class FeedbackController {
  constructor(private readonly gateway: IFeedbackGateway) {}

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

  async update(data: FeedbackUpdateData): Promise<Feedback | null> {
    const { id, ...updateFields } = data;
    return this.gateway.update(id, updateFields);
  }

  async destroy(id: number): Promise<boolean> {
    return this.gateway.delete(id);
  }
}
