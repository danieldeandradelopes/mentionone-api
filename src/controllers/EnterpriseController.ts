import Enterprise, {
  EnterpriseDTO,
  EnterpriseWithDefaultTemplate,
} from "../entities/Enterprise";
import IEnterpriseGateway from "../gateway/EnterpriseGateway/IEnterpriseGateway";
import IController from "./IController";

interface IEnterpriseController extends IController {
  getBySubdomain(subdomain: string): Promise<any>;
  storeWithDefaultTemplate(data: EnterpriseWithDefaultTemplate): Promise<{
    enterprise: Enterprise;
  }>;
  list(): Promise<Enterprise[]>;
  addUserToEnterprise(
    userId: number,
    enterpriseId: number,
    trx?: any,
  ): Promise<void>;
}

export default class EnterpriseController implements IEnterpriseController {
  constructor(readonly enterpriseGateway: IEnterpriseGateway) {}

  async store(data: EnterpriseDTO): Promise<EnterpriseDTO> {
    return await this.enterpriseGateway.addEnterprise(data);
  }

  async get(id: number): Promise<EnterpriseDTO> {
    const enterprise = await this.enterpriseGateway.getEnterprise(id);
    return enterprise;
  }

  async list(): Promise<EnterpriseDTO[]> {
    return await this.enterpriseGateway.getEnterprises();
  }

  async getBySubdomain(subdomain: string | null): Promise<EnterpriseDTO> {
    const enterprise =
      await this.enterpriseGateway.getEnterpriseByDomain(subdomain);
    return enterprise;
  }

  async update(
    data: Partial<EnterpriseDTO> & { id: number },
  ): Promise<EnterpriseDTO> {
    return await this.enterpriseGateway.updateEnterprise(data);
  }

  async create(
    data: Omit<
      EnterpriseDTO,
      "id" | "created_at" | "updated_at" | "deleted_at"
    >,
  ): Promise<EnterpriseDTO> {
    return await this.enterpriseGateway.addEnterprise(data);
  }

  async destroy(id: number): Promise<void> {
    await this.enterpriseGateway.removeEnterprise(id);
  }

  async storeWithDefaultTemplate(
    data: EnterpriseWithDefaultTemplate,
  ): Promise<{ enterprise: Enterprise }> {
    return await this.enterpriseGateway.addEnterpriseWithDefaultTemplate(data);
  }

  async addUserToEnterprise(
    userId: number,
    enterpriseId: number,
    trx?: any,
  ): Promise<void> {
    return await this.enterpriseGateway.addUserToEnterprise(
      userId,
      enterpriseId,
      trx,
    );
  }
}
