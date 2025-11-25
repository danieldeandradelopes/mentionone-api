import HttpClient from "../Http/HttpClient";
import ISubDomain from "./ISubdomain";
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_API_URL = process.env.CLOUDFLARE_API_URL;

export default class CloudFlareAdapter implements ISubDomain {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async createSubdomain(subdomain: string): Promise<boolean> {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🔧 [DEV] Simulando criação do subdomínio '${subdomain}.agende7.com'`
      );
      return true;
    }

    try {
      if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_TOKEN) {
        throw new Error(
          "CLOUDFLARE_ZONE_ID ou CLOUDFLARE_API_TOKEN não definidos nas variáveis de ambiente."
        );
      }

      const response = await this.httpClient.post(
        `${CLOUDFLARE_API_URL}${CLOUDFLARE_ZONE_ID}/dns_records`,
        {
          type: "CNAME",
          name: `${subdomain}`,
          content: "57cab917206c08a4.vercel-dns-017.com",
          ttl: 3600,
          proxied: false,
        },
        {
          headers: {
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.success) {
        console.log(
          `✅ Subdomínio '${subdomain}.agende7.com' criado com sucesso!`
        );
        return true;
      } else {
        console.error(`❌ Erro ao criar subdomínio:`, response.result.errors);
        return false;
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error);
        console.error("❌ Erro Cloudflare:", error.response.result);
      } else {
        console.log(error);
        console.error("❌ Erro inesperado:", error.message);
      }
      return false;
    }
  }
}
