export type AIAnalysisRunType = "insights" | "alerts";

export interface AIAnalysisRunProps {
  id: number;
  enterprise_id: number;
  type: string;
  payload: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export type AIAnalysisRunStoreData = {
  enterprise_id: number;
  type: string;
  payload: Record<string, unknown>;
};

export default class AIAnalysisRun {
  readonly id: number;
  readonly enterprise_id: number;
  readonly type: string;
  readonly payload: Record<string, unknown>;
  readonly created_at?: string;
  readonly updated_at?: string;

  constructor(props: AIAnalysisRunProps) {
    this.id = props.id;
    this.enterprise_id = props.enterprise_id;
    this.type = props.type;
    this.payload = props.payload;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
