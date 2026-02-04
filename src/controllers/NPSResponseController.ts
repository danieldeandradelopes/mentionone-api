import NPSResponse from "../entities/NPSResponse";
import INPSCampaignGateway from "../gateway/NPSCampaignGateway/INPSCampaignGateway";
import INPSQuestionGateway from "../gateway/NPSQuestionGateway/INPSQuestionGateway";
import INPSQuestionOptionGateway from "../gateway/NPSQuestionOptionGateway/INPSQuestionOptionGateway";
import INPSResponseGateway from "../gateway/NPSResponseGateway/INPSResponseGateway";
import IBranchGateway from "../gateway/BranchGateway/IBranchGateway";
import type { Knex } from "knex";

export type NPSResponsePayload = {
  nps_score?: number | null;
  branch_id?: number | null;
  branch_slug?: string | null;
  answers?: { question_id: number; option_id: number }[];
};

export default class NPSResponseController {
  constructor(
    private readonly campaignGateway: INPSCampaignGateway,
    private readonly questionGateway: INPSQuestionGateway,
    private readonly optionGateway: INPSQuestionOptionGateway,
    private readonly responseGateway: INPSResponseGateway,
    private readonly branchGateway: IBranchGateway,
    private readonly knex: Knex
  ) {}

  async store(
    enterpriseId: number,
    campaignSlug: string,
    payload: NPSResponsePayload
  ): Promise<NPSResponse> {
    const campaign = await this.campaignGateway.findBySlug(enterpriseId, campaignSlug);
    if (!campaign) {
      throw new Error("Campaign not found.");
    }
    if (!campaign.active) {
      throw new Error("Campaign is not active.");
    }

    let branchId: number | null = payload.branch_id ?? null;
    if (payload.branch_slug && !branchId) {
      const branch = await this.branchGateway.findBySlug(enterpriseId, payload.branch_slug);
      if (branch) branchId = branch.id;
    }

    const npsScore =
      payload.nps_score !== undefined && payload.nps_score !== null
        ? Number(payload.nps_score)
        : null;
    if (npsScore !== null && (npsScore < 0 || npsScore > 10 || !Number.isInteger(npsScore))) {
      throw new Error("nps_score must be an integer between 0 and 10.");
    }

    const questions = await this.questionGateway.findByCampaignId(campaign.id);
    const questionIds = new Set(questions.map((q) => q.id));
    const validOptionIds = await this.optionGateway.findOptionIdsByCampaignId(campaign.id);
    const validOptionIdSet = new Set(validOptionIds);

    const answers = payload.answers ?? [];
    for (const a of answers) {
      if (!questionIds.has(a.question_id)) {
        throw new Error(`Question ${a.question_id} does not belong to this campaign.`);
      }
      if (!validOptionIdSet.has(a.option_id)) {
        throw new Error(`Option ${a.option_id} does not belong to this campaign.`);
      }
    }

    return this.knex.transaction(async (trx) => {
      const response = await this.responseGateway.createResponse(
        {
          nps_campaign_id: campaign.id,
          branch_id: branchId,
          nps_score: npsScore,
        },
        trx
      );
      if (answers.length > 0) {
        await this.responseGateway.createResponseAnswers(
          answers.map((a) => ({
            nps_response_id: response.id,
            nps_question_id: a.question_id,
            nps_question_option_id: a.option_id,
          })),
          trx
        );
      }
      return response;
    });
  }
}
