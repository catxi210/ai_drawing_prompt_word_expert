import { atomWithStorage, createJSONStorage } from "jotai/utils";

type Keywords = {
  text: string;
  language: "JA" | "ZH" | "EN";
  originalText: string;
  translatedText: string;
};

export const keywordsAtom = atomWithStorage<Keywords>(
  "keywords",
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
