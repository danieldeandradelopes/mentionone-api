export default interface IJwtAssign {
  generate(data: any): string;
  generateRefreshToken(data: any): string;
  verify(token: string): boolean;
  verifyRefreshToken(token: string): boolean;
  decrypt(token: string): any;
  decryptRefreshToken(token: string): any;
}
