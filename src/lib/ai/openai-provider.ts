import {
  BaseAIProvider,
  AIProviderConfig,
  GenerateWordsOptions,
} from "./base-provider";
import { WordWithHints } from "@/src/types/game";

export class OpenAIProvider extends BaseAIProvider {
  constructor(config: AIProviderConfig) {
    super(config);
    if (!config.baseUrl) {
      config.baseUrl = "https://api.openai.com/v1";
    }
  }

  getProviderName(): string {
    return "OpenAI";
  }

  async generateWords(
    options: GenerateWordsOptions,
    retryCount = 0,
  ): Promise<{ wordsWithHints: WordWithHints[] }> {
    const maxRetries = this.config.fallbackModel ? 1 : 0;
    const currentModel =
      retryCount === 0 ? this.config.model : this.config.fallbackModel!;

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: currentModel,
          messages: [
            {
              role: "system",
              content: options.systemPrompt,
            },
            {
              role: "user",
              content: options.prompt,
            },
          ],
          response_format: {
            type: "json_object",
          },
          max_tokens: options.maxTokens || 1500,
          temperature: options.temperature || 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `${this.getProviderName()} API error (${currentModel}): ${response.status} - ${
            errorData?.error?.message || response.statusText
          }`,
        );
      }

      const data = await response.json();

      if (!data.choices?.[0]?.message?.content) {
        throw new Error(
          `Invalid response structure from ${this.getProviderName()}`,
        );
      }

      try {
        return JSON.parse(data.choices[0].message.content);
      } catch (parseError) {
        throw new Error(`Failed to parse JSON response: ${parseError}`);
      }
    } catch (error) {
      console.error(
        `${this.getProviderName()} error with ${currentModel}:`,
        error,
      );

      // Retry with fallback model if available
      if (retryCount < maxRetries && this.config.fallbackModel) {
        console.log(
          `Retrying with fallback model: ${this.config.fallbackModel}`,
        );
        return this.generateWords(options, retryCount + 1);
      }

      throw error;
    }
  }
}
