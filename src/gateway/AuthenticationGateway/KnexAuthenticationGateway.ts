import UserController from "../../controllers/UserController";
import Authentication from "../../entities/Authentication";
import Phone from "../../entities/Phone";
import User from "../../entities/User";
import HttpException from "../../exceptions/HttpException";
import IEncrypt from "../../infra/Encrypt/IEncrypt";
import IJwtAssign from "../../infra/JwtAssign/IJwtAssign";
import KnexRefreshTokenGateway from "../RefreshTokenGateway/KnexRefreshTokenGateway";
import KnexUserGateway from "../UserGateway/KnexUserGateway";
import IAuthenticationGateway from "./IAuthenticationGateway";

export default class KnexAuthenticationGateway
  implements IAuthenticationGateway
{
  constructor(
    readonly connection: any,
    readonly jwtSign: IJwtAssign,
    readonly encrypt: IEncrypt,
    readonly userGateway: KnexUserGateway,
    readonly refreshTokenGateway: KnexRefreshTokenGateway
  ) {}

  async makeLogin(
    email: string,
    password: string,
    enterpriseId?: number
  ): Promise<Authentication> {
    const currentUser = await this.connection
      .select("users.*")
      .from("users")
      .where({ email: email })
      .first();

    if (!currentUser) {
      throw new HttpException(401, "Failed to make login");
    }

    const isPasswordMatch = await this.encrypt.compareValue(
      password,
      currentUser.password
    );

    if (!isPasswordMatch) {
      throw new HttpException(401, "Failed to make login");
    }

    delete currentUser.password;

    // Buscar informações da barbearia para todos os usuários
    let enterprise = null;

    if (enterpriseId) {
      const enterpriseData = await this.connection
        .select(
          "enterprises.id",
          "enterprises.name",
          "enterprises.address",
          "enterprises.description",
          "enterprises.cover"
        )
        .from("enterprises")
        .where("enterprises.id", enterpriseId)
        .first();

      const phones = await this.connection
        .select("*")
        .from("phones")
        .where("enterprise_id", enterpriseId);

      const formattedPhones: Phone[] = phones.map((phone: Phone) => ({
        id: phone.id,
        phone_number: phone.phone_number,
        is_whatsapp: phone.is_whatsapp,
        is_cellphone: phone.is_cellphone,
        enterprise_id: phone.enterprise_id,
      }));

      enterprise = {
        ...enterpriseData,
        phones: formattedPhones,
      };
    }

    const refreshToken = this.jwtSign.generateRefreshToken({
      id: currentUser.id,
      access_level: currentUser.access_level,
      enterprise_id: enterpriseId || null,
    });

    await this.refreshTokenGateway.create(refreshToken, currentUser.id);

    const data = {
      user: currentUser,
      enterprise,
      token: this.jwtSign.generate({
        id: currentUser.id,
        access_level: currentUser.access_level,
        enterprise_id: enterpriseId || null,
      }),
      refreshToken,
    };

    return data;
  }
}
