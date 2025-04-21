import React from "react";
import ImageActions from "./image-actions";
import { useAtom } from "jotai";
import { styleOriginFormAtom } from "@/stores/slices/style_origin_form_store";
import { useTranslations } from "next-intl";

const ImageReferenceLeft = () => {
  const [styleOriginForm, setStyleOriginForm] = useAtom(styleOriginFormAtom);
  const t = useTranslations();
  return (
    <div className="flex flex-1 flex-col">
      <span className="mb-1 text-sm">
        {t("image_desc_reference.origin_image")}
      </span>
      <ImageActions
        setStyleForm={setStyleOriginForm}
        styleForm={styleOriginForm}
      />
    </div>
  );
};

export default ImageReferenceLeft;
