import AIAnalysisRun from "../entities/AIAnalysisRun";
import IAIAnalysisRunGateway from "../gateway/AIAnalysisRunGateway/IAIAnalysisRunGateway";
import InsightsService from "../services/InsightsService";

const INSIGHTS_TYPE = "insights";

export default class InsightsController {
  constructor(
    private readonly insightsService: InsightsService,
    private readonly analysisRunGateway: IAIAnalysisRunGateway
  ) {}

  async getLatest(enterpriseId: number): Promise<AIAnalysisRun | null> {
    return this.analysisRunGateway.findLatestByEnterpriseAndType(
      enterpriseId,
      INSIGHTS_TYPE
    );
  }

  async getHistory(
    enterpriseId: number,
    limit?: number
  ): Promise<AIAnalysisRun[]> {
    return this.analysisRunGateway.listByEnterpriseAndType(
      enterpriseId,
      INSIGHTS_TYPE,
      limit ?? 50
    );
  }

  async getById(id: number, enterpriseId: number): Promise<AIAnalysisRun | null> {
    const run = await this.analysisRunGateway.findById(id);
    if (!run || run.enterprise_id !== enterpriseId) return null;
    return run;
  }

  async generate(enterpriseId: number, maxTokens?: number | null) {
    return this.insightsService.generate({
      enterpriseId,
      maxTokens,
    });
  }
}
