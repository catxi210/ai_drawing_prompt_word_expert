import { atomWithStorage, createJSONStorage } from "jotai/utils";

type ImageGenForm = {
  prompt: string;
  image: string;
  width: number | undefined;
  height: number | undefined;
  isOptimized: boolean;
  model: string | undefined;
};

export const imageGenFormAtom = atomWithStorage<ImageGenForm>(
  "imageGenForm",
  {
    prompt: "",
    image: "",
    width: 1,
    height: 1,
    isOptimized: false,
    model: "flux-pro-v1.1",
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
