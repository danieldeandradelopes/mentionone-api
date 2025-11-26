import Phone from "../../entities/Phone";
import User from "../../entities/User";
import UserSession from "../../entities/UserSession";
import HttpException from "../../exceptions/HttpException";
import IEncrypt from "../../infra/Encrypt/IEncrypt";
import IJwtAssign from "../../infra/JwtAssign/IJwtAssign";
import { PaginatedResult } from "../../types/PaginatedResult";
import IUserGateway from "./IUserGateway";

export default class KnexUserGateway implements IUserGateway {
  constructor(
    readonly connection: any,
    readonly Encrypt: IEncrypt,
    readonly jwtSign: IJwtAssign
  ) {}

  async getUserSession(
    userId: number,
    enterpriseId: number
  ): Promise<UserSession> {
    const user = await this.connection("users").where("id", userId).first();

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const Enterprise = await this.connection("Enterprise")
      .where("id", enterpriseId)
      .first();

    if (!Enterprise) {
      throw new HttpException(404, "Barber shop not found");
    }

    const formattedUser = { ...user };

    delete formattedUser.password;

    let formattedEnterprise = null;

    if (enterpriseId) {
      const EnterpriseData = await this.connection
        .select(
          "Enterprise.id",
          "Enterprise.name",
          "Enterprise.address",
          "Enterprise.description",
          "Enterprise.cover"
        )
        .from("Enterprise")
        .where("Enterprise.id", enterpriseId)
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

      if (EnterpriseData) {
        // Se for barbeiro ou admin, buscar informações adicionais

        const barberInfo = await this.connection
          .select("barbers.specialties", "barbers.bio", "barbers.rate")
          .from("barbers")
          .where({
            enterprise_id: enterpriseId,
            user_id: user.id,
          })
          .first();

        if (barberInfo) {
          EnterpriseData.specialties = barberInfo.specialties;
          EnterpriseData.bio = barberInfo.bio;
          EnterpriseData.rate = barberInfo.rate;
        }

        // Buscar horários de funcionamento
        const workingHours = await this.connection
          .select("working_hours.*")
          .from("working_hours")
          .where("enterprise_id", EnterpriseData.id)
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

        formattedEnterprise = {
          ...EnterpriseData,
          working_hours: workingHoursWithSlots,
          phones: formattedPhones,
        };
      }
    }

    const userSession = new UserSession({
      user: formattedUser,
      Enterprise: formattedEnterprise,
    });

    return userSession;
  }

  async getUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResult<User>> {
    // Validação dos parâmetros
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100; // Limite máximo para evitar sobrecarga

    const offset = (page - 1) * limit;

    // Buscar total de usuários
    const totalResult = await this.connection("users")
      .count("* as total")
      .first();
    const total = parseInt(totalResult.total);

    // Buscar usuários paginados
    const users: User[] = await this.connection
      .select(
        "id",
        "name",
        "email",
        "access_level",
        "phone",
        "avatar",
        "created_at",
        "updated_at"
      )
      .from("users")
      .orderBy("id")
      .limit(limit)
      .offset(offset);

    const formattedUsers: User[] = [];

    for (const user of users) {
      formattedUsers.push(new User({ ...user }));
    }

    const totalPages = Math.ceil(total / limit);

    return {
      data: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async addUser(
    name: string,
    email: string,
    password: string,
    accessLevel: "superadmin" | "admin" | "employee" | "customer",
    phone: string,
    trx?: any
  ): Promise<User> {
    const newUser = {
      name: name,
      email: email,
      password: await this.Encrypt.encrypt(password),
      access_level: accessLevel,
      phone: phone,
    };

    const emailAlreadyExists = await this.connection
      .select("*")
      .from("users")
      .where("email", email);

    if (emailAlreadyExists.length) {
      throw new HttpException(404, "Email already exists");
    }

    if (!name || !email || !password) {
      throw new HttpException(400, "All inputs is required");
    }

    const query = trx ? trx("users") : this.connection("users");
    const insertedUser = await query.insert(newUser).returning("*");

    delete insertedUser[0].password;

    return insertedUser[0];
  }

  async removeUser(id: number): Promise<any> {
    const data = await this.connection("users").where("id", id).update({
      is_deleted: true,
      deleted_at: new Date(),
    });

    if (!data) throw new HttpException(404, "User not found");
  }

  async updateUser(data: User): Promise<User> {
    const currentUser = await this.connection
      .select("*")
      .from("users")
      .where("id", data.id);

    if (!currentUser.length) throw new HttpException(404, "User not found");

    let updatedPassword = "";

    if (data.password) {
      updatedPassword = await this.Encrypt.encrypt(data.password);
    } else {
      updatedPassword = currentUser[0].password;
    }

    if (data.email) {
      const emailAlreadyExists = await this.connection
        .select("*")
        .from("users")
        .where("email", data.email);

      if (
        emailAlreadyExists.length &&
        emailAlreadyExists[0].id !== currentUser[0].id
      ) {
        throw new HttpException(404, "Email already exists");
      }
    }

    const updatedUser = await this.connection("users")
      .where("id", data.id)
      .update({
        ...currentUser[0],
        ...data,
        password: updatedPassword,
      })
      .returning("*");

    if (!updatedUser.length)
      throw new HttpException(404, "Failed to update this user");

    delete updatedUser[0].password;

    return updatedUser[0];
  }

  async getUser(id: number): Promise<User> {
    const users = await this.connection
      .select("*")
      .from("users")
      .where({ id: id });

    if (!users.length) throw new HttpException(404, "User not found");

    delete users[0].password;

    return users[0];
  }

  async getUserByEmail(email: string): Promise<User> {
    const users = await this.connection
      .select("*")
      .from("users")
      .where({ email: email })
      .first();

    if (!users.length) throw new HttpException(404, "User not found");

    delete users[0].password;

    return users[0];
  }

  async getTransaction(): Promise<any> {
    return await this.connection.transaction();
  }

  async checkPassword(userId: number, password: string): Promise<boolean> {
    const user = await this.connection
      .select("password")
      .from("users")
      .where("id", userId)
      .first();

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    return await this.Encrypt.compareValue(password, user.password);
  }

  async getBarbers(): Promise<User[]> {
    const barbers = await this.connection
      .select("*")
      .from("users")
      .where("access_level", "barber");

    return barbers;
  }

  async getAdmins(): Promise<User[]> {
    const admins = await this.connection
      .select("*")
      .from("users")
      .where("access_level", "admin");

    return admins;
  }

  async updateUserPhone(id: number, phone: string): Promise<User> {
    const user = await this.connection("users").where("id", id).first();

    if (!user) throw new HttpException(404, "User not found");

    const updatedUser = await this.connection("users")
      .where("id", id)
      .update({ phone })
      .returning("*");

    delete updatedUser[0].password;

    return updatedUser[0];
  }

  async listCustomers(enterpriseId: number): Promise<User[]> {
    const customers = await this.connection("users")
      .where("access_level", "client")
      .join("customers", "customers.user_id", "users.id")
      .where("customers.enterprise_id", enterpriseId)
      .where("is_deleted", false);

    const formattedCustomers: User[] = [];

    for (const customer of customers) {
      formattedCustomers.push(
        new User({
          ...customer,
          id: customer.user_id,
        })
      );
    }

    return formattedCustomers;
  }
}
