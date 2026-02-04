import Branch, { BranchStoreData, BranchUpdateData } from "../entities/Branch";
import IBranchGateway from "../gateway/BranchGateway/IBranchGateway";

function sanitizeSlug(str: string): string {
  return str
    .normalize("NFD")
    .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s-])/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export default class BranchController {
  constructor(private readonly gateway: IBranchGateway) {}

  async list(enterpriseId: number): Promise<Branch[]> {
    return this.gateway.findAllByEnterprise(enterpriseId);
  }

  async get(id: number, enterpriseId: number): Promise<Branch | null> {
    const branch = await this.gateway.findById(id);
    if (!branch || branch.enterprise_id !== enterpriseId) return null;
    return branch;
  }

  async store(enterpriseId: number, data: Omit<BranchStoreData, "enterprise_id">): Promise<Branch> {
    const slug = data.slug?.trim() ? sanitizeSlug(data.slug) : sanitizeSlug(data.name);
    const existing = await this.gateway.findBySlug(enterpriseId, slug);
    if (existing) {
      throw new Error("Já existe uma filial com este slug nesta empresa.");
    }
    return this.gateway.create({
      enterprise_id: enterpriseId,
      name: data.name,
      slug,
      address: data.address ?? null,
    });
  }

  async update(
    enterpriseId: number,
    data: BranchUpdateData
  ): Promise<Branch | null> {
    const { id, ...fields } = data;
    const slug = fields.slug?.trim() ? sanitizeSlug(fields.slug) : fields.name ? sanitizeSlug(fields.name) : undefined;
    const updateData = { ...fields };
    if (slug !== undefined) updateData.slug = slug;
    return this.gateway.update(id, enterpriseId, updateData);
  }

  async destroy(id: number, enterpriseId: number): Promise<boolean> {
    return this.gateway.delete(id, enterpriseId);
  }
}
