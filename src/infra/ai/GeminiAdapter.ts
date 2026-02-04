import IAIAdapter, { IAIAdapterOptions } from "./IAIAdapter";

/**
 * Adapter para Google Generative AI (Gemini).
 * Dependência opcional: npm install @google/generative-ai
 * Se não estiver instalada, generate() rejeita com erro explicativo.
 */
export class GeminiAdapter implements IAIAdapter {
  private readonly apiKey: string;
  private readonly model: string;

  constructor(options?: { apiKey?: string; model?: string }) {
    this.apiKey = options?.apiKey ?? process.env.GOOGLE_AI_API_KEY ?? "";
    // Default: stable model supported by generateContent. Override with GOOGLE_AI_MODEL (e.g. gemini-2.0-flash, gemini-3-flash-preview).
    this.model =
      options?.model ?? process.env.GOOGLE_AI_MODEL ?? "gemini-2.5-flash";
  }

  async generate(prompt: string, options?: IAIAdapterOptions): Promise<string> {
    let GenerativeAI: typeof import("@google/generative-ai").GoogleGenerativeAI;
    try {
      GenerativeAI = require("@google/generative-ai").GoogleGenerativeAI;
    } catch {
      throw new Error(
        "Package @google/generative-ai is not installed. Run: npm install @google/generative-ai",
      );
    }

    if (!this.apiKey?.trim()) {
      throw new Error("GOOGLE_AI_API_KEY environment variable is not set.");
    }

    const genAI = new GenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({
      model: this.model,
      generationConfig: {
        maxOutputTokens:
          options?.maxTokens != null ? options.maxTokens : undefined,
      },
    });

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      return text ?? "";
    } catch (err: unknown) {
      const ex = err as Error & { status?: number };
      const is429 =
        ex?.status === 429 ||
        ex?.message?.includes("429") ||
        ex?.message?.toLowerCase().includes("quota") ||
        ex?.message?.toLowerCase().includes("too many requests");
      if (is429) {
        const e = new Error(
          "Limite de uso da IA atingido. Tente novamente mais tarde ou verifique seu plano em Google AI Studio.",
        ) as Error & { status: number };
        e.status = 429;
        throw e;
      }
      throw err;
    }
  }
}

export default GeminiAdapter;
