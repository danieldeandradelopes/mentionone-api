export interface BranchProps {
  id: number;
  enterprise_id: number;
  name: string;
  slug: string;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type BranchStoreData = {
  enterprise_id: number;
  name: string;
  slug: string;
  address?: string | null;
};

export type BranchUpdateData = Partial<{
  name: string;
  slug: string;
  address: string | null;
}> & { id: number };

export default class Branch {
  readonly id: number;
  readonly enterprise_id: number;
  readonly name: string;
  readonly slug: string;
  readonly address?: string | null;
  readonly created_at?: string;
  readonly updated_at?: string;

  constructor(props: BranchProps) {
    this.id = props.id;
    this.enterprise_id = props.enterprise_id;
    this.name = props.name;
    this.slug = props.slug;
    this.address = props.address;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }
}
