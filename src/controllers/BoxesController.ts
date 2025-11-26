import Boxes, { BoxesStoreData, BoxesUpdateData } from "../entities/Boxes";
import { IBoxesGateway } from "../gateway/BoxesGateway/IBoxesGateway";

function sanitizeSlug(str: string) {
  return str
    .normalize("NFD")
    .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s-])/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export default class BoxesController {
  constructor(private readonly gateway: IBoxesGateway) {}

  async list(enterpriseId: number): Promise<Boxes[]> {
    return this.gateway.findAllByEnterprise(enterpriseId);
  }

  async get(id: number): Promise<Boxes | null> {
    return this.gateway.findById(id);
  }

  async getBySlug(slug: string): Promise<Boxes> {
    return this.gateway.findBySlug(slug);
  }

  async store(data: BoxesStoreData): Promise<Boxes> {
    // Gera slug automaticamente se não enviado
    const slug = data.slug || sanitizeSlug(data.name);
    return this.gateway.create({ ...data, slug });
  }

  async update(data: BoxesUpdateData): Promise<Boxes | null> {
    const { id, ...updateFields } = data;
    // Se atualizar name e não passar slug, gere slug novo
    let fields = { ...updateFields };
    if (updateFields.name && !updateFields.slug) {
      fields.slug = sanitizeSlug(updateFields.name);
    }
    return this.gateway.update(id, fields);
  }

  async destroy(id: number): Promise<boolean> {
    return this.gateway.delete(id);
  }
}
