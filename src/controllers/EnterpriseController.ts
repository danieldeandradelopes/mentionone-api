import Enterprise, {
  EnterpriseWithDefaultTemplate,
} from "../entities/Enterprise";
import { container, Registry } from "../infra/ContainerRegistry";
import CloudFlareAdapter from "../infra/SubDomain/CloudFlareAdapter";
import VercelAdapter from "../infra/SubDomain/VercelAdapter";
import IController from "./IController";
import IEnterpriseGateway from "../gateway/EnterpriseGateway/IEnterpriseGateway";

interface IEnterpriseController extends IController {
  getBySubdomain(subdomain: string): Promise<any>;
  storeWithDefaultTemplate(data: EnterpriseWithDefaultTemplate): Promise<{
    enterprise: Enterprise;
  }>;
  list(): Promise<Enterprise[]>;
  addUserToEnterprise(
    userId: number,
    enterpriseId: number,
    trx?: any
  ): Promise<void>;
}

export default class EnterpriseController implements IEnterpriseController {
  constructor(readonly enterpriseGateway: IEnterpriseGateway) {}
  store(data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async addUserToEnterprise(
    userId: number,
    enterpriseId: number,
    trx?: any
  ): Promise<void> {
    await this.enterpriseGateway.addUserToEnterprise(userId, enterpriseId, trx);
  }

  async get(id: number) {
    const enterprise = await this.enterpriseGateway.getEnterprise(id);

    return enterprise;
  }

  async list(): Promise<Enterprise[]> {
    return await this.enterpriseGateway.getEnterprises();
  }

  async getBySubdomain(subdomain: string) {
    const enterprise = await this.enterpriseGateway.getEnterpriseByDomain(
      subdomain
    );
    return enterprise;
  }

  async update(data: Enterprise): Promise<Enterprise> {
    return await this.enterpriseGateway.updateEnterprise(data);
  }

  async storeWithDefaultTemplate({
    name,
    address,
    cover,
    phone,
    description,
    subdomain,
    latitude,
    longitude,
    email,
    document,
    document_type,
    plan_price_id,
  }: EnterpriseWithDefaultTemplate): Promise<{
    enterprise: Enterprise;
  }> {
    const trx = await this.enterpriseGateway.getTransaction();
    try {
      const { enterprise } =
        await this.enterpriseGateway.addEnterpriseWithDefaultTemplate(
          name,
          address,
          cover,
          phone,
          description,
          subdomain,
          latitude,
          longitude,
          email,
          document,
          document_type,
          plan_price_id,
          trx
        );

      const subdomainCreated = await container
        .get<CloudFlareAdapter>(Registry.CloudFlareAdapter)
        .createSubdomain(subdomain);

      if (!subdomainCreated) {
        trx.rollback();
        throw new Error("Erro ao criar subdomínio na Cloudflare");
      }

      const vercelAdapter = container.get<VercelAdapter>(
        Registry.VercelAdapter
      );
      const vercelSubdomainCreated = await vercelAdapter.addSubdomain(
        subdomain
      );

      if (!vercelSubdomainCreated) {
        trx.rollback();
        throw new Error("Erro ao criar subdomínio na Vercel");
      }

      await trx.commit();

      return { enterprise };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async destroy(id: number) {
    await this.enterpriseGateway.removeEnterprise(id);
  }
}
