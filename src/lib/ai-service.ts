import { BaseAIProvider } from "./ai/base-provider";
import { AIProviderFactory } from "./ai/provider-factory";
import { WordWithHints } from "@/src/types/game";

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
    return `You are an expert game designer creating words and hints for a party guessing game similar to "One Word" or "Codenames".

CRITICAL REQUIREMENTS:
1. Generate EXACTLY the requested number of words
2. Each word must have EXACTLY 3 hints
3. Hints must be useful but not too obvious
4. Response must be valid JSON with the exact structure specified
5. Words should be common enough that most people know them
6. Avoid proper nouns unless universally known

HINT QUALITY GUIDELINES:
- Hint 1: Broad category or general association
- Hint 2: More specific characteristic or use
- Hint 3: Distinctive feature or context
- Never use the target word or its derivatives in hints
- Keep hints concise (2-4 words each)
- Make hints progressively more specific

EXAMPLE:
For "elephant" in English:
- Hint 1: "large"
- Hint 2: "peanut"  
- Hint 3: "ears"

Always respond with valid JSON matching the requested schema. No additional text or explanations.`;
  }
}

// Create and export the AI service instance with lazy initialization
// This ensures environment variables are read at runtime, not build time
export const AIService = new GenericAIService();
