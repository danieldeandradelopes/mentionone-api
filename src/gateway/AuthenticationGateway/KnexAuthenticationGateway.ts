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
      .where({ email: email });

    const accessLevel = currentUser[0].access_level;

    if (accessLevel === "client") {
      const customer = await this.connection
        .select("customers.*")
        .from("customers")
        .where({ user_id: currentUser[0].id })
        .first();

      if (!customer || customer.enterprise_id !== enterpriseId) {
        throw new HttpException(404, "Failed to make login");
      }
    }

    if (accessLevel === "barber") {
      const barber = await this.connection
        .select("barbers.*")
        .from("barbers")
        .where({ user_id: currentUser[0].id })
        .first();

      if (!barber || barber.enterprise_id !== enterpriseId) {
        throw new HttpException(404, "Failed to make login");
      }
    }

    const isPasswordMatch = await this.encrypt.compareValue(
      password,
      currentUser[0].password
    );

    if (!isPasswordMatch) throw new HttpException(400, "Failed to make login");

    delete currentUser[0].password;

    // Buscar informações da barbearia para todos os usuários
    let enterprise = null;

    if (enterpriseId) {
      const enterpriseData = await this.connection
        .select(
          "enterprises.id",
          "enterprises.name",
          "enterprises.address",
          "enterprises.description",
          "enterprises.cover",
          "enterprises.latitude",
          "enterprises.longitude"
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

      if (enterpriseData) {
        // Se for barbeiro ou admin, buscar informações adicionais

        const barberInfo = await this.connection
          .select("barbers.specialties", "barbers.bio", "barbers.rate")
          .from("barbers")
          .where({
            enterprise_id: enterpriseId,
            user_id: currentUser[0].id,
          })
          .first();

        if (barberInfo) {
          enterpriseData.specialties = barberInfo.specialties;
          enterpriseData.bio = barberInfo.bio;
          enterpriseData.rate = barberInfo.rate;
        }

        // Buscar horários de funcionamento
        const workingHours = await this.connection
          .select("working_hours.*")
          .from("working_hours")
          .where("barber_shop_id", enterpriseData.id)
          .orderBy("week_day");

        // Buscar slots de horário para cada dia
        const workingHoursWithSlots = await Promise.all(
          workingHours.map(async (wh: any) => {
            const timeSlots = await this.connection("working_hours_time_slots")
              .select("time_slot")
              .where("working_hours_id", wh.id)
              .orderBy("time_slot");

            return {
              id: wh.id,
              week_day: wh.week_day,
              time_slots: timeSlots.map((slot: any) => slot.time_slot),
              is_open: wh.is_open,
              created_at: wh.created_at,
              updated_at: wh.updated_at,
            };
          })
        );

        enterprise = {
          ...enterpriseData,
          working_hours: workingHoursWithSlots,
          phones: formattedPhones,
        };
      }
    }

    const refreshToken = this.jwtSign.generateRefreshToken({
      id: currentUser[0].id,
      access_level: currentUser[0].access_level,
      enterprise_id: enterpriseId || null,
    });

    await this.refreshTokenGateway.create(refreshToken, currentUser[0].id);

    const data = {
      user: currentUser[0],
      enterprise,
      token: this.jwtSign.generate({
        id: currentUser[0].id,
        access_level: currentUser[0].access_level,
        enterprise_id: enterpriseId || null,
      }),
      refreshToken,
    };

    return data;
  }
}
