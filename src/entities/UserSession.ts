import { EnterpriseAuthentication } from "./Authentication";
import Phone from "./Phone";
import User from "./User";

export interface UserSessionProps {
  user: User;
  Enterprise?: EnterpriseAuthentication | null;
  phones?: Phone[] | null;
}

export default class UserSession {
  readonly user: User;
  readonly Enterprise?: EnterpriseAuthentication | null;
  readonly phones?: Phone[] | null;

  constructor({ user, Enterprise, phones }: UserSessionProps) {
    this.user = user;
    this.Enterprise = Enterprise;
    this.phones = phones;
  }
}
