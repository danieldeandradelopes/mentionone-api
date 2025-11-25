export interface BoxesProps {
  id: number;
  enterprise_id: number;
  name: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

export default class Boxes {
  readonly id: number;
  readonly enterprise_id: number;
  readonly name: string;
  readonly location: string;
  readonly created_at?: string;
  readonly updated_at?: string;

  constructor(props: BoxesProps) {
    this.id = props.id;
    this.enterprise_id = props.enterprise_id;
    this.name = props.name;
    this.location = props.location;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
