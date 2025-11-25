import Authentication from "../entities/Authentication";
import IAuthenticationGateway from "../gateway/AuthenticationGateway/IAuthenticationGateway";

interface IAuthenticationController {
  makeLogin(data: {
    email: string;
    password: string;
    enterpriseId?: number;
  }): Promise<Authentication>;
}

export default class AuthenticationController
  implements IAuthenticationController
{
  constructor(readonly authGateway: IAuthenticationGateway) {}

  async makeLogin(data: {
    email: string;
    password: string;
    enterpriseId?: number;
  }): Promise<Authentication> {
    const { email, password, enterpriseId } = data;

    return await this.authGateway.makeLogin(email, password, enterpriseId);
  }
}
