import { Knex } from "knex";
import FeedbackOption, {
  FeedbackOptionProps,
} from "../../entities/FeedbackOption";
import { IFeedbackOptionGateway } from "./IFeedbackOptionGateway";

export class KnexFeedbackOptionGateway implements IFeedbackOptionGateway {
  constructor(private readonly knex: Knex) {}

  async findById(id: number): Promise<FeedbackOption | null> {
    const result = await this.knex<FeedbackOptionProps>("feedback_options")
      .where({ id })
      .first();
    if (!result) return null;
    return new FeedbackOption(result);
  }

  async findAllByEnterprise(enterprise_id: number): Promise<FeedbackOption[]> {
    const results = await this.knex<FeedbackOptionProps>("feedback_options")
      .where({ enterprise_id })
      .orderBy("created_at", "desc");
    return results.map((row) => new FeedbackOption(row));
  }

  async findAllByBox(box_id: number): Promise<FeedbackOption[]> {
    const results = await this.knex<FeedbackOptionProps>("feedback_options")
      .where({ box_id })
      .orderBy("created_at", "desc");
    return results.map((row) => new FeedbackOption(row));
  }

  async findBySlug(
    enterprise_id: number,
    slug: string
  ): Promise<FeedbackOption | null> {
    const result = await this.knex<FeedbackOptionProps>("feedback_options")
      .where({ enterprise_id, slug })
      .first();
    if (!result) return null;
    return new FeedbackOption(result);
  }

  async create(data: Omit<FeedbackOptionProps, "id">): Promise<FeedbackOption> {
    const [id] = await this.knex<FeedbackOptionProps>("feedback_options")
      .insert(data)
      .returning("id");
    const row = await this.knex<FeedbackOptionProps>("feedback_options")
      .where({ id: typeof id === "object" ? id.id : id })
      .first();
    return new FeedbackOption(row!);
  }

  async update(
    id: number,
    data: Partial<Omit<FeedbackOptionProps, "id" | "enterprise_id">>
  ): Promise<FeedbackOption | null> {
    await this.knex<FeedbackOptionProps>("feedback_options")
      .where({ id })
      .update(data);
    const row = await this.knex<FeedbackOptionProps>("feedback_options")
      .where({ id })
      .first();
    if (!row) return null;
    return new FeedbackOption(row);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.knex<FeedbackOptionProps>("feedback_options")
      .where({ id })
      .delete();
    return deleted > 0;
  }
}
