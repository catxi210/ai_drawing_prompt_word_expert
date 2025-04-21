import { atom } from "jotai";

export const MAX_PARALLEL_GENERATIONS = 4;

type GenState = {
  isGeneratingPrompt: boolean;
  elapsedTime: number;
  isGeneratingImage: boolean;
  activeGenerations: number; // Count of currently ongoing image generations
  textType: "naturalLanguage" | "keywords";
  isTranslating: boolean;
};

export const genStateAtom = atom<GenState>({
  isGeneratingPrompt: false,
  isGeneratingImage: false,
  elapsedTime: 0,
  activeGenerations: 0,
  textType: "naturalLanguage",
  isTranslating: false,
});
