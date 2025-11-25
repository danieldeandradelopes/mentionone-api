import axios from "axios";
import HttpClient from "./HttpClient";

export default class AxiosAdapter implements HttpClient {
  async delete(url: string): Promise<any> {
    const response = await axios.delete(url);
    return response.data;
  }
  async get(url: string, headers?: any): Promise<any> {
    const response = await axios.get(url, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  }

  async post(url: string, data: any, headers?: any): Promise<any> {
    const response = await axios.post(url, data, { ...headers });
    return response.data;
  }
}
