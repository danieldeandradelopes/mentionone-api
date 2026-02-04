import NPSCampaign, { NPSCampaignProps } from "../entities/NPSCampaign";
import NPSQuestion from "../entities/NPSQuestion";
import NPSQuestionOption from "../entities/NPSQuestionOption";
import INPSCampaignGateway from "../gateway/NPSCampaignGateway/INPSCampaignGateway";
import INPSQuestionGateway from "../gateway/NPSQuestionGateway/INPSQuestionGateway";
import INPSQuestionOptionGateway from "../gateway/NPSQuestionOptionGateway/INPSQuestionOptionGateway";
import type { NPSQuestionType } from "../entities/NPSCampaign";

function sanitizeSlug(str: string): string {
  return str
    .normalize("NFD")
    .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s-])/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export type NPSQuestionInput = {
  title: string;
  type: NPSQuestionType;
  order?: number;
  options?: { label: string; order?: number }[];
};

export type NPSCampaignWithQuestions = NPSCampaign & {
  questions: (NPSQuestion & { options: NPSQuestionOption[] })[];
};

export default class NPSCampaignController {
  constructor(
    private readonly campaignGateway: INPSCampaignGateway,
    private readonly questionGateway: INPSQuestionGateway,
    private readonly optionGateway: INPSQuestionOptionGateway,
  ) {}

  async list(enterpriseId: number): Promise<NPSCampaign[]> {
    return this.campaignGateway.findAllByEnterprise(enterpriseId);
  }

  async get(id: number, enterpriseId: number): Promise<NPSCampaign | null> {
    const campaign = await this.campaignGateway.findById(id);
    if (!campaign || campaign.enterprise_id !== enterpriseId) return null;
    return campaign;
  }

  async getWithQuestions(
    id: number,
    enterpriseId: number,
  ): Promise<NPSCampaignWithQuestions | null> {
    const campaign = await this.get(id, enterpriseId);
    if (!campaign) return null;
    const questions = await this.questionGateway.findByCampaignId(campaign.id);
    const withOptions: (NPSQuestion & { options: NPSQuestionOption[] })[] = [];
    for (const q of questions) {
      const options = await this.optionGateway.findByQuestionId(q.id);
      withOptions.push({ ...q, options });
    }
    return { ...campaign, questions: withOptions };
  }

  async getBySlugForPublic(
    enterpriseId: number,
    slug: string,
  ): Promise<NPSCampaignWithQuestions | null> {
    const campaign = await this.campaignGateway.findBySlug(enterpriseId, slug);
    if (!campaign || !campaign.active) return null;
    const questions = await this.questionGateway.findByCampaignId(campaign.id);
    const withOptions: (NPSQuestion & { options: NPSQuestionOption[] })[] = [];
    for (const q of questions) {
      const options = await this.optionGateway.findByQuestionId(q.id);
      withOptions.push({ ...q, options });
    }
    return { ...campaign, questions: withOptions };
  }

  async store(
    enterpriseId: number,
    data: {
      name: string;
      slug?: string;
      active?: boolean;
      questions?: NPSQuestionInput[];
    },
  ): Promise<NPSCampaign> {
    const slug = data.slug?.trim()
      ? sanitizeSlug(data.slug)
      : sanitizeSlug(data.name);
    const existing = await this.campaignGateway.findBySlug(enterpriseId, slug);
    if (existing) {
      throw new Error(
        "Já existe uma campanha NPS com este slug nesta empresa.",
      );
    }
    const campaign = await this.campaignGateway.create({
      enterprise_id: enterpriseId,
      name: data.name.trim(),
      slug,
      active: data.active ?? true,
    });
    if (data.questions && data.questions.length > 0) {
      for (let i = 0; i < data.questions.length; i++) {
        const q = data.questions[i];
        const question = await this.questionGateway.create({
          nps_campaign_id: campaign.id,
          title: q.title.trim(),
          type: q.type,
          order: q.order ?? i,
        });
        if (q.options && q.options.length > 0) {
          for (let j = 0; j < q.options.length; j++) {
            const opt = q.options[j];
            await this.optionGateway.create({
              nps_question_id: question.id,
              label: opt.label.trim(),
              order: opt.order ?? j,
            });
          }
        }
      }
    }
    return campaign;
  }

  async update(
    enterpriseId: number,
    id: number,
    data: {
      name?: string;
      slug?: string;
      active?: boolean;
      questions?: NPSQuestionInput[];
    },
  ): Promise<NPSCampaign | null> {
    const campaign = await this.get(id, enterpriseId);
    if (!campaign) return null;

    const updatePayload: Partial<
      Omit<NPSCampaignProps, "id" | "enterprise_id">
    > = {};
    if (data.name !== undefined) updatePayload.name = data.name.trim();
    if (data.active !== undefined) updatePayload.active = data.active;
    if (data.slug !== undefined) {
      const slug = data.slug.trim() ? sanitizeSlug(data.slug) : undefined;
      if (slug && slug !== campaign.slug) {
        const existing = await this.campaignGateway.findBySlug(
          enterpriseId,
          slug,
        );
        if (existing) {
          throw new Error(
            "Já existe uma campanha NPS com este slug nesta empresa.",
          );
        }
        updatePayload.slug = slug;
      }
    }
    if (Object.keys(updatePayload).length > 0) {
      await this.campaignGateway.update(id, enterpriseId, updatePayload);
    }

    if (data.questions !== undefined) {
      const questions = await this.questionGateway.findByCampaignId(id);
      for (const q of questions) {
        await this.optionGateway.deleteByQuestionId(q.id);
      }
      await this.questionGateway.deleteByCampaignId(id);
      for (let i = 0; i < data.questions.length; i++) {
        const q = data.questions[i];
        const question = await this.questionGateway.create({
          nps_campaign_id: id,
          title: q.title.trim(),
          type: q.type,
          order: q.order ?? i,
        });
        if (q.options && q.options.length > 0) {
          for (let j = 0; j < q.options.length; j++) {
            const opt = q.options[j];
            await this.optionGateway.create({
              nps_question_id: question.id,
              label: opt.label.trim(),
              order: opt.order ?? j,
            });
          }
        }
      }
    }
    return this.campaignGateway.findById(id);
  }

  async destroy(id: number, enterpriseId: number): Promise<boolean> {
    return this.campaignGateway.delete(id, enterpriseId);
  }
}
