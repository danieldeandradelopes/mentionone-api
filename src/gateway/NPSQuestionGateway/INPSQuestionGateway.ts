import NPSQuestion, {
  NPSQuestionProps,
  NPSQuestionStoreData,
} from "../../entities/NPSQuestion";

export default interface INPSQuestionGateway {
  findById(id: number): Promise<NPSQuestion | null>;
  findByCampaignId(campaignId: number): Promise<NPSQuestion[]>;
  create(data: NPSQuestionStoreData): Promise<NPSQuestion>;
  update(
    id: number,
    campaignId: number,
    data: Partial<Omit<NPSQuestionProps, "id" | "nps_campaign_id">>
  ): Promise<NPSQuestion | null>;
  delete(id: number, campaignId: number): Promise<boolean>;
  deleteByCampaignId(campaignId: number): Promise<void>;
}
