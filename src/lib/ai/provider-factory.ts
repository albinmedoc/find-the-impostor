import { AnthropicProvider } from "./anthropic-provider";
import { BaseAIProvider } from "./base-provider";
import { GeminiProvider } from "./gemini-provider";
import { OpenAIProvider } from "./openai-provider";
import { OpenRouterProvider } from "./openrouter-provider";

export type AIProviderType = "openrouter" | "openai" | "anthropic" | "gemini";

export interface AIServiceConfig {
  provider: AIProviderType;
  apiKey: string;
  baseUrl?: string;
  model: string;
}

export class AIProviderFactory {
  static createProvider(config: AIServiceConfig): BaseAIProvider {
    const providerConfig = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      model: config.model,
    };

    switch (config.provider.toLowerCase()) {
      case "openrouter":
        return new OpenRouterProvider(providerConfig);

      case "openai":
        return new OpenAIProvider(providerConfig);

      case "anthropic":
        return new AnthropicProvider(providerConfig);

      case "gemini":
        return new GeminiProvider(providerConfig);

      default:
        throw new Error(
          `Unsupported AI provider: ${config.provider}. Supported providers: openrouter, openai, anthropic, gemini`,
        );
    }
  }

  /**
   * Create provider from environment variables
   */
  static createFromEnv(): BaseAIProvider {
    const provider = (process.env.AI_PROVIDER ||
      "openrouter") as AIProviderType;
    const apiKey = process.env.AI_API_KEY;
    const baseUrl = process.env.AI_BASE_URL;
    const model = process.env.AI_MODEL;

    if (!apiKey) {
      throw new Error("Missing AI_API_KEY environment variable");
    }

    if (!model) {
      throw new Error("Missing AI_MODEL environment variable");
    }

    return AIProviderFactory.createProvider({
      provider,
      apiKey,
      baseUrl,
      model,
    });
  }
}
