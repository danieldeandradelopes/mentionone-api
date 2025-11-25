import Manifest from "../entities/Manifest";
import IManifestGateway from "../gateway/ManifestGateway/IManifestGateway";

interface IManifestController {
  get(enterpriseId: number): Promise<Manifest>;
}

export default class ManifestController implements IManifestController {
  constructor(readonly manifestGateway: IManifestGateway) {}

  async get(enterpriseId: number) {
    const manifest = await this.manifestGateway.getManifest(enterpriseId);
    return manifest;
  }
}
