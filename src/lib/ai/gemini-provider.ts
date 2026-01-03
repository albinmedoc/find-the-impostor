import {
  BaseAIProvider,
  AIProviderConfig,
  GenerateWordsOptions,
} from "./base-provider";
import { WordWithHints } from "@/src/types/game";

export class GeminiProvider extends BaseAIProvider {
  constructor(config: AIProviderConfig) {
    super(config);
    if (!config.baseUrl) {
      config.baseUrl = "https://generativelanguage.googleapis.com/v1beta";
    }
  }

  getProviderName(): string {
    return "Google Gemini";
  }

  async generateWords(
    options: GenerateWordsOptions,
    retryCount = 0,
  ): Promise<{ wordsWithHints: WordWithHints[] }> {
    const maxRetries = this.config.fallbackModel ? 1 : 0;
    const currentModel =
      retryCount === 0 ? this.config.model : this.config.fallbackModel!;

    try {
      const response = await fetch(
        `${this.config.baseUrl}/models/${currentModel}:generateContent?key=${this.config.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${options.systemPrompt}\n\n${options.prompt}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: options.temperature || 0.7,
              maxOutputTokens: options.maxTokens || 1500,
              topP: 0.9,
              responseMimeType: "application/json",
            },
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `${this.getProviderName()} API error (${currentModel}): ${response.status} - ${
            errorData?.error?.message || response.statusText
          }`,
        );
      }

      const data = await response.json();

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error(
          `Invalid response structure from ${this.getProviderName()}`,
        );
      }

      try {
        const responseText = data.candidates[0].content.parts[0].text;
        return JSON.parse(responseText);
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
