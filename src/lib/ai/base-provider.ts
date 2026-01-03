import { WordWithHints } from "@/src/types/game";

export interface AIProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model: string;
  fallbackModel?: string;
}

export interface GenerateWordsOptions {
  prompt: string;
  systemPrompt: string;
  maxTokens?: number;
  temperature?: number;
}

export abstract class BaseAIProvider {
  protected config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  /**
   * Generate words with hints using the AI provider
   */
  abstract generateWords(
    options: GenerateWordsOptions,
    retryCount?: number,
  ): Promise<{ wordsWithHints: WordWithHints[] }>;

  /**
   * Get the provider name for logging and debugging
   */
  abstract getProviderName(): string;
}
