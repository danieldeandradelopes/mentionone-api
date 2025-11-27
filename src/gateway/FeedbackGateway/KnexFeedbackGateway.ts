import { Knex } from "knex";
import Feedback, { FeedbackProps } from "../../entities/Feedback";
import { IFeedbackGateway } from "./IFeedbackGateway";

export class KnexFeedbackGateway implements IFeedbackGateway {
  constructor(private readonly knex: Knex) {}

  async findById(id: number): Promise<Feedback> {
    const result = await this.knex<FeedbackProps>("feedbacks")
      .where({ id })
      .first();
    if (!result) throw new Error("Feedback não encontrado.");
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

  async findWithFilters(filters: {
    enterprise_id: number;
    box_id?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Feedback[]> {
    let query = this.knex<FeedbackProps>("feedbacks").where({
      enterprise_id: filters.enterprise_id,
    });

    if (filters.box_id) {
      query = query.where({ box_id: filters.box_id });
    }

    if (filters.category) {
      query = query.where({ category: filters.category });
    }

    if (filters.startDate) {
      query = query.where("created_at", ">=", filters.startDate);
    }

    if (filters.endDate) {
      query = query.where("created_at", "<=", filters.endDate);
    }

    const results = await query;
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
  ): Promise<Feedback> {
    await this.knex<FeedbackProps>("feedbacks").where({ id }).update(data);
    const row = await this.knex<FeedbackProps>("feedbacks")
      .where({ id })
      .first();
    if (!row) throw new Error("Feedback não encontrado.");
    return new Feedback({
      ...row,
      attachments: row.attachments ? JSON.parse(row.attachments as any) : null,
    });
  }

  async delete(id: number): Promise<boolean> {
    const affected = await this.knex<FeedbackProps>("feedbacks")
      .where({ id })
      .del();
    if (!affected) throw new Error("Feedback não encontrado.");
    return true;
  }
}
