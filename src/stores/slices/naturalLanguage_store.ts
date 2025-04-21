import { atomWithStorage, createJSONStorage } from "jotai/utils";

type NaturalLanguage = {
  text: string;
  language: "JA" | "ZH" | "EN";
  originalText: string;
  translatedText: string;
};

export const naturalLanguageAtom = atomWithStorage<NaturalLanguage>(
  "naturalLanguage",
  {
    text: "",
    language: "EN",
    originalText: "",
    translatedText: "",
  },
  createJSONStorage(() =>
    typeof window !== "undefined"
      ? sessionStorage
      : {
          getItem: () => null,
          setItem: () => null,
          removeItem: () => null,
        }
  ),
  {
    getOnInit: true,
  }
);
