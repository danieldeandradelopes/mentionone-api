import Manifest from "../../entities/Manifest";

export default interface IManifestGateway {
  getManifest(enterpriseId: number): Promise<Manifest>;
}
