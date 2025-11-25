export default interface IController<
  Entity = any,
  Param = any,
  StoreDTO = any,
  UpdateDTO = any
> {
  get(param: Param): Promise<Entity>;
  list(): Promise<Entity[]>;
  store(data: StoreDTO): Promise<Entity>;
  update(data: UpdateDTO): Promise<Entity>;
  destroy(param: Param): Promise<void>;
}
