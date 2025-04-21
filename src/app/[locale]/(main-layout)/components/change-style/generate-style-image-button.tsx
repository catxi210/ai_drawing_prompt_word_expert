import { Button } from "@/components/ui/button";
import React from "react";
import { useTranslations } from "next-intl";
import { genStateAtom } from "@/stores/slices/gen_store";
import { useAtom } from "jotai";
import { Loader2, Wand2 } from "lucide-react";
import { useGenerateStyleImage } from "../../hooks/use-generate-style-image";
import { styleFormAtom } from "@/stores/slices/style_form_store";
import { styleOriginFormAtom } from "@/stores/slices/style_origin_form_store";

interface GenerateStyleImageButtonProps {
  isReference?: boolean;
}

const GenerateStyleImageButton = ({
  isReference = false,
}: GenerateStyleImageButtonProps) => {
  const t = useTranslations();
  const { handleGenerateImage, isGenerating } = useGenerateStyleImage();
  const [styleImageForm] = useAtom(styleFormAtom);
  const [originImage, setOriginImage] = useAtom(styleOriginFormAtom);

  return (
    <div className="flex flex-row-reverse">
      <Button
        onClick={handleGenerateImage}
        disabled={
          isGenerating || !originImage.image || !styleImageForm.prompt.trim()
        }
        size="sm"
      >
        <>
          {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("actions.generate_image")}
        </>
      </Button>
    </div>
  );
};

export default GenerateStyleImageButton;
