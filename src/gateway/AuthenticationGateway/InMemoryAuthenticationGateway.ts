import Authentication from "../../entities/Authentication";
import User from "../../entities/User";
import HttpException from "../../exceptions/HttpException";
import IAuthenticationGateway from "./IAuthenticationGateway";

export default class InMemoryAuthenticationGateway
  implements IAuthenticationGateway
{
  constructor(readonly users: User[]) {}

  async makeLogin(email: string, password: string): Promise<Authentication> {
    const currentUser = this.users.find((user) => user.email === email);

    if (!currentUser) throw new HttpException(404, "Failed to make login");

    if (currentUser.password !== password)
      throw new HttpException(404, "Failed to make login");

    const data = {
      user: currentUser,
      Enterprise: null,
      token: "novotoken",
    };

    return data;
  }
}
