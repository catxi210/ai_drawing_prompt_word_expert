import { atomWithStorage, createJSONStorage } from "jotai/utils";

type StyleOriginForm = {
  image: string;
};

export const styleOriginFormAtom = atomWithStorage<StyleOriginForm>(
  "styleOriginForm",
  {
    image: "",
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
