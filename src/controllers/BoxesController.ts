import Boxes, { BoxesStoreData, BoxesUpdateData } from "../entities/Boxes";
import { IBoxesGateway } from "../gateway/BoxesGateway/IBoxesGateway";

export default class BoxesController {
  constructor(private readonly gateway: IBoxesGateway) {}

  async list(enterpriseId: number): Promise<Boxes[]> {
    return this.gateway.findAllByEnterprise(enterpriseId);
  }

  async get(id: number): Promise<Boxes | null> {
    return this.gateway.findById(id);
  }

  async store(data: BoxesStoreData): Promise<Boxes> {
    return this.gateway.create(data);
  }

  async update(data: BoxesUpdateData): Promise<Boxes | null> {
    const { id, ...updateFields } = data;
    return this.gateway.update(id, updateFields);
  }

  async destroy(id: number): Promise<boolean> {
    return this.gateway.delete(id);
  }
}
