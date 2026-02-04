import type { NPSQuestionType } from "./NPSCampaign";

export interface NPSQuestionProps {
  id: number;
  nps_campaign_id: number;
  title: string;
  type: NPSQuestionType;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export type NPSQuestionStoreData = {
  nps_campaign_id: number;
  title: string;
  type: NPSQuestionType;
  order?: number;
};

export type NPSQuestionUpdateData = Partial<{
  title: string;
  type: NPSQuestionType;
  order: number;
}> & { id: number };

export default class NPSQuestion {
  readonly id: number;
  readonly nps_campaign_id: number;
  readonly title: string;
  readonly type: NPSQuestionType;
  readonly order: number;
  readonly created_at?: string;
  readonly updated_at?: string;

  constructor(props: NPSQuestionProps) {
    this.id = props.id;
    this.nps_campaign_id = props.nps_campaign_id;
    this.title = props.title;
    this.type = props.type;
    this.order = props.order;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
