import { Knex } from "knex";
import Boxes, { BoxesProps } from "../../entities/Boxes";
import { IBoxesGateway } from "./IBoxesGateway";

export class KnexBoxesGateway implements IBoxesGateway {
  constructor(private readonly knex: Knex) {}

  async findById(id: number): Promise<Boxes> {
    const result = await this.knex<BoxesProps>("boxes").where({ id }).first();
    if (!result) throw new Error("Box não encontrada.");
    return new Boxes(result);
  }

  async findAllByEnterprise(enterprise_id: number): Promise<Boxes[]> {
    const results = await this.knex<BoxesProps>("boxes").where({
      enterprise_id,
    });
    return results.map((row) => new Boxes(row));
  }

  async create(data: Omit<BoxesProps, "id">): Promise<Boxes> {
    const [id] = await this.knex<BoxesProps>("boxes")
      .insert(data)
      .returning("*");
    const row = await this.knex<BoxesProps>("boxes")
      .where({ id: typeof id === "object" ? id.id : id })
      .first();
    return new Boxes(row!);
  }

  async update(
    id: number,
    data: Partial<Omit<BoxesProps, "id" | "enterprise_id">>
  ): Promise<Boxes> {
    await this.knex<BoxesProps>("boxes").where({ id }).update(data);
    const row = await this.knex<BoxesProps>("boxes").where({ id }).first();
    if (!row) throw new Error("Box não encontrada.");
    return new Boxes(row);
  }

  async delete(id: number): Promise<boolean> {
    const affected = await this.knex<BoxesProps>("boxes").where({ id }).del();
    if (!affected) throw new Error("Box não encontrada.");
    return true;
  }
}
