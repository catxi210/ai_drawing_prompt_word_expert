import { atomWithStorage, createJSONStorage } from "jotai/utils";

type ActionReferenceImagesStore = {
  actionImage: string;
  referenceImages: string;
};

export const actionReferenceImagesStoreAtom =
  atomWithStorage<ActionReferenceImagesStore>(
    "actionReferenceImagesStore",
    {
      actionImage: "",
      referenceImages: "",
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
