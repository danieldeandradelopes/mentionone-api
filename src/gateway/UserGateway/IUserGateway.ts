import User from "../../entities/User";
import UserSession from "../../entities/UserSession";
import { PaginatedResult } from "../../types/PaginatedResult";

export default interface IUserGateway {
  getUsers(page: number, limit: number): Promise<PaginatedResult<User>>;
  addUser(
    name: string,
    email: string,
    password: string,
    accessLevel: "superadmin" | "admin" | "employee" | "customer",
    phone: string,
    trx?: any
  ): Promise<User>;
  removeUser(id: number): Promise<any>;
  updateUser(data: User): Promise<User>;
  getUser(id: number): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  getTransaction(): Promise<any>;
  checkPassword(userId: number, password: string): Promise<boolean>;
  getUserSession(id: number, userId: number): Promise<UserSession>;
  updateUserPhone(id: number, phone: string): Promise<User>;
  setOnboardingCompleted(userId: number, enterpriseId: number): Promise<void>;
  getFirstEnterpriseIdByUserId(userId: number): Promise<number | null>;
}
