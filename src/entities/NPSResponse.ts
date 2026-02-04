export interface NPSResponseProps {
  id: number;
  nps_campaign_id: number;
  branch_id: number | null;
  nps_score: number | null;
  created_at?: string;
  updated_at?: string;
}

export type NPSResponseStoreData = {
  nps_campaign_id: number;
  branch_id?: number | null;
  nps_score?: number | null;
};

export default class NPSResponse {
  readonly id: number;
  readonly nps_campaign_id: number;
  readonly branch_id: number | null;
  readonly nps_score: number | null;
  readonly created_at?: string;
  readonly updated_at?: string;

  constructor(props: NPSResponseProps) {
    this.id = props.id;
    this.nps_campaign_id = props.nps_campaign_id;
    this.branch_id = props.branch_id;
    this.nps_score = props.nps_score;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
