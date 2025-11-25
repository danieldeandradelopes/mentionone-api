import BoxBranding, { BoxBrandingProps } from "../entities/BoxBranding";
import { IBoxBrandingGateway } from "../gateway/BoxBrandingGateway/IBoxBrandingGateway";

export default class BoxBrandingController {
  constructor(private readonly gateway: IBoxBrandingGateway) {}

  async getByBoxId(box_id: number): Promise<BoxBranding | null> {
    return this.gateway.getByBoxId(box_id);
  }

  async create(data: Omit<BoxBrandingProps, "id">): Promise<BoxBranding> {
    return this.gateway.create(data);
  }

  async update(
    box_id: number,
    data: Partial<Omit<BoxBrandingProps, "id" | "box_id">>
  ): Promise<BoxBranding> {
    return this.gateway.update(box_id, data);
  }
}
