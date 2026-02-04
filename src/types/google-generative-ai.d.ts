/**
 * Declaração mínima para @google/generative-ai (dependência opcional).
 * Instale com: npm install @google/generative-ai
 */
declare module "@google/generative-ai" {
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(config: {
      model: string;
      generationConfig?: { maxOutputTokens?: number };
    }): {
      generateContent(prompt: string): Promise<{
        response: { text: () => string };
      }>;
    };
  }
}
