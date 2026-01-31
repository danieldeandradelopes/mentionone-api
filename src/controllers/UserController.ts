import Authentication from "../entities/Authentication";
import User, { ListUsersRequest } from "../entities/User";
import UserSession from "../entities/UserSession";
import HttpException from "../exceptions/HttpException";
import KnexAuthenticationGateway from "../gateway/AuthenticationGateway/KnexAuthenticationGateway";
import IUserGateway from "../gateway/UserGateway/IUserGateway";
import { PaginatedResult } from "../types/PaginatedResult";
import EnterpriseController from "./EnterpriseController";
interface IUserControler {
  store(data: {
    name: string;
    email: string;
    password: string;
    accessLevel: "superadmin" | "admin" | "employee" | "customer";
    phone: string;
    enterpriseId: number;
    trx?: any;
    commitTransaction?: boolean;
  }): Promise<Authentication>;
  list(data: ListUsersRequest): Promise<PaginatedResult<User>>;
  get(id: number): Promise<User>;
  getUserSession(id: number, userId: number): Promise<UserSession>;
  getUserByEmail(email: string): Promise<User>;
  update(data: UserUpdate): Promise<User>;
  updatePhone(id: number, phone: string): Promise<User>;
}

type UserUpdate = {
  name: string;
  email: string;
  phone: string;
  password: string;
  currentPassword: string;
  id: number;
  avatar: string;
};

export default class UserController implements IUserControler {
  constructor(
    readonly userGateway: IUserGateway,
    readonly enterpriseController: EnterpriseController,
    readonly authGateway: KnexAuthenticationGateway
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userGateway.getUserByEmail(email);
    return user;
  }

  async getUserSession(id: number, userId: number) {
    const userSession = await this.userGateway.getUserSession(id, userId);

    return userSession;
  }

  async store(data: {
    name: string;
    email: string;
    password: string;
    accessLevel: "superadmin" | "admin" | "employee" | "customer";
    phone: string;
    enterpriseId: number;
    trx?: any;
    commitTransaction?: boolean;
  }): Promise<Authentication> {
    const {
      name,
      email,
      password,
      accessLevel,
      phone,
      enterpriseId,
      trx: externalTrx,
      commitTransaction,
    } = data;

    const trx = externalTrx || (await this.userGateway.getTransaction());
    const shouldCommit =
      typeof commitTransaction === "boolean"
        ? commitTransaction
        : !externalTrx;

    try {
      const user = await this.userGateway.addUser(
        name,
        email,
        password,
        accessLevel,
        phone,
        trx
      );

      const userId = user.id;

      await this.enterpriseController.addUserToEnterprise(
        userId,
        enterpriseId,
        trx
      );

      if (shouldCommit) {
        await trx.commit();
      }

      const auth = await this.authGateway.makeLogin(
        email,
        password,
        enterpriseId
      );

      return auth;
    } catch (error) {
      if (shouldCommit) {
        await trx.rollback();
      }
      throw error;
    }
  }

  async get(id: number) {
    const user = await this.userGateway.getUser(id);

    return user;
  }

  async list(data: ListUsersRequest) {
    return await this.userGateway.getUsers(data.page, data.limit);
  }

  async update(data: UserUpdate): Promise<User> {
    const { name, email, phone, password, currentPassword, id, avatar } = data;

    if (!name || !email || !phone) {
      throw new HttpException(400, "All fields are required");
    }

    const user = await this.userGateway.getUser(id);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    if (currentPassword) {
      const isPasswordValid = await this.userGateway.checkPassword(
        user.id,
        currentPassword
      );

      if (!isPasswordValid) {
        throw new HttpException(400, "Current password is invalid");
      }
    }

    return await this.userGateway.updateUser({
      ...user,
      name,
      email,
      phone,
      password,
      avatar,
    });
  }

  async updatePhone(id: number, phone: string): Promise<User> {
    return await this.userGateway.updateUserPhone(id, phone);
  }

  async destroy(id: number) {
    await this.userGateway.removeUser(id);
  }
}
