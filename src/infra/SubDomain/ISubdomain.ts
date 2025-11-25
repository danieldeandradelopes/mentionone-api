export default interface ISubDomain {
  createSubdomain(subdomain: string): Promise<boolean>;
}
