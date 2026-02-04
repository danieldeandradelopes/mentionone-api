export interface IAIAdapterOptions {
  /** Máximo de tokens na resposta. null = ilimitado (usa default do modelo). */
  maxTokens?: number | null;
}

export default interface IAIAdapter {
  /**
   * Gera texto a partir de um prompt usando o modelo de IA.
   * @param prompt Texto do prompt
   * @param options Opções como maxTokens
   * @returns Texto gerado pela IA
   */
  generate(
    prompt: string,
    options?: IAIAdapterOptions
  ): Promise<string>;
}
