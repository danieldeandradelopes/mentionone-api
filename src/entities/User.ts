export interface UserProps {
  id: number;
  name: string;
  email: string;
  access_level: string;
  avatar: string;
  phone: string;
  updated_at?: string;
  created_at?: string;
  password?: string;
}

export interface ListUsersRequest {
  page: number;
  limit: number;
}

export default class User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly access_level: string;
  readonly avatar: string;
  readonly phone: string;
  readonly updated_at?: string;
  readonly created_at?: string;
  readonly password?: string;

  constructor({
    id,
    name,
    email,
    access_level,
    avatar,
    phone,
    updated_at,
    created_at,
    password,
  }: UserProps) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.access_level = access_level;
    this.avatar = avatar;
    this.phone = phone;
    this.updated_at = updated_at;
    this.created_at = created_at;
    this.password = password;
  }
}
