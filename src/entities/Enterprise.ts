import Branding from "./Branding";
import Phone from "./Phone";
import SocialMedia from "./SocialMedia";

export interface EnterpriseWithDefaultTemplate {
  name: string;
  cover: string;
  address: string;
  phone: string;
  description: string;
  subdomain: string;
  latitude: number;
  longitude: number;
  document: string;
  document_type: string;
  email: string;
  plan_price_id: number;
}

export interface EnterpriseProps {
  id: number;
  name: string;
  cover: string;
  address: string;
  description: string;
  social_medias?: SocialMedia[];
  phones?: Phone[];
  branding?: Branding[];
  latitude?: number;
  longitude?: number;
  timezone?: string;
  auto_approve: string;
  email?: string;
  document?: string;
  subdomain: string;
  document_type?: string;
  min_advance_minutes?: number;
  updated_at?: string;
  created_at?: string;
}

export default class Enterprise {
  readonly id: number;
  readonly name: string;
  readonly cover: string;
  readonly address: string;
  readonly description: string;
  readonly auto_approve: string;
  readonly social_medias?: SocialMedia[];
  readonly phones?: Phone[];
  readonly branding?: Branding[];
  readonly latitude?: number;
  readonly longitude?: number;
  readonly timezone?: string;
  readonly email?: string;
  readonly document?: string;
  readonly subdomain: string;
  readonly document_type?: string;
  readonly min_advance_minutes?: number;
  readonly updated_at?: string;
  readonly created_at?: string;

  constructor({
    id,
    name,
    cover,
    address,
    description,
    social_medias,
    auto_approve,
    phones,
    branding,
    latitude,
    longitude,
    subdomain,
    timezone,
    email,
    document,
    document_type,
    min_advance_minutes,
    updated_at,
    created_at,
  }: EnterpriseProps) {
    this.id = id;
    this.name = name;
    this.cover = cover;
    this.address = address;
    this.description = description;
    this.social_medias = social_medias;
    this.phones = phones;
    this.branding = branding;
    this.latitude = latitude;
    this.longitude = longitude;
    this.subdomain = subdomain;
    this.timezone = timezone;
    this.email = email;
    this.document = document;
    this.document_type = document_type;
    this.min_advance_minutes = min_advance_minutes;
    this.updated_at = updated_at;
    this.created_at = created_at;
    this.auto_approve = auto_approve;
  }
}
