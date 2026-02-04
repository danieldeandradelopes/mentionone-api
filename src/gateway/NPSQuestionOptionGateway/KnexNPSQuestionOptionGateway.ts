import { Knex } from "knex";
import NPSQuestionOption, {
  NPSQuestionOptionProps,
  NPSQuestionOptionStoreData,
} from "../../entities/NPSQuestionOption";
import INPSQuestionOptionGateway from "./INPSQuestionOptionGateway";

export class KnexNPSQuestionOptionGateway implements INPSQuestionOptionGateway {
  constructor(private readonly knex: Knex) {}

  async findById(id: number): Promise<NPSQuestionOption | null> {
    const result = await this.knex<NPSQuestionOptionProps>("nps_question_options")
      .where({ id })
      .first();
    return result ? new NPSQuestionOption(result) : null;
  }

  async findByQuestionId(questionId: number): Promise<NPSQuestionOption[]> {
    const results = await this.knex<NPSQuestionOptionProps>("nps_question_options")
      .where({ nps_question_id: questionId })
      .orderBy("order", "asc")
      .orderBy("id", "asc");
    return results.map((row) => new NPSQuestionOption(row));
  }

  async findOptionIdsByCampaignId(campaignId: number): Promise<number[]> {
    const rows = await this.knex("nps_question_options as o")
      .join("nps_questions as q", "o.nps_question_id", "q.id")
      .where("q.nps_campaign_id", campaignId)
      .select("o.id");
    return rows.map((r: { id: number }) => r.id);
  }

  async create(data: NPSQuestionOptionStoreData): Promise<NPSQuestionOption> {
    const insertData = {
      ...data,
      order: data.order ?? 0,
    };
    const [id] = await this.knex<NPSQuestionOptionProps>("nps_question_options")
      .insert(insertData)
      .returning("id");
    const row = await this.knex<NPSQuestionOptionProps>("nps_question_options")
      .where({ id: typeof id === "object" ? (id as { id: number }).id : id })
      .first();
    return new NPSQuestionOption(row!);
  }

  async update(
    id: number,
    questionId: number,
    data: Partial<Omit<NPSQuestionOptionProps, "id" | "nps_question_id">>
  ): Promise<NPSQuestionOption | null> {
    const affected = await this.knex<NPSQuestionOptionProps>("nps_question_options")
      .where({ id, nps_question_id: questionId })
      .update(data);
    if (affected === 0) return null;
    const row = await this.knex<NPSQuestionOptionProps>("nps_question_options")
      .where({ id })
      .first();
    return row ? new NPSQuestionOption(row) : null;
  }

  async delete(id: number, questionId: number): Promise<boolean> {
    const affected = await this.knex<NPSQuestionOptionProps>("nps_question_options")
      .where({ id, nps_question_id: questionId })
      .del();
    return affected > 0;
  }

  async deleteByQuestionId(questionId: number): Promise<void> {
    await this.knex("nps_question_options")
      .where({ nps_question_id: questionId })
      .del();
  }
}
