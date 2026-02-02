import HttpClient from "../Http/HttpClient";

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_FRONT_PROJECT_ID = process.env.VERCEL_FRONT_PROJECT_ID;
const VERCEL_API_URL = "https://api.vercel.com/v9";

export default class VercelAdapter {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async addSubdomain(subdomain: string): Promise<boolean> {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🔧 [DEV] Simulando adição do subdomínio '${subdomain}.app.mentionone.com'`
      );
      return true;
    }

    try {
      if (!VERCEL_API_TOKEN || !VERCEL_FRONT_PROJECT_ID) {
        throw new Error(
          "❌ VERCEL_API_TOKEN ou VERCEL_FRONT_PROJECT_ID não definidos nas variáveis de ambiente."
        );
      }

      const domain = `${subdomain}.app.mentionone.com`;
      const project = await this.httpClient.get(
        `${VERCEL_API_URL}/projects/${VERCEL_FRONT_PROJECT_ID}`,
        {
          Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        }
      );

      if (!project || project.error) {
        console.error(
          "❌ Projeto Vercel nao encontrado para o ID informado:",
          project?.error || project
        );
        return false;
      }

      console.log(`ℹ️ Vercel project alvo: ${project.name || project.id}`);

      const response = await this.httpClient.post(
        `${VERCEL_API_URL}/projects/${VERCEL_FRONT_PROJECT_ID}/domains`,
        { name: domain },
        {
          headers: {
            Authorization: `Bearer ${VERCEL_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response && !response.error) {
        console.log(
          `✅ Subdomínio '${domain}' adicionado ao projeto Vercel com sucesso!`
        );
        return true;
      } else {
        console.error(
          "❌ Erro ao adicionar subdomínio na Vercel:",
          response.error || response
        );
        return false;
      }
    } catch (error: any) {
      if (error.response) {
        console.error("❌ Erro Vercel:", error.response);
      } else {
        console.error("❌ Erro inesperado:", error.message);
      }
      return false;
    }
  }
}
