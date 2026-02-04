import { Knex } from "knex";
import AIAnalysisRun, {
  AIAnalysisRunProps,
  AIAnalysisRunStoreData,
} from "../../entities/AIAnalysisRun";
import IAIAnalysisRunGateway from "./IAIAnalysisRunGateway";

export class KnexAIAnalysisRunGateway implements IAIAnalysisRunGateway {
  constructor(private readonly knex: Knex) {}

  async create(data: AIAnalysisRunStoreData): Promise<AIAnalysisRun> {
    const [id] = await this.knex("ai_analysis_runs")
      .insert(data)
      .returning("id");
    const row = await this.knex<AIAnalysisRunProps>("ai_analysis_runs")
      .where({ id: typeof id === "object" ? (id as { id: number }).id : id })
      .first();
    const parsed = row
      ? {
          ...row,
          payload:
            typeof row.payload === "string"
              ? (JSON.parse(row.payload) as Record<string, unknown>)
              : (row.payload as Record<string, unknown>),
        }
      : null;
    return new AIAnalysisRun(parsed!);
  }

  async findLatestByEnterpriseAndType(
    enterpriseId: number,
    type: string
  ): Promise<AIAnalysisRun | null> {
    const row = await this.knex<AIAnalysisRunProps>("ai_analysis_runs")
      .where({ enterprise_id: enterpriseId, type })
      .orderBy("created_at", "desc")
      .first();
    if (!row) return null;
    const payload =
      typeof row.payload === "string"
        ? (JSON.parse(row.payload) as Record<string, unknown>)
        : (row.payload as Record<string, unknown>);
    return new AIAnalysisRun({ ...row, payload });
  }

  async findById(id: number): Promise<AIAnalysisRun | null> {
    const row = await this.knex<AIAnalysisRunProps>("ai_analysis_runs")
      .where({ id })
      .first();
    if (!row) return null;
    const payload =
      typeof row.payload === "string"
        ? (JSON.parse(row.payload) as Record<string, unknown>)
        : (row.payload as Record<string, unknown>);
    return new AIAnalysisRun({ ...row, payload });
  }

  async listByEnterpriseAndType(
    enterpriseId: number,
    type: string,
    limit = 50
  ): Promise<AIAnalysisRun[]> {
    const rows = await this.knex<AIAnalysisRunProps>("ai_analysis_runs")
      .where({ enterprise_id: enterpriseId, type })
      .orderBy("created_at", "desc")
      .limit(limit);
    return rows.map((row) => {
      const payload =
        typeof row.payload === "string"
          ? (JSON.parse(row.payload) as Record<string, unknown>)
          : (row.payload as Record<string, unknown>);
      return new AIAnalysisRun({ ...row, payload });
    });
  }
}
