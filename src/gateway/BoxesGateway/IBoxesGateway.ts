import Boxes, {
  BoxesProps,
  BoxesStoreData,
  BoxesUpdateData,
} from "../../entities/Boxes";

export interface IBoxesGateway {
  findById(id: number): Promise<Boxes | null>;
  findBySlug(slug: string): Promise<Boxes | null>;
  findAllByEnterprise(enterprise_id: number): Promise<Boxes[]>;
  create(data: BoxesStoreData): Promise<Boxes>;
  update(
    id: number,
    data: Partial<Omit<BoxesProps, "id" | "enterprise_id">>
  ): Promise<Boxes | null>;
  delete(id: number): Promise<boolean>;
}
