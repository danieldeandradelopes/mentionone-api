export interface SocialMediaProps {
  id: number;
  name: string;
  url: string;
  icon: string;
  enterprise_Id: number;
  updated_at?: string;
  created_at?: string;
}

export default class SocialMedia {
  readonly id: number;
  readonly name: string;
  readonly url: string;
  readonly icon: string;
  readonly enterprise_Id: number;
  readonly updated_at?: string;
  readonly created_at?: string;

  constructor({
    id,
    name,
    url,
    icon,
    enterprise_Id,
    updated_at,
    created_at,
  }: SocialMediaProps) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.icon = icon;
    this.enterprise_Id = enterprise_Id;
    this.updated_at = updated_at;
    this.created_at = created_at;
  }
}
