import Branding from "../../entities/Branding";

export type BrandingData = Omit<Branding, "id" | "barber_shop">;

export default interface IBrandingGateway {
  getBranding(enterpriseId: number): Promise<Branding[]>;
  addBranding(branding: BrandingData): Promise<Branding>;
  updateBranding(branding: BrandingData): Promise<Branding>;
}
