import Authentication from "../../entities/Authentication";

export default interface IAuthenticationGateway {
  makeLogin(
    email: string,
    password: string,
    enterpriseId?: number
  ): Promise<Authentication>;
}
