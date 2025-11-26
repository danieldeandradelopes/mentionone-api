import Enterprise, {
  EnterpriseWithDefaultTemplate,
} from "../../entities/Enterprise";
import Phone from "../../entities/Phone";
import SocialMedia from "../../entities/SocialMedia";
import UserEnterprise from "../../entities/UserEnterprise";
import HttpException from "../../exceptions/HttpException";
import IEnterpriseGateway from "./IEnterpriseGateway";
import { darkTheme, lightTheme } from "./defaultValues";

const trialEndDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

export default class KnexEnterpriseGateway implements IEnterpriseGateway {
  constructor(readonly connection: any) {}
  async addUserToEnterprise(
    userId: number,
    enterpriseId: number,
    trx?: any
  ): Promise<void> {
    await this.connection("user_enterprises")
      .insert({ user_id: userId, enterprise_id: enterpriseId })
      .returning("*");
  }

  async getEnterprises(): Promise<Enterprise[]> {
    const enterprises = await this.connection
      .select("*")
      .from("enterprises")
      .whereNull("deleted_at")
      .orderBy("id");

    return enterprises.map((e: any) => new Enterprise(e));
  }

  async addEnterprise(
    data: Omit<
      import("../../entities/Enterprise").EnterpriseDTO,
      "id" | "created_at" | "updated_at" | "deleted_at"
    >
  ): Promise<Enterprise> {
    const [row] = await this.connection("enterprises")
      .insert({ ...data })
      .returning("*");
    return new Enterprise(row);
  }

  async removeEnterprise(id: number): Promise<void> {
    const affected = await this.connection("enterprises")
      .where("id", id)
      .update({ deleted_at: new Date() });
    if (!affected) throw new Error("Enterprise not found");
  }

  async updateEnterprise(
    data: Partial<import("../../entities/Enterprise").EnterpriseDTO> & {
      id: number;
    }
  ): Promise<Enterprise> {
    const { id, ...fields } = data;
    await this.connection("enterprises").where({ id }).update(fields);
    const updated = await this.getEnterprise(id);
    return updated;
  }

  async getEnterprise(id: number): Promise<Enterprise> {
    const e = await this.connection
      .select("*")
      .from("enterprises")
      .where({ id })
      .first();
    if (!e) throw new Error("Enterprise not found");
    return new Enterprise(e);
  }

  async getEnterprisesByUserId(user_id: number): Promise<Enterprise[]> {
    const enterprises = await this.connection
      .select("*")
      .from("enterprises")
      .where("user_id", user_id);

    return enterprises;
  }

  async addEnterpriseWithDefaultTemplate(
    data: EnterpriseWithDefaultTemplate & { trx?: any } & {
      phone: string;
    }
  ): Promise<{ enterprise: Enterprise }> {
    const {
      name,
      address,
      cover,
      phone,
      description,
      subdomain,
      email,
      document,
      document_type,
      plan_price_id,
      trx,
    } = data;

    const transaction = trx || (await this.connection.transaction());

    try {
      const newEnterprise = {
        name: name,
        address: address,
        email: email,
        document_type: document_type,
        document: document,
        subdomain: subdomain,
        cover: cover,
        description: description,
        auto_approve: true,
      };

      const [insertedEnterprise] = await transaction("enterprises")
        .insert(newEnterprise)
        .returning("*");

      const [phoneInserted] = await transaction("phones")
        .insert({
          phone_number: phone,
          enterprise_id: insertedEnterprise.id,
          is_whatsapp: Boolean(phone.length === 15),
        })
        .returning("*");

      // Criar tema light

      const [lightBrandingInserted] = await transaction("branding")
        .insert(lightTheme(name, insertedEnterprise))
        .returning("*");

      const [darkBrandingInserted] = await transaction("branding")
        .insert(darkTheme(name, insertedEnterprise))
        .returning("*");

      // Configurar horários padrão (segunda a sexta, 8:00 às 18:00)

      await transaction("subscription").insert({
        enterprise_id: insertedEnterprise.id,
        status: "active",
        start_date: new Date(),
        end_date: trialEndDate,
        trial_end_date: trialEndDate,
        plan_price_id: plan_price_id,
      });

      // Se não foi fornecida uma transação externa, fazer commit
      if (!trx) {
        await transaction.commit();
      }

      return {
        enterprise: new Enterprise({
          ...insertedEnterprise,
          phones: phoneInserted,
          branding: [lightBrandingInserted, darkBrandingInserted],
        }),
      };
    } catch (error) {
      // Se não foi fornecida uma transação externa, fazer rollback
      if (!trx) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  async getTransaction(): Promise<any> {
    return await this.connection.transaction();
  }

  async getEnterpriseByDomain(domain: string | null): Promise<Enterprise> {
    if (!domain) throw new Error("Domain missing");
    const e = await this.connection
      .select("*")
      .from("enterprises")
      .where("subdomain", domain)
      .whereNull("deleted_at")
      .first();

    if (!e) throw new Error("Enterprise not found");
    return new Enterprise(e);
  }
}
