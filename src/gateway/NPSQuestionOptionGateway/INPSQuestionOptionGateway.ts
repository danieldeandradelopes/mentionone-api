import NPSQuestionOption, {
  NPSQuestionOptionProps,
  NPSQuestionOptionStoreData,
} from "../../entities/NPSQuestionOption";

export default interface INPSQuestionOptionGateway {
  findById(id: number): Promise<NPSQuestionOption | null>;
  findByQuestionId(questionId: number): Promise<NPSQuestionOption[]>;
  findOptionIdsByCampaignId(campaignId: number): Promise<number[]>;
  create(data: NPSQuestionOptionStoreData): Promise<NPSQuestionOption>;
  update(
    id: number,
    questionId: number,
    data: Partial<Omit<NPSQuestionOptionProps, "id" | "nps_question_id">>
  ): Promise<NPSQuestionOption | null>;
  delete(id: number, questionId: number): Promise<boolean>;
  deleteByQuestionId(questionId: number): Promise<void>;
}
