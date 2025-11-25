import BoxBranding, { BoxBrandingProps } from "../../entities/BoxBranding";

export interface IBoxBrandingGateway {
  getByBoxId(box_id: number): Promise<BoxBranding | null>;
  create(data: Omit<BoxBrandingProps, "id">): Promise<BoxBranding>;
  update(
    box_id: number,
    data: Partial<Omit<BoxBrandingProps, "id" | "box_id">>
  ): Promise<BoxBranding>;
}
