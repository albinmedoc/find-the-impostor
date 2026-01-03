import {
  BaseAIProvider,
  AIProviderConfig,
  GenerateWordsOptions,
} from "./base-provider";
import { WordWithHints } from "@/src/types/game";

export class AnthropicProvider extends BaseAIProvider {
  constructor(config: AIProviderConfig) {
    super(config);
    if (!config.baseUrl) {
      config.baseUrl = "https://api.anthropic.com/v1";
    }
  }

  getProviderName(): string {
    return "Anthropic";
  }

  async generateWords(
    options: GenerateWordsOptions,
    retryCount = 0,
  ): Promise<{ wordsWithHints: WordWithHints[] }> {
    const maxRetries = this.config.fallbackModel ? 1 : 0;
    const currentModel =
      retryCount === 0 ? this.config.model : this.config.fallbackModel!;

    try {
      const response = await fetch(`${this.config.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "x-api-key": this.config.apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: currentModel,
          max_tokens: options.maxTokens || 1500,
          temperature: options.temperature || 0.7,
          system: options.systemPrompt,
          messages: [
            {
              role: "user",
              content: options.prompt,
            },
          ],
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

      if (!data.content?.[0]?.text) {
        throw new Error(
          `Invalid response structure from ${this.getProviderName()}`,
        );
      }

      try {
        // Extract JSON from the response text
        const responseText = data.content[0].text;
        // Try to parse the entire response as JSON first
        let jsonData;
        try {
          jsonData = JSON.parse(responseText);
        } catch {
          // If that fails, try to extract JSON from markdown code blocks
          const jsonMatch = responseText.match(
            /```(?:json)?\s*(\{[\s\S]*\})\s*```/,
          );
          if (jsonMatch) {
            jsonData = JSON.parse(jsonMatch[1]);
          } else {
            // Try to find any JSON object in the text
            const jsonObjectMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonObjectMatch) {
              jsonData = JSON.parse(jsonObjectMatch[0]);
            } else {
              throw new Error("No valid JSON found in response");
            }
          }
        }
        return jsonData;
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
