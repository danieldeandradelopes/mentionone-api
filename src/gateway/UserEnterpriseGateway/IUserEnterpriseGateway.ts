import UserEnterprise, {
  UserEnterpriseDTO,
} from "../../entities/UserEnterprise";

export interface IUserEnterpriseGateway {
  addUserToEnterprise(data: UserEnterpriseDTO): Promise<UserEnterprise>;
  getEnterprisesByUser(user_id: number): Promise<UserEnterprise[]>;
  getUsersByEnterprise(enterprise_id: number): Promise<UserEnterprise[]>;
  removeUserFromEnterprise(
    user_id: number,
    enterprise_id: number
  ): Promise<void>;
  updateUserRole(
    user_id: number,
    enterprise_id: number,
    role: string
  ): Promise<UserEnterprise>;
}
