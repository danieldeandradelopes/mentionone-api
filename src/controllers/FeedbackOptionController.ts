import FeedbackOption, {
  FeedbackOptionProps,
} from "../entities/FeedbackOption";
import { IFeedbackOptionGateway } from "../gateway/FeedbackOptionGateway/IFeedbackOptionGateway";

export default class FeedbackOptionController {
  constructor(private readonly gateway: IFeedbackOptionGateway) {}

  async list(enterpriseId: number): Promise<FeedbackOption[]> {
    return this.gateway.findAllByEnterprise(enterpriseId);
  }

  async get(id: number): Promise<FeedbackOption | null> {
    return this.gateway.findById(id);
  }

  async getBySlug(
    enterpriseId: number,
    slug: string
  ): Promise<FeedbackOption | null> {
    return this.gateway.findBySlug(enterpriseId, slug);
  }

  async store(data: Omit<FeedbackOptionProps, "id">): Promise<FeedbackOption> {
    return this.gateway.create(data);
  }

  async update(
    id: number,
    data: Partial<Omit<FeedbackOptionProps, "id" | "enterprise_id">>
  ): Promise<FeedbackOption | null> {
    return this.gateway.update(id, data);
  }

  async destroy(id: number): Promise<boolean> {
    return this.gateway.delete(id);
  }
}
