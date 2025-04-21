import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useGenerateImage } from "../hooks/use-generate-image";
import { genStateAtom } from "@/stores/slices/gen_store";
import { useAtom } from "jotai";
import { Loader2, Wand2 } from "lucide-react";
import { naturalLanguageAtom } from "@/stores/slices/naturalLanguage_store";
import { keywordsAtom } from "@/stores/slices/keywords_store";
const GenerateImageButton = () => {
  const t = useTranslations();
  const { handleGenerateImage, isGenerating, canGenerate } = useGenerateImage();
  const [genState] = useAtom(genStateAtom);
  const [naturalLanguage] = useAtom(naturalLanguageAtom);
  const [keywords] = useAtom(keywordsAtom);

  const isEmpty =
    genState.textType === "naturalLanguage"
      ? naturalLanguage.text.trim() === ""
      : keywords.text.trim() === "";

  return (
    <div className="">
      <Button
        onClick={handleGenerateImage}
        disabled={genState.isGeneratingPrompt || !canGenerate || isEmpty}
        size="sm"
      >
        <>
          {/* <Wand2 className="h-4 w-4" /> */}
          {t("actions.generate_image")}
        </>
      </Button>
    </div>
  );
};

export default GenerateImageButton;
