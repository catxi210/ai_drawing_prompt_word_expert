import { atomWithStorage, createJSONStorage } from "jotai/utils";

type StyleReferenceForm = {
  image: string;
  prompt: string;
};

export const styleReferenceFormAtom = atomWithStorage<StyleReferenceForm>(
  "styleReferenceForm",
  {
    image: "",
    prompt: "",
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
