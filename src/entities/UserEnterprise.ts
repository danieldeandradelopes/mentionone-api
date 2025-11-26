export interface UserEnterpriseProps {
  id: number;
  user_id: number;
  enterprise_id: number;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export type UserEnterpriseDTO = Omit<UserEnterpriseProps, "id">;

export default class UserEnterprise {
  readonly id: number;
  readonly user_id: number;
  readonly enterprise_id: number;
  readonly role: string;
  readonly created_at?: string;
  readonly updated_at?: string;

  constructor(data: UserEnterpriseProps) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.enterprise_id = data.enterprise_id;
    this.role = data.role;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
