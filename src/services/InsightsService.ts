import IEnterpriseGateway from "../gateway/EnterpriseGateway/IEnterpriseGateway";
import { IFeedbackGateway } from "../gateway/FeedbackGateway/IFeedbackGateway";
import IAIAnalysisRunGateway from "../gateway/AIAnalysisRunGateway/IAIAnalysisRunGateway";
import IAIAdapter from "../infra/ai/IAIAdapter";

const INSIGHTS_TYPE = "insights";

export interface GenerateInsightsInput {
  enterpriseId: number;
  /** Máximo de tokens na resposta da IA. null = ilimitado. */
  maxTokens?: number | null;
}

/**
 * Monta o prompt para análise de insights a partir do contexto da empresa e feedbacks.
 */
function buildInsightsPrompt(
  enterpriseName: string,
  sector: string | null | undefined,
  companyDescription: string | null | undefined,
  feedbackLines: string[]
): string {
  const sectorLine = sector?.trim()
    ? `Setor: ${sector.trim()}`
    : "Setor: não informado.";
  const descLine = companyDescription?.trim()
    ? `Descrição da empresa (para contexto): ${companyDescription.trim()}`
    : "";

  const feedbackBlock =
    feedbackLines.length > 0
      ? `\n\nFeedbacks dos clientes (texto, categoria, nota quando houver, data):\n${feedbackLines.join("\n")}`
      : "\n\nNão há feedbacks registrados no período.";

  return `Você é um analista de experiência do cliente. Com base nos dados abaixo, elabore um relatório conciso de insights em português.

Empresa: ${enterpriseName}
${sectorLine}
${descLine}
${feedbackBlock}

Responda em markdown, com seções como: Resumo, Pontos positivos, Pontos de atenção, Sugestões de melhoria. Seja objetivo e use os feedbacks para embasar cada ponto.`;
}

/**
 * Serviço que agrega contexto (empresa + feedbacks), chama o adapter de IA e persiste o resultado.
 */
export default class InsightsService {
  constructor(
    private readonly enterpriseGateway: IEnterpriseGateway,
    private readonly feedbackGateway: IFeedbackGateway,
    private readonly analysisRunGateway: IAIAnalysisRunGateway,
    private readonly aiAdapter: IAIAdapter
  ) {}

  async generate(input: GenerateInsightsInput): Promise<{
    id: number;
    report: string;
    generatedAt: string;
  }> {
    const { enterpriseId, maxTokens } = input;

    const enterprise = await this.enterpriseGateway.getEnterprise(enterpriseId);
    const feedbacks = await this.feedbackGateway.findWithFilters({
      enterprise_id: enterpriseId,
    });

    const feedbackLines = feedbacks.map((f) => {
      const date = f.created_at
        ? new Date(f.created_at).toLocaleDateString("pt-BR")
        : "-";
      const rating = f.rating != null ? ` (nota: ${f.rating})` : "";
      return `- [${date}] [${f.category}]${rating} ${f.text}`;
    });

    const prompt = buildInsightsPrompt(
      enterprise.name,
      enterprise.sector,
      enterprise.company_description_for_ai,
      feedbackLines
    );

    const report = await this.aiAdapter.generate(prompt, { maxTokens });

    const payload = {
      report,
      generatedAt: new Date().toISOString(),
    };

    const run = await this.analysisRunGateway.create({
      enterprise_id: enterpriseId,
      type: INSIGHTS_TYPE,
      payload,
    });

    return {
      id: run.id,
      report: payload.report,
      generatedAt: payload.generatedAt,
    };
  }
}
