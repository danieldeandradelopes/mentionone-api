import { Knex } from "knex";
import Branch, { BranchProps, BranchStoreData } from "../../entities/Branch";
import IBranchGateway from "./IBranchGateway";

export class KnexBranchGateway implements IBranchGateway {
  constructor(private readonly knex: Knex) {}

  async findById(id: number): Promise<Branch | null> {
    const result = await this.knex<BranchProps>("branches").where({ id }).first();
    return result ? new Branch(result) : null;
  }

  async findBySlug(enterpriseId: number, slug: string): Promise<Branch | null> {
    const result = await this.knex<BranchProps>("branches")
      .where({ enterprise_id: enterpriseId, slug })
      .first();
    return result ? new Branch(result) : null;
  }

  async findAllByEnterprise(enterpriseId: number): Promise<Branch[]> {
    const results = await this.knex<BranchProps>("branches")
      .where({ enterprise_id: enterpriseId })
      .orderBy("name");
    return results.map((row) => new Branch(row));
  }

  async create(data: BranchStoreData): Promise<Branch> {
    const [id] = await this.knex<BranchProps>("branches")
      .insert(data)
      .returning("id");
    const row = await this.knex<BranchProps>("branches")
      .where({ id: typeof id === "object" ? (id as { id: number }).id : id })
      .first();
    return new Branch(row!);
  }

  async update(
    id: number,
    enterpriseId: number,
    data: Partial<Omit<BranchProps, "id" | "enterprise_id">>
  ): Promise<Branch | null> {
    const affected = await this.knex<BranchProps>("branches")
      .where({ id, enterprise_id: enterpriseId })
      .update(data);
    if (affected === 0) return null;
    const row = await this.knex<BranchProps>("branches").where({ id }).first();
    return row ? new Branch(row) : null;
  }

  async delete(id: number, enterpriseId: number): Promise<boolean> {
    const affected = await this.knex<BranchProps>("branches")
      .where({ id, enterprise_id: enterpriseId })
      .del();
    return affected > 0;
  }
}
