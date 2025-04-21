import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import ChangeStyleModal from "./change-style-modal";
import { useAtom } from "jotai";
import { styleFormAtom } from "@/stores/slices/style_form_store";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";
import { styleOriginFormAtom } from "@/stores/slices/style_origin_form_store";
import { styleReferenceFormAtom } from "@/stores/slices/style_reference_form_store";
const ChangeStyleButton = () => {
  const [styleForm, setStyleForm] = useAtom(styleFormAtom);
  const [imageGenForm, setImageGenForm] = useAtom(imageGenFormAtom);
  const [styleOriginForm, setStyleOriginForm] = useAtom(styleOriginFormAtom);
  const [styleReferenceForm, setStyleReferenceForm] = useAtom(
    styleReferenceFormAtom
  );
  const t = useTranslations();
  const handleClose = () => {
    // setOpen(false);
    setStyleForm({
      ...styleForm,
      open: false,
      image: "",
      prompt: "",
    });
    setStyleOriginForm({
      ...styleOriginForm,
      image: "",
    });
    setStyleReferenceForm({
      ...styleReferenceForm,
      image: "",
    });
  };
  const handleOpen = () => {
    // setOpen(false);
    setStyleForm({
      ...styleForm,
      open: true,
      image: imageGenForm.image,
    });
  };
  return (
    <div>
      <Button variant={"outline"} onClick={handleOpen}>
        {t("actions.change_style")}
      </Button>
      <ChangeStyleModal open={styleForm.open} onOpenChange={handleClose} />
    </div>
  );
};

export default ChangeStyleButton;
