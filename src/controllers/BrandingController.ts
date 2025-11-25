import Branding from "../entities/Branding";
import IBrandingGateway, {
  BrandingData,
} from "../gateway/BrandingGateway/IBrandingGateway";

interface IBrandingController {
  store(data: BrandingData): Promise<Branding>;
  update(data: BrandingData): Promise<Branding>;
  get(enterpriseId: number): Promise<Branding[]>;
}

export default class BrandingController implements IBrandingController {
  constructor(readonly brandingGateway: IBrandingGateway) {}

  async store(data: BrandingData) {
    const branding = await this.brandingGateway.addBranding(data);
    return branding;
  }

  async get(enterpriseId: number) {
    const branding = await this.brandingGateway.getBranding(enterpriseId);
    return branding;
  }

  async update(data: BrandingData) {
    const branding = await this.brandingGateway.updateBranding(data);
    return branding;
  }
}
