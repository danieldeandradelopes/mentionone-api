import { Knex } from "knex";
import NPSQuestion, {
  NPSQuestionProps,
  NPSQuestionStoreData,
} from "../../entities/NPSQuestion";
import INPSQuestionGateway from "./INPSQuestionGateway";

export class KnexNPSQuestionGateway implements INPSQuestionGateway {
  constructor(private readonly knex: Knex) {}

  async findById(id: number): Promise<NPSQuestion | null> {
    const result = await this.knex<NPSQuestionProps>("nps_questions")
      .where({ id })
      .first();
    return result ? new NPSQuestion(result) : null;
  }

  async findByCampaignId(campaignId: number): Promise<NPSQuestion[]> {
    const results = await this.knex<NPSQuestionProps>("nps_questions")
      .where({ nps_campaign_id: campaignId })
      .orderBy("order", "asc")
      .orderBy("id", "asc");
    return results.map((row) => new NPSQuestion(row));
  }

  async create(data: NPSQuestionStoreData): Promise<NPSQuestion> {
    const insertData = { ...data, order: data.order ?? 0 };
    const [id] = await this.knex<NPSQuestionProps>("nps_questions")
      .insert(insertData)
      .returning("id");
    const row = await this.knex<NPSQuestionProps>("nps_questions")
      .where({ id: typeof id === "object" ? (id as { id: number }).id : id })
      .first();
    return new NPSQuestion(row!);
  }

  async update(
    id: number,
    campaignId: number,
    data: Partial<Omit<NPSQuestionProps, "id" | "nps_campaign_id">>
  ): Promise<NPSQuestion | null> {
    const affected = await this.knex<NPSQuestionProps>("nps_questions")
      .where({ id, nps_campaign_id: campaignId })
      .update(data);
    if (affected === 0) return null;
    const row = await this.knex<NPSQuestionProps>("nps_questions")
      .where({ id })
      .first();
    return row ? new NPSQuestion(row) : null;
  }

  async delete(id: number, campaignId: number): Promise<boolean> {
    const affected = await this.knex<NPSQuestionProps>("nps_questions")
      .where({ id, nps_campaign_id: campaignId })
      .del();
    return affected > 0;
  }

  async deleteByCampaignId(campaignId: number): Promise<void> {
    await this.knex("nps_questions").where({ nps_campaign_id: campaignId }).del();
  }
}
