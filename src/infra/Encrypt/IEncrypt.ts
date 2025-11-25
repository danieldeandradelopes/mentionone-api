export default interface IEncrypt {
  encrypt(value: string): Promise<string>;
  compareValue(value: string, hash: string): Promise<boolean>;
}
