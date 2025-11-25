import Enterprise from "../../entities/Enterprise";
import Branding from "../../entities/Branding";
import HttpException from "../../exceptions/HttpException";
import { cleanObject } from "../../utils/clear";
import IBrandingGateway, { BrandingData } from "./IBrandingGateway";

export default class KnexBrandingGateway implements IBrandingGateway {
  constructor(readonly connection: any) {}

  async addBranding(branding: BrandingData): Promise<Branding> {
    const [newBranding] = await this.connection
      .insert(branding)
      .into("branding")
      .returning("*");

    return new Branding(newBranding);
  }

  async updateBranding(branding: BrandingData): Promise<Branding> {
    const currentBranding = await this.connection
      .select("*")
      .from("branding")
      .where("enterprise_Id", branding.enterprise_Id)
      .first();

    if (!currentBranding) throw new HttpException(404, "Branding not found");

    const cleanedBranding = cleanObject(branding);

    const updatedBranding = await this.connection
      .update({ ...currentBranding, ...cleanedBranding })
      .into("branding")
      .where("enterprise_Id", branding.enterprise_Id)
      .returning("*");

    return new Branding(updatedBranding);
  }

  async getBranding(enterpriseId: number): Promise<Branding[]> {
    const allBrandings: Branding[] = await this.connection
      .select("*")
      .from("branding")
      .where("enterprise_Id", enterpriseId)
      .limit(2);

    const Enterprise: Enterprise = await this.connection
      .select(
        "id",
        "address",
        "cover",
        "description",
        "latitude",
        "longitude",
        "name",
        "timezone",
        "id"
      )
      .from("Enterprise")
      .where("id", enterpriseId)
      .first();

    if (!Enterprise) throw new Error("Barber Shop Not Found");

    if (!allBrandings.length)
      throw new HttpException(404, "Branding not found");

    return allBrandings.map(
      (branding: any) =>
        new Branding({
          ...branding,
          barber_shop: Enterprise,
        })
    );
  }
}
