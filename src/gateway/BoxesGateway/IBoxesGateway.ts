import Boxes, { BoxesProps } from "../../entities/Boxes";

export interface IBoxesGateway {
  findById(id: number): Promise<Boxes | null>;
  findAllByEnterprise(enterprise_id: number): Promise<Boxes[]>;
  create(data: Omit<BoxesProps, "id">): Promise<Boxes>;
  update(
    id: number,
    data: Partial<Omit<BoxesProps, "id" | "enterprise_id">>
  ): Promise<Boxes | null>;
  delete(id: number): Promise<boolean>;
}
