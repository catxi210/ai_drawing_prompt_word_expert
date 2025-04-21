import React from "react";
import ImageActions from "./image-actions";
import { styleReferenceFormAtom } from "@/stores/slices/style_reference_form_store";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";

const ImageReferenceRight = () => {
  const [styleReferenceForm, setStyleReferenceForm] = useAtom(
    styleReferenceFormAtom
  );
  const t = useTranslations();
  return (
    <div className="flex flex-1 flex-col">
      <span className="mb-1 text-sm">
        {t("image_desc_reference.reference_image")}
      </span>
      <ImageActions
        setStyleForm={setStyleReferenceForm}
        styleForm={styleReferenceForm}
      />
    </div>
  );
};

export default ImageReferenceRight;
