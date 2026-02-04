import type { Knex } from "knex";
import NPSResponse, { NPSResponseStoreData } from "../../entities/NPSResponse";
import NPSResponseAnswer, {
  NPSResponseAnswerStoreData,
} from "../../entities/NPSResponseAnswer";

export default interface INPSResponseGateway {
  createResponse(data: NPSResponseStoreData, trx?: Knex.Transaction): Promise<NPSResponse>;
  createResponseAnswers(
    answers: NPSResponseAnswerStoreData[],
    trx?: Knex.Transaction
  ): Promise<NPSResponseAnswer[]>;
}
