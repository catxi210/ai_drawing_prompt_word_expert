import { atomWithStorage, createJSONStorage } from "jotai/utils";

type OriginalText = {
  naturalLanguage: string;
  keywords: string;
};

export const originalTextAtom = atomWithStorage<OriginalText>(
  "originalText",
  {
    naturalLanguage: "",
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
