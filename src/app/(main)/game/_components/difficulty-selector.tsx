import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useGameStore } from "@/src/stores/game-store";
import type { Difficulty } from "@/src/types/game";
import { useTranslations } from "next-intl";

export default function DifficultySelector() {
  const { gameState, setDifficulty } = useGameStore();
  const t = useTranslations("SetupPhase");

  const difficulties = [
    { value: "easy", label: t("easy") },
    { value: "medium", label: t("medium") },
    { value: "hard", label: t("hard") },
  ];

  return (
    <Select
      value={gameState.difficulty}
      onValueChange={value => setDifficulty(value as Difficulty)}
    >
      <SelectTrigger className="h-14 w-full rounded-2xl border-gray-700 bg-gray-800/50 px-3 py-2 text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-2xl">
        {difficulties.map(difficulty => (
          <SelectItem
            key={difficulty.value}
            value={difficulty.value}
            className="rounded-xl py-3 text-white"
          >
            {difficulty.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
