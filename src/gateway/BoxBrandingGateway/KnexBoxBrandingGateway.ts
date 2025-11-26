import { Knex } from "knex";
import BoxBranding, { BoxBrandingProps } from "../../entities/BoxBranding";
import { IBoxBrandingGateway } from "./IBoxBrandingGateway";

export class KnexBoxBrandingGateway implements IBoxBrandingGateway {
  constructor(private readonly knex: Knex) {}

  async getByBoxId(box_id: number): Promise<BoxBranding> {
    const result = await this.knex<BoxBrandingProps>("boxes_branding")
      .where({ box_id })
      .first();
    if (!result) throw new Error("Branding não encontrado para esta box.");
    return new BoxBranding(result);
  }

  async create(data: Omit<BoxBrandingProps, "id">): Promise<BoxBranding> {
    const [id] = await this.knex<BoxBrandingProps>("boxes_branding")
      .insert(data)
      .returning("id");
    const row = await this.knex<BoxBrandingProps>("boxes_branding")
      .where({ id: typeof id === "object" ? id.id : id })
      .first();
    return new BoxBranding(row!);
  }

  async update(
    box_id: number,
    data: Partial<Omit<BoxBrandingProps, "id" | "box_id">>
  ): Promise<BoxBranding> {
    await this.knex<BoxBrandingProps>("boxes_branding")
      .where({ box_id })
      .update(data);
    const row = await this.knex<BoxBrandingProps>("boxes_branding")
      .where({ box_id })
      .first();
    if (!row) throw new Error("Branding não encontrado para esta box.");
    return new BoxBranding(row);
  }
}
