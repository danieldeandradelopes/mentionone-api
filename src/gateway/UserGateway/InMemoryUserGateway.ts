import Barber, { BarberListResponse } from "../../entities/Barber";
import User from "../../entities/User";
import UserSession from "../../entities/UserSession";
import HttpException from "../../exceptions/HttpException";
import IJwtAssign from "../../infra/JwtAssign/IJwtAssign";
import { PaginatedResult } from "../../types/PaginatedResult";
import IUserGateway from "./IUserGateway";

export default class InMemoryUserGateway implements IUserGateway {
  private users: User[];

  constructor(users: User[], readonly jwtSign: IJwtAssign) {
    this.users = users;
  }
  listCustomers(enterpriseId: number): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  getBarbersByenterpriseId(
    enterpriseId: number
  ): Promise<BarberListResponse[]> {
    throw new Error("Method not implemented.");
  }
  updateBarber(
    id: number,
    name: string,
    email: string,
    phone: string,
    digital_comission: number,
    physical_comission: number,
    services_comission: number,
    trx?: any
  ): Promise<{ user: User; barber: Barber }> {
    throw new Error("Method not implemented.");
  }

  addBarber(
    name: string,
    email: string,
    password: string,
    phone: string,
    enterpriseId: number,
    digital_comission: number,
    physical_comission: number,
    services_comission: number,
    trx?: any
  ): Promise<{ user: User; barber: Barber }> {
    throw new Error("Method not implemented.");
  }
  updateUserPhone(id: number, phone: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getUserSession(id: number, userId: number): Promise<UserSession> {
    throw new Error("Method not implemented.");
  }
  addCustomer(userId: number, enterpriseId: number, trx?: any): Promise<User> {
    throw new Error("Method not implemented.");
  }
  addProviderUser(
    name: string,
    email: string,
    accessLevel: "client",
    provider: string,
    providerUid: string,
    enterpriseId: number,
    phone?: string,
    avatar?: string,
    trx?: any
  ): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getUserByEmail(email: string): Promise<User> {
    throw new Error("Method not implemented.");
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
    const total = this.users.length;
    const totalPages = Math.ceil(total / limit);

    // Aplicar paginação
    const paginatedUsers = this.users.slice(offset, offset + limit);

    return {
      data: paginatedUsers,
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
    access_level: "barber" | "client" | "admin",
    phone: string = "",
    trx?: any
  ): Promise<User> {
    const user = new User({
      id: this.generateId(),
      name,
      email,
      access_level,
      avatar: "",
      phone,
      password,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    this.users.push(user);

    return user;
  }

  async removeUser(id: number) {
    const localUsers = [...this.users];

    const user = localUsers.find((user) => user.id === id);

    if (!user) throw new HttpException(404, "User not found");

    const users = this.users.filter((user) => user.id !== id);

    this.users = users;
  }

  async updateUser(userToUpdate: User): Promise<User> {
    const localUsers = [...this.users];
    const index = localUsers.findIndex((user) => user.id === userToUpdate.id);

    const { id, name, email, access_level, avatar, phone, password } =
      userToUpdate;

    if (index === -1) throw new HttpException(404, "User not found");

    const newUser = new User({
      id,
      name,
      email,
      access_level,
      avatar,
      phone,
      password,
    });

    localUsers[index] = newUser;

    this.users = localUsers;

    return newUser;
  }

  async getUser(id: number): Promise<User> {
    const currentUser = this.users.find((user) => user.id === id);

    if (!currentUser) throw new HttpException(404, "User not found");

    return currentUser;
  }

  generateId() {
    if (!this.users.length) return 1;

    return this.users[this.users.length - 1].id + 1;
  }

  async getTransaction(): Promise<any> {
    // Para implementação em memória, retornamos null como transação
    return null;
  }

  async checkPassword(userId: number, password: string): Promise<boolean> {
    const user = this.users.find((user) => user.id === userId);
    if (!user) return false;

    return user.password === password;
  }

  async getBarbers(): Promise<User[]> {
    return this.users.filter((user) => user.access_level === "barber");
  }

  async getAdmins(): Promise<User[]> {
    return this.users.filter((user) => user.access_level === "admin");
  }
}
