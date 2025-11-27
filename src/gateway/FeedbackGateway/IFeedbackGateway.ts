import Feedback, { FeedbackProps } from "../../entities/Feedback";

export interface FeedbackReportFilters {
  enterprise_id: number;
  box_id?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface IFeedbackGateway {
  findById(id: number): Promise<Feedback | null>;
  findAllByEnterprise(enterprise_id: number): Promise<Feedback[]>;
  findAllByBox(box_id: number): Promise<Feedback[]>;
  findWithFilters(filters: FeedbackReportFilters): Promise<Feedback[]>;
  create(data: Omit<FeedbackProps, "id">): Promise<Feedback>;
  update(
    id: number,
    data: Partial<Omit<FeedbackProps, "id" | "enterprise_id" | "box_id">>
  ): Promise<Feedback | null>;
  delete(id: number): Promise<boolean>;
}
