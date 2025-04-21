import { atomWithStorage, createJSONStorage } from "jotai/utils";

type SwitchStore = {
  activeTab: "text-desc" | "image-desc";
  activeImageId: number | null;
};

export const switchStoreAtom = atomWithStorage<SwitchStore>(
  "switchStore",
  {
    activeTab: "text-desc",
    activeImageId: null,
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
