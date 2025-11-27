export type FeedbackOptionType = "criticism" | "suggestion" | "praise";

export interface FeedbackOptionProps {
  id: number;
  enterprise_id: number;
  box_id: number | null;
  slug: string;
  name: string;
  type: FeedbackOptionType;
  created_at?: string;
  updated_at?: string;
}

export default class FeedbackOption {
  readonly id: number;
  readonly enterprise_id: number;
  readonly box_id: number | null;
  readonly slug: string;
  readonly name: string;
  readonly type: FeedbackOptionType;
  readonly created_at?: string;
  readonly updated_at?: string;

  constructor(props: FeedbackOptionProps) {
    this.id = props.id;
    this.enterprise_id = props.enterprise_id;
    this.box_id = props.box_id;
    this.slug = props.slug;
    this.name = props.name;
    this.type = props.type;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
