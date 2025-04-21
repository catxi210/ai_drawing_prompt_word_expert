import { Button } from "@/components/ui/button";
import React from "react";
import { useTranslations } from "next-intl";
import { genStateAtom } from "@/stores/slices/gen_store";
import { useAtom } from "jotai";
import { Loader2, Wand2 } from "lucide-react";
import { useGenerateStyleReferenceImage } from "../../hooks/use-generate-reference-style-image";
import { styleReferenceFormAtom } from "@/stores/slices/style_reference_form_store";
import { styleOriginFormAtom } from "@/stores/slices/style_origin_form_store";
const GenerateStyleReferenceImageButton = () => {
  const t = useTranslations();
  const { handleGenerateImage, isGenerating } =
    useGenerateStyleReferenceImage();
  const [styleReferenceForm] = useAtom(styleReferenceFormAtom);

  const [styleOriginForm] = useAtom(styleOriginFormAtom);
  // console.log({
  //   styleOriginForm,
  //   styleReferenceForm,
  // });

  return (
    <div className="flex flex-row-reverse">
      <Button
        onClick={handleGenerateImage}
        disabled={!styleOriginForm.image || !styleReferenceForm.image}
        size="sm"
      >
        <>
          {/* {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )} */}
          {t("actions.generate_image")}
        </>
      </Button>
    </div>
  );
};

export default GenerateStyleReferenceImageButton;
