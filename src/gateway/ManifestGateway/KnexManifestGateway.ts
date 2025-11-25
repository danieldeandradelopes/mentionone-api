import Manifest from "../../entities/Manifest";
import HttpException from "../../exceptions/HttpException";
import IManifestGateway from "./IManifestGateway";

export default class KnexManifestGateway implements IManifestGateway {
  constructor(readonly connection: any) {}

  async getManifest(enterpriseId: number): Promise<Manifest> {
    const currentManifest: Manifest = await this.connection
      .select("*")
      .from("manifest")
      .where("enterprise_Id", enterpriseId)
      .first();

    if (!currentManifest) throw new HttpException(404, "Manifest not found");

    return new Manifest({
      ...currentManifest,
    });
  }
}
