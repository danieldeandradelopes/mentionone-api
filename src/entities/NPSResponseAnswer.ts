export interface NPSResponseAnswerProps {
  id: number;
  nps_response_id: number;
  nps_question_id: number;
  nps_question_option_id: number;
  created_at?: string;
  updated_at?: string;
}

export type NPSResponseAnswerStoreData = {
  nps_response_id: number;
  nps_question_id: number;
  nps_question_option_id: number;
};

export default class NPSResponseAnswer {
  readonly id: number;
  readonly nps_response_id: number;
  readonly nps_question_id: number;
  readonly nps_question_option_id: number;
  readonly created_at?: string;
  readonly updated_at?: string;

  constructor(props: NPSResponseAnswerProps) {
    this.id = props.id;
    this.nps_response_id = props.nps_response_id;
    this.nps_question_id = props.nps_question_id;
    this.nps_question_option_id = props.nps_question_option_id;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
