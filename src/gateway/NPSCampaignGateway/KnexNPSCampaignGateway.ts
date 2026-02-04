import { Knex } from "knex";
import NPSCampaign, {
  NPSCampaignProps,
  NPSCampaignStoreData,
} from "../../entities/NPSCampaign";
import INPSCampaignGateway from "./INPSCampaignGateway";

export class KnexNPSCampaignGateway implements INPSCampaignGateway {
  constructor(private readonly knex: Knex) {}

  async findById(id: number): Promise<NPSCampaign | null> {
    const result = await this.knex<NPSCampaignProps>("nps_campaigns")
      .where({ id })
      .first();
    return result ? new NPSCampaign(result) : null;
  }

  async findBySlug(enterpriseId: number, slug: string): Promise<NPSCampaign | null> {
    const result = await this.knex<NPSCampaignProps>("nps_campaigns")
      .where({ enterprise_id: enterpriseId, slug })
      .first();
    return result ? new NPSCampaign(result) : null;
  }

  async findAllByEnterprise(enterpriseId: number): Promise<NPSCampaign[]> {
    const results = await this.knex<NPSCampaignProps>("nps_campaigns")
      .where({ enterprise_id: enterpriseId })
      .orderBy("created_at", "desc");
    return results.map((row) => new NPSCampaign(row));
  }

  async create(data: NPSCampaignStoreData): Promise<NPSCampaign> {
    const insertData = {
      ...data,
      active: data.active ?? true,
    };
    const [id] = await this.knex<NPSCampaignProps>("nps_campaigns")
      .insert(insertData)
      .returning("id");
    const row = await this.knex<NPSCampaignProps>("nps_campaigns")
      .where({ id: typeof id === "object" ? (id as { id: number }).id : id })
      .first();
    return new NPSCampaign(row!);
  }

  async update(
    id: number,
    enterpriseId: number,
    data: Partial<Omit<NPSCampaignProps, "id" | "enterprise_id">>
  ): Promise<NPSCampaign | null> {
    const affected = await this.knex<NPSCampaignProps>("nps_campaigns")
      .where({ id, enterprise_id: enterpriseId })
      .update(data);
    if (affected === 0) return null;
    const row = await this.knex<NPSCampaignProps>("nps_campaigns")
      .where({ id })
      .first();
    return row ? new NPSCampaign(row) : null;
  }

  async delete(id: number, enterpriseId: number): Promise<boolean> {
    const affected = await this.knex<NPSCampaignProps>("nps_campaigns")
      .where({ id, enterprise_id: enterpriseId })
      .del();
    return affected > 0;
  }
}
