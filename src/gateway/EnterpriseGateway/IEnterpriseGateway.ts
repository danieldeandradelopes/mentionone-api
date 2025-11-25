import Enterprise from "../../entities/Enterprise";

export default interface IEnterpriseGateway {
  getEnterprises(): Promise<Enterprise[]>;
  addEnterprise(
    name: string,
    address: string,
    phone: string,
    cover: string,
    description: string,
    statusPayment?: string
  ): Promise<Enterprise>;
  addEnterpriseWithDefaultTemplate(
    name: string,
    address: string,
    cover: string,
    phone: string,
    description: string,
    subdomain: string,
    latitude: number,
    longitude: number,
    email: string,
    document: string,
    document_type: string,
    plan_price_id: number,
    trx?: any
  ): Promise<{ enterprise: Enterprise }>;
  removeEnterprise(id: number): Promise<void>;
  updateEnterprise(data: Enterprise): Promise<Enterprise>;
  getEnterprise(id: number): Promise<Enterprise>;
  getEnterprisesByUserId(userId: number): Promise<Enterprise[]>;
  getTransaction(): Promise<any>;
  getEnterpriseByDomain(domain: string): Promise<Enterprise>;
  addUserToEnterprise(
    userId: number,
    enterpriseId: number,
    trx?: any
  ): Promise<void>;
}
