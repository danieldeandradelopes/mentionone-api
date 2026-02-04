export interface NPSQuestionOptionProps {
  id: number;
  nps_question_id: number;
  label: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export type NPSQuestionOptionStoreData = {
  nps_question_id: number;
  label: string;
  order?: number;
};

export type NPSQuestionOptionUpdateData = Partial<{
  label: string;
  order: number;
}> & { id: number };

export default class NPSQuestionOption {
  readonly id: number;
  readonly nps_question_id: number;
  readonly label: string;
  readonly order: number;
  readonly created_at?: string;
  readonly updated_at?: string;

  constructor(props: NPSQuestionOptionProps) {
    this.id = props.id;
    this.nps_question_id = props.nps_question_id;
    this.label = props.label;
    this.order = props.order;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
