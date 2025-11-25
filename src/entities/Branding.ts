import Enterprise from "./Enterprise";

export interface BrandingProps {
  id: number;
  name: string;
  primary_color: string;
  secondary_color: string;
  tertiary_color: string;
  quaternary_color: string;
  background_color: string;
  surface_color: string;
  text_primary_color: string;
  text_secondary_color: string;
  border_color: string;
  error_color: string;
  success_color: string;
  btn_primary_bg: string;
  btn_primary_text: string;
  btn_secondary_bg: string;
  btn_secondary_text: string;
  btn_tertiary_bg: string;
  btn_tertiary_text: string;
  btn_quaternary_bg: string;
  btn_quaternary_text: string;
  heading_color: string;
  subheading_color: string;
  text_default: string;
  text_muted: string;
  link_color: string;
  link_hover_color: string;
  input_bg: string;
  input_text: string;
  input_border: string;
  input_placeholder: string;
  input_focus_border: string;
  app_background: string;
  card_background: string;
  card_border: string;
  card_shadow: string;
  drawer_bg: string;
  drawer_text: string;
  drawer_border: string;
  drawer_hover_bg: string;
  drawer_active_bg: string;
  logo: string;
  favicon: string;
  enterprise_id: number;
  theme: "light" | "dark" | "custom";
  barber_shop: Enterprise;
  updated_at?: string;
  created_at?: string;
}

export default class Branding {
  readonly id: number;
  readonly name: string;

  // Paleta base
  readonly primary_color: string;
  readonly secondary_color: string;
  readonly tertiary_color: string;
  readonly quaternary_color: string;
  readonly background_color: string;
  readonly surface_color: string;
  readonly text_primary_color: string;
  readonly text_secondary_color: string;
  readonly border_color: string;
  readonly error_color: string;
  readonly success_color: string;

  // Botões
  readonly btn_primary_bg: string;
  readonly btn_primary_text: string;
  readonly btn_secondary_bg: string;
  readonly btn_secondary_text: string;
  readonly btn_tertiary_bg: string;
  readonly btn_tertiary_text: string;
  readonly btn_quaternary_bg: string;
  readonly btn_quaternary_text: string;

  // Textos
  readonly heading_color: string;
  readonly subheading_color: string;
  readonly text_default: string;
  readonly text_muted: string;
  readonly link_color: string;
  readonly link_hover_color: string;

  // Inputs
  readonly input_bg: string;
  readonly input_text: string;
  readonly input_border: string;
  readonly input_placeholder: string;
  readonly input_focus_border: string;

  // Containers
  readonly app_background: string;
  readonly card_background: string;
  readonly card_border: string;
  readonly card_shadow: string;

  // Drawer/Sidebar
  readonly drawer_bg: string;
  readonly drawer_text: string;
  readonly drawer_border: string;
  readonly drawer_hover_bg: string;
  readonly drawer_active_bg: string;

  // Assets
  readonly logo: string;
  readonly favicon: string;

  // Relacionamento
  readonly enterprise_id: number;

  // Tema
  readonly theme: "light" | "dark" | "custom";

  // Timestamps
  readonly updated_at?: string;
  readonly created_at?: string;

  readonly barber_shop: Enterprise;

  constructor({
    id,
    name,
    primary_color,
    secondary_color,
    tertiary_color,
    quaternary_color,
    background_color,
    surface_color,
    text_primary_color,
    text_secondary_color,
    border_color,
    error_color,
    success_color,
    btn_primary_bg,
    btn_primary_text,
    btn_secondary_bg,
    btn_secondary_text,
    btn_tertiary_bg,
    btn_tertiary_text,
    btn_quaternary_bg,
    btn_quaternary_text,
    heading_color,
    subheading_color,
    text_default,
    text_muted,
    link_color,
    link_hover_color,
    input_bg,
    input_text,
    input_border,
    input_placeholder,
    input_focus_border,
    app_background,
    card_background,
    card_border,
    card_shadow,
    drawer_bg,
    drawer_text,
    drawer_border,
    drawer_hover_bg,
    drawer_active_bg,
    logo,
    favicon,
    enterprise_id,
    theme,
    updated_at,
    created_at,
    barber_shop,
  }: BrandingProps) {
    this.id = id;
    this.name = name;
    this.primary_color = primary_color;
    this.secondary_color = secondary_color;
    this.tertiary_color = tertiary_color;
    this.quaternary_color = quaternary_color;
    this.background_color = background_color;
    this.surface_color = surface_color;
    this.text_primary_color = text_primary_color;
    this.text_secondary_color = text_secondary_color;
    this.border_color = border_color;
    this.error_color = error_color;
    this.success_color = success_color;
    this.btn_primary_bg = btn_primary_bg;
    this.btn_primary_text = btn_primary_text;
    this.btn_secondary_bg = btn_secondary_bg;
    this.btn_secondary_text = btn_secondary_text;
    this.btn_tertiary_bg = btn_tertiary_bg;
    this.btn_tertiary_text = btn_tertiary_text;
    this.btn_quaternary_bg = btn_quaternary_bg;
    this.btn_quaternary_text = btn_quaternary_text;
    this.heading_color = heading_color;
    this.subheading_color = subheading_color;
    this.text_default = text_default;
    this.text_muted = text_muted;
    this.link_color = link_color;
    this.link_hover_color = link_hover_color;
    this.input_bg = input_bg;
    this.input_text = input_text;
    this.input_border = input_border;
    this.input_placeholder = input_placeholder;
    this.input_focus_border = input_focus_border;
    this.app_background = app_background;
    this.card_background = card_background;
    this.card_border = card_border;
    this.card_shadow = card_shadow;
    this.drawer_bg = drawer_bg;
    this.drawer_text = drawer_text;
    this.drawer_border = drawer_border;
    this.drawer_hover_bg = drawer_hover_bg;
    this.drawer_active_bg = drawer_active_bg;
    this.logo = logo;
    this.favicon = favicon;
    this.enterprise_id = enterprise_id;
    this.theme = theme;
    this.updated_at = updated_at;
    this.created_at = created_at;
    this.barber_shop = barber_shop;
  }
}
