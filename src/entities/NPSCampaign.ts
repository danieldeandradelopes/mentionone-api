export type NPSQuestionType = "nps" | "multiple_choice";

export interface NPSCampaignProps {
  id: number;
  enterprise_id: number;
  name: string;
  slug: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type NPSCampaignStoreData = {
  enterprise_id: number;
  name: string;
  slug: string;
  active?: boolean;
};

export type NPSCampaignUpdateData = Partial<{
  name: string;
  slug: string;
  active: boolean;
}> & { id: number };

export default class NPSCampaign {
  readonly id: number;
  readonly enterprise_id: number;
  readonly name: string;
  readonly slug: string;
  readonly active: boolean;
  readonly created_at?: string;
  readonly updated_at?: string;

  constructor(props: NPSCampaignProps) {
    this.id = props.id;
    this.enterprise_id = props.enterprise_id;
    this.name = props.name;
    this.slug = props.slug;
    this.active = props.active;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
