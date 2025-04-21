import { atomWithStorage, createJSONStorage } from "jotai/utils";

type GenResult = {
  originalNaturalLanguage?: string;
  naturalLanguage?: string;
  originalKeywords?: string;
  keywords?: string;
};

export const genResultAtom = atomWithStorage<GenResult>(
  "genResult",
  {
    originalNaturalLanguage: "",
    naturalLanguage: "",
    originalKeywords: "",
    keywords: "",
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
