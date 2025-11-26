import { Knex } from "knex";
import UserEnterprise, {
  UserEnterpriseDTO,
  UserEnterpriseProps,
} from "../../entities/UserEnterprise";
import { IUserEnterpriseGateway } from "./IUserEnterpriseGateway";

export class KnexUserEnterpriseGateway implements IUserEnterpriseGateway {
  constructor(private readonly knex: Knex) {}

  async addUserToEnterprise(data: UserEnterpriseDTO): Promise<UserEnterprise> {
    const [row] = await this.knex<UserEnterpriseProps>("user_enterprises")
      .insert(data)
      .returning("*");
    return new UserEnterprise(row);
  }

  async getEnterprisesByUser(user_id: number): Promise<UserEnterprise[]> {
    const rows = await this.knex<UserEnterpriseProps>("user_enterprises").where(
      { user_id }
    );
    return rows.map((row) => new UserEnterprise(row));
  }

  async getUsersByEnterprise(enterprise_id: number): Promise<UserEnterprise[]> {
    const rows = await this.knex<UserEnterpriseProps>("user_enterprises").where(
      { enterprise_id }
    );
    return rows.map((row) => new UserEnterprise(row));
  }

  async removeUserFromEnterprise(
    user_id: number,
    enterprise_id: number
  ): Promise<void> {
    await this.knex<UserEnterpriseProps>("user_enterprises")
      .where({ user_id, enterprise_id })
      .del();
  }

  async updateUserRole(
    user_id: number,
    enterprise_id: number,
    role: string
  ): Promise<UserEnterprise> {
    const [row] = await this.knex<UserEnterpriseProps>("user_enterprises")
      .where({ user_id, enterprise_id })
      .update({ role })
      .returning("*");
    return new UserEnterprise(row);
  }
}
