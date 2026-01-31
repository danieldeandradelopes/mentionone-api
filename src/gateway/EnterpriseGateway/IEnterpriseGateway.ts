import Enterprise, {
  EnterpriseProps,
  EnterpriseDTO,
  EnterpriseWithDefaultTemplate,
} from "../../entities/Enterprise";

export default interface IEnterpriseGateway {
  getEnterprises(): Promise<Enterprise[]>;
  getEnterprise(id: number): Promise<Enterprise>;
  getEnterpriseByDomain(domain: string | null): Promise<Enterprise>;
  addEnterprise(
    data: Omit<
      EnterpriseDTO,
      "id" | "created_at" | "updated_at" | "deleted_at"
    >,
  ): Promise<Enterprise>;
  updateEnterprise(
    data: Partial<EnterpriseDTO> & { id: number },
  ): Promise<Enterprise>;
  removeEnterprise(id: number): Promise<void>;
  getTransaction(): Promise<any>;
  // Extra: multi-admin
  getEnterprisesByUserId?(userId: number): Promise<Enterprise[]>;
  addUserToEnterprise(
    userId: number,
    enterpriseId: number,
    trx?: any,
  ): Promise<void>;
  addEnterpriseWithDefaultTemplate(
    data: EnterpriseWithDefaultTemplate & { trx?: any },
  ): Promise<{ enterprise: Enterprise }>;
}
