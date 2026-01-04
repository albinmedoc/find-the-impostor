/* eslint-disable @typescript-eslint/no-explicit-any */
import { Locale, getLanguageLabel } from "../config/language";

export interface PromptConfig {
  category: string;
  language: Locale;
  count: number;
  difficulty?: "easy" | "medium" | "hard";
}

export class PromptEngine {
  private static readonly DIFFICULTY_MODIFIERS = {
    easy: "Choose very common, everyday words that most people would recognize immediately.",
    medium:
      "Choose moderately common words that require some thinking but are still well-known.",
    hard: "Choose less common but still recognizable words that provide a good challenge.",
  };

  private static readonly CATEGORY_CONTEXTS = {
    animals:
      "Include domestic, wild, and exotic animals. Mix common pets with wildlife.",
    food: "Include dishes, ingredients, cooking methods, and food items from various cuisines.",
    objects:
      "Include household items, tools, furniture, technology, and everyday objects.",
    places:
      "Include buildings, locations, geographical features, and establishments.",
    professions:
      "Include traditional and modern jobs, skilled trades, and professional roles.",
    movies: "Include popular films, classic movies, and well-known franchises.",
    sports:
      "Include popular sports, equipment, positions, and game terminology.",
    music:
      "Include instruments, genres, musical terms, and performance concepts.",
    nature:
      "Include natural phenomena, landscapes, weather, and environmental features.",
    technology:
      "Include devices, software, digital concepts, and modern innovations.",
  };

  static createPrompt(config: PromptConfig): string {
    const difficultyMod =
      PromptEngine.DIFFICULTY_MODIFIERS[config.difficulty || "medium"];
    const categoryContext =
      PromptEngine.CATEGORY_CONTEXTS[
        config.category.toLowerCase() as keyof typeof PromptEngine.CATEGORY_CONTEXTS
      ] || "Generate appropriate words for this category.";

    return `Generate ${config.count} words for the category "${config.category}" in ${getLanguageLabel(config.language)}.

CATEGORY: ${categoryContext}

DIFFICULTY: ${difficultyMod}

CULTURAL FOCUS: Generate words commonly known in countries where language "${getLanguageLabel(config.language)}" is spoken.`;
  }

  static validateResponse(response: any, expectedCount: number): boolean {
    if (!response?.wordsWithHints || !Array.isArray(response.wordsWithHints)) {
      return false;
    }

    if (response.wordsWithHints.length !== expectedCount) {
      return false;
    }

    return response.wordsWithHints.every(
      (item: any) =>
        typeof item.word === "string" &&
        item.word.trim().length > 0 &&
        Array.isArray(item.hints) &&
        item.hints.length === 3 &&
        item.hints.every(
          (hint: any) => typeof hint === "string" && hint.trim().length > 0,
        ),
    );
  }
}
