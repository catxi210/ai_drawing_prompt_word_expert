import { useHistory } from "@/hooks/db/use-gen-history";
import { generateImage } from "@/services/gen-image";
import { appConfigAtom, store } from "@/stores";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";
import {
  MAX_PARALLEL_GENERATIONS,
  genStateAtom,
} from "@/stores/slices/gen_store";
import { createScopedLogger } from "@/utils";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "sonner";
import { naturalLanguageAtom } from "@/stores/slices/naturalLanguage_store";
import { keywordsAtom } from "@/stores/slices/keywords_store";
import { styleFormAtom } from "@/stores/slices/style_form_store";
import { generateStyleImage } from "@/services/gen-style";
import image from "next/image";
import { styleReferenceFormAtom } from "@/stores/slices/style_reference_form_store";
import { styleOriginFormAtom } from "@/stores/slices/style_origin_form_store";
import { useStyleHistory } from "@/hooks/db/use-gen-style-history";
const logger = createScopedLogger("gen-style-image");

export const useGenerateStyleReferenceImage = () => {
  const t = useTranslations();
  const [isGenerating, setIsGenerating] = useState(false);
  const [genState, setGenState] = useAtom(genStateAtom);
  const { addHistory, updateHistoryImage } = useStyleHistory();
  const [naturalLanguage, setNaturalLanguage] = useAtom(naturalLanguageAtom);
  const [keywords, setKeywords] = useAtom(keywordsAtom);
  const { apiKey } = store.get(appConfigAtom);
  const [styleReferenceForm, setStyleReferenceForm] = useAtom(
    styleReferenceFormAtom
  );
  const [styleOriginForm, setStyleOriginForm] = useAtom(styleOriginFormAtom);

  const handleGenerateImage = async () => {
    const historyId = await addHistory({
      rawPrompt: "",
      image: {
        base64: "", // Empty base64 for now

        // prompt: imageStyle.prompt,
        status: "pending",
      } as any,
      referenceImage: {
        // prompt: imageStyle.prompt,
        base64: styleReferenceForm.image,
        status: "success",
      } as any,
      originImage: {
        // prompt: imageStyle.prompt,
        base64: styleOriginForm.image,
        status: "success",
      } as any,
      shouldOptimize: false,
      aspectRatio: "",
    });
    try {
      setIsGenerating(true);
      const { url } = await generateStyleImage({
        apiKey: apiKey || "",
        originImage: styleOriginForm.image,
        referenceImage: styleReferenceForm.image,
        // prompt: styleReferenceForm.prompt,
      });

      // Update the history record with the actual image

      await updateHistoryImage(
        historyId,
        0, // index
        {
          base64: url,
          status: "success",
          prompt: "",
        }
      );
    } catch (error) {
      logger.error(`generateImage error: `, error);
      toast.error(t("error.generate_failed"));

      await updateHistoryImage(
        historyId,
        0, // index
        {
          base64: "", // Keep empty base64 for failed generations
          status: "failed",
          prompt: "",
        }
      );
    } finally {
      setIsGenerating(false);
      // Decrement the active generations counter
      setGenState((prev) => ({
        ...prev,
        activeGenerations: Math.max(0, prev.activeGenerations - 1),
      }));
    }
  };

  return {
    handleGenerateImage,
    isGenerating,
    canGenerate: genState.activeGenerations < MAX_PARALLEL_GENERATIONS,
  };
};
