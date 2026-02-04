import NPSCampaign, {
  NPSCampaignProps,
  NPSCampaignStoreData,
} from "../../entities/NPSCampaign";

export default interface INPSCampaignGateway {
  findById(id: number): Promise<NPSCampaign | null>;
  findBySlug(enterpriseId: number, slug: string): Promise<NPSCampaign | null>;
  findAllByEnterprise(enterpriseId: number): Promise<NPSCampaign[]>;
  create(data: NPSCampaignStoreData): Promise<NPSCampaign>;
  update(
    id: number,
    enterpriseId: number,
    data: Partial<Omit<NPSCampaignProps, "id" | "enterprise_id">>
  ): Promise<NPSCampaign | null>;
  delete(id: number, enterpriseId: number): Promise<boolean>;
}
