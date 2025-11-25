export interface ManifestProps {
  id?: number;
  enterprise_id: number;

  name: string;
  short_name: string;
  start_url?: string;
  display?: string;
  theme_color?: string;
  background_color?: string;

  icons?: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;

  extra?: Record<string, any>;

  created_at?: string;
  updated_at?: string;
}

export default class Manifest {
  readonly id?: number;
  readonly enterprise_id: number;

  readonly name: string;
  readonly short_name: string;
  readonly start_url: string;
  readonly display: string;
  readonly theme_color: string;
  readonly background_color: string;

  readonly icons?: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;

  readonly extra?: Record<string, any>;

  readonly created_at?: string;
  readonly updated_at?: string;

  constructor({
    id,
    enterprise_id,
    name,
    short_name,
    start_url = "/",
    display = "standalone",
    theme_color = "#000000",
    background_color = "#ffffff",
    icons,
    extra,
    created_at,
    updated_at,
  }: ManifestProps) {
    this.id = id;
    this.enterprise_id = enterprise_id;

    this.name = name;
    this.short_name = short_name;
    this.start_url = start_url;
    this.display = display;
    this.theme_color = theme_color;
    this.background_color = background_color;

    this.icons = icons;
    this.extra = extra;

    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
