import IEncrypt from "./IEncrypt";
import bcryptjs from "bcryptjs";

export default class BCryptAdapter implements IEncrypt {
  private saltRounds = 10;

  async encrypt(value: string): Promise<string> {
    return await bcryptjs.hash(value, this.saltRounds);
  }

  async compareValue(value: string, hash: string): Promise<boolean> {
    return await bcryptjs.compare(value, hash);
  }
}
