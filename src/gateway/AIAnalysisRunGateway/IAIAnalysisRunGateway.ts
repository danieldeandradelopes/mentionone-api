import AIAnalysisRun, { AIAnalysisRunStoreData } from "../../entities/AIAnalysisRun";

export default interface IAIAnalysisRunGateway {
  create(data: AIAnalysisRunStoreData): Promise<AIAnalysisRun>;
  findLatestByEnterpriseAndType(
    enterpriseId: number,
    type: string
  ): Promise<AIAnalysisRun | null>;
  findById(id: number): Promise<AIAnalysisRun | null>;
  listByEnterpriseAndType(
    enterpriseId: number,
    type: string,
    limit?: number
  ): Promise<AIAnalysisRun[]>;
}
