import Enterprise from "../../entities/Enterprise";
import Phone from "../../entities/Phone";
import SocialMedia from "../../entities/SocialMedia";
import HttpException from "../../exceptions/HttpException";
import IEnterpriseGateway from "./IEnterpriseGateway";
import { darkTheme, lightTheme } from "./defaultValues";

const trialEndDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);

export default class KnexEnterpriseGateway implements IEnterpriseGateway {
  constructor(readonly connection: any) {}
  addUserToEnterprise(
    userId: number,
    enterpriseId: number,
    trx?: any
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async getEnterprises(): Promise<Enterprise[]> {
    const enterprises: Enterprise[] = await this.connection
      .select("*")
      .from("enterprises")
      .whereNull("deleted_at")
      .orderBy("id");

    const formattedEnterprises: Enterprise[] = [];

    for (const enterprise of enterprises) {
      formattedEnterprises.push(new Enterprise({ ...enterprise }));
    }

    return formattedEnterprises;
  }

  async addEnterprise(
    name: string,
    address: string,
    cover: string,
    description: string,
    phone: string
  ): Promise<Enterprise> {
    const newEnterprise = {
      name: name,
      description: description,
      address: address,
      cover: cover,
    };

    const trx = await this.connection.transaction();

    if (!name || !description || !phone) {
      throw new HttpException(400, "All inputs is required");
    }

    const [insertedEnterprise] = await trx("enterprises")
      .insert(newEnterprise)
      .returning("*");

    const [phoneInserted] = await trx("phones")
      .insert({
        phone_number: phone,
        enterprise_id: insertedEnterprise.id,
      })
      .returning("*");

    const formattedEnterprise = new Enterprise({
      ...insertedEnterprise,
      phones: phoneInserted,
    });

    await trx.commit();

    return formattedEnterprise;
  }

  async removeEnterprise(id: number): Promise<void> {
    const data = await this.connection("enterprises")
      .where("id", id)
      .update({ deleted_at: new Date() });

    if (!data) throw new HttpException(404, "Enterprise not found");
  }

  async updateEnterprise(data: Enterprise): Promise<Enterprise> {
    const currentEnterprise: Enterprise = await this.connection
      .select("*")
      .from("enterprises")
      .where("id", data.id)
      .first();

    if (!currentEnterprise)
      throw new HttpException(404, "Enterprise not found");

    const updatedEnterprise = await this.connection("enterprises")
      .where("id", data.id)
      .update({
        ...currentEnterprise,
        ...data,
      })
      .returning("*");

    if (!updatedEnterprise.length)
      throw new HttpException(404, "Failed to update this enterprise");

    return updatedEnterprise[0];
  }

  async getEnterprise(id: number): Promise<Enterprise> {
    const enterprises = await this.connection
      .select("*")
      .from("enterprises")
      .where({ id: id });

    const socialMedias = await this.connection
      .select("*")
      .from("social_media")
      .where("enterprise_id", id);

    const phones: Phone = await this.connection
      .select("*")
      .from("phones")
      .where("enterprise_id", id);

    const branding = await this.connection
      .select("*")
      .from("branding")
      .where("enterprise_id", id);

    if (!enterprises.length)
      throw new HttpException(404, "Enterprise not found");

    return new Enterprise({
      ...enterprises[0],
      social_medias: socialMedias,
      phones: phones,
      branding: branding,
    });
  }

  async getEnterprisesByUserId(user_id: number): Promise<Enterprise[]> {
    const enterprises = await this.connection
      .select("*")
      .from("enterprises")
      .where("user_id", user_id);

    return enterprises;
  }

  async addEnterpriseWithDefaultTemplate(
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
  ): Promise<{ enterprise: Enterprise }> {
    if (
      !name ||
      !description ||
      !phone ||
      !subdomain ||
      !plan_price_id ||
      !document ||
      !document_type
    ) {
      throw new HttpException(400, "Todos os campos são obrigatórios");
    }

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
        latitude: latitude,
        longitude: longitude,
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

  async getEnterpriseByDomain(domain: string): Promise<Enterprise> {
    const enterprise: Enterprise = await this.connection
      .select("*")
      .from("enterprises")
      .where("subdomain", domain)
      .whereNull("deleted_at")
      .first();

    const socialMedias: SocialMedia[] = await this.connection
      .select("*")
      .from("social_media")
      .where("enterprise_id", enterprise.id);

    const phones: Phone[] = await this.connection
      .select("*")
      .from("phones")
      .where("enterprise_id", enterprise.id);

    const branding = await this.connection
      .select("*")
      .from("branding")
      .where("enterprise_id", enterprise.id);

    return new Enterprise({
      ...enterprise,
      social_medias: socialMedias,
      phones,
      branding,
    });
  }
}
