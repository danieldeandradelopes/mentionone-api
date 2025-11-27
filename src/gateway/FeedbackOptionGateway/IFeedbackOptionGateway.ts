import FeedbackOption, {
  FeedbackOptionProps,
} from "../../entities/FeedbackOption";

export interface IFeedbackOptionGateway {
  findById(id: number): Promise<FeedbackOption | null>;
  findAllByEnterprise(enterprise_id: number): Promise<FeedbackOption[]>;
  findAllByBox(box_id: number): Promise<FeedbackOption[]>;
  findBySlug(
    enterprise_id: number,
    slug: string
  ): Promise<FeedbackOption | null>;
  create(data: Omit<FeedbackOptionProps, "id">): Promise<FeedbackOption>;
  update(
    id: number,
    data: Partial<Omit<FeedbackOptionProps, "id" | "enterprise_id">>
  ): Promise<FeedbackOption | null>;
  delete(id: number): Promise<boolean>;
}
