import { BaseAIProvider } from "./ai/base-provider";
import { AIProviderFactory } from "./ai/provider-factory";
import { WordWithHints } from "@/src/types/game";
import * as fs from "fs";
import * as path from "path";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OpenRouterConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  fallbackModel?: string;
}

export class GenericAIService {
  private provider: BaseAIProvider | null = null;

  private getProvider(): BaseAIProvider {
    if (!this.provider) {
      this.provider = AIProviderFactory.createFromEnv();
    }
    return this.provider;
  }

  async generateWords(
    prompt: string,
    schema: any,
    retryCount = 0,
  ): Promise<{ wordsWithHints: WordWithHints[] }> {
    return this.getProvider().generateWords(
      {
        prompt,
        systemPrompt: this.getSystemPrompt(),
        maxTokens: 1500,
        temperature: 0.7,
      },
      retryCount,
    );
  }

  private getSystemPrompt(): string {
    const promptPath = path.join(process.cwd(), "prompts", "system-prompt.txt");
    return fs.readFileSync(promptPath, "utf-8");
  }
}

// Create and export the AI service instance with lazy initialization
// This ensures environment variables are read at runtime, not build time
export const AIService = new GenericAIService();
