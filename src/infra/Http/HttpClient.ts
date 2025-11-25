export default interface HttpClient {
  get(url: string, headers?: any): Promise<any>;
  post(url: string, data: any, headers?: any): Promise<any>;
  delete(url: string): Promise<any>;
}
