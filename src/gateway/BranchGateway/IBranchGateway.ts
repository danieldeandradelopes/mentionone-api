import Branch, { BranchProps, BranchStoreData } from "../../entities/Branch";

export default interface IBranchGateway {
  findById(id: number): Promise<Branch | null>;
  findBySlug(enterpriseId: number, slug: string): Promise<Branch | null>;
  findAllByEnterprise(enterpriseId: number): Promise<Branch[]>;
  create(data: BranchStoreData): Promise<Branch>;
  update(
    id: number,
    enterpriseId: number,
    data: Partial<Omit<BranchProps, "id" | "enterprise_id">>
  ): Promise<Branch | null>;
  delete(id: number, enterpriseId: number): Promise<boolean>;
}
