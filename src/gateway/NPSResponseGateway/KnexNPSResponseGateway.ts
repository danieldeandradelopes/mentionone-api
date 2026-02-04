import { Knex } from "knex";
import NPSResponse, {
  NPSResponseProps,
  NPSResponseStoreData,
} from "../../entities/NPSResponse";
import NPSResponseAnswer, {
  NPSResponseAnswerProps,
  NPSResponseAnswerStoreData,
} from "../../entities/NPSResponseAnswer";
import INPSResponseGateway from "./INPSResponseGateway";

export class KnexNPSResponseGateway implements INPSResponseGateway {
  constructor(private readonly knex: Knex) {}

  private db(trx?: Knex.Transaction): Knex {
    return trx ?? this.knex;
  }

  async createResponse(
    data: NPSResponseStoreData,
    trx?: Knex.Transaction
  ): Promise<NPSResponse> {
    const db = this.db(trx);
    const [id] = await db<NPSResponseProps>("nps_responses")
      .insert(data)
      .returning("id");
    const rid = typeof id === "object" ? (id as { id: number }).id : id;
    const row = await db<NPSResponseProps>("nps_responses")
      .where({ id: rid })
      .first();
    return new NPSResponse(row!);
  }

  async createResponseAnswers(
    answers: NPSResponseAnswerStoreData[],
    trx?: Knex.Transaction
  ): Promise<NPSResponseAnswer[]> {
    if (answers.length === 0) return [];
    const db = this.db(trx);
    const rows = await db<NPSResponseAnswerProps>("nps_response_answers")
      .insert(answers)
      .returning("*");
    return rows.map((row) => new NPSResponseAnswer(row));
  }
}
