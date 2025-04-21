import { atomWithStorage, createJSONStorage } from "jotai/utils";

type UiStore = {
  activeTab: "image-to-prompt" | "style-change";
};

export const uiStoreAtom = atomWithStorage<UiStore>(
  "uiStore",
  {
    activeTab: "image-to-prompt",
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
