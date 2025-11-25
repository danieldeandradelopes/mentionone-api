import { Knex } from "knex";
import Feedback, { FeedbackProps } from "../../entities/Feedback";
import { IFeedbackGateway } from "./IFeedbackGateway";

export class KnexFeedbackGateway implements IFeedbackGateway {
  constructor(private readonly knex: Knex) {}

  async findById(id: number): Promise<Feedback | null> {
    const result = await this.knex<FeedbackProps>("feedbacks")
      .where({ id })
      .first();
    if (!result) return null;
    return new Feedback({
      ...result,
      attachments: result.attachments
        ? JSON.parse(result.attachments as any)
        : null,
    });
  }

  async findAllByEnterprise(enterprise_id: number): Promise<Feedback[]> {
    const results = await this.knex<FeedbackProps>("feedbacks").where({
      enterprise_id,
    });
    return results.map(
      (row) =>
        new Feedback({
          ...row,
          attachments: row.attachments
            ? JSON.parse(row.attachments as any)
            : null,
        })
    );
  }

  async findAllByBox(box_id: number): Promise<Feedback[]> {
    const results = await this.knex<FeedbackProps>("feedbacks").where({
      box_id,
    });
    return results.map(
      (row) =>
        new Feedback({
          ...row,
          attachments: row.attachments
            ? JSON.parse(row.attachments as any)
            : null,
        })
    );
  }

  async create(data: Omit<FeedbackProps, "id">): Promise<Feedback> {
    const [id] = await this.knex<FeedbackProps>("feedbacks")
      .insert(data)
      .returning("id");
    const row = await this.knex<FeedbackProps>("feedbacks")
      .where({ id: typeof id === "object" ? id.id : id })
      .first();
    return new Feedback({
      ...row!,
      attachments: row!.attachments
        ? JSON.parse(row!.attachments as any)
        : null,
    });
  }

  async update(
    id: number,
    data: Partial<Omit<FeedbackProps, "id" | "enterprise_id" | "box_id">>
  ): Promise<Feedback | null> {
    await this.knex<FeedbackProps>("feedbacks").where({ id }).update(data);
    const row = await this.knex<FeedbackProps>("feedbacks")
      .where({ id })
      .first();
    return row
      ? new Feedback({
          ...row,
          attachments: row.attachments
            ? JSON.parse(row.attachments as any)
            : null,
        })
      : null;
  }

  async delete(id: number): Promise<boolean> {
    const affected = await this.knex<FeedbackProps>("feedbacks")
      .where({ id })
      .del();
    return affected > 0;
  }
}
