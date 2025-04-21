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
import image from "next/image";
import { useStyleHistory } from "@/hooks/db/use-gen-style-history";
import { generateStyleImage } from "@/services/gen-style-image";
import { styleOriginFormAtom } from "@/stores/slices/style_origin_form_store";
const logger = createScopedLogger("gen-style-image");

export const useGenerateStyleImage = () => {
  const t = useTranslations();
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageStyle, setImageStyle] = useAtom(styleFormAtom);
  const [originImage, setOriginImage] = useAtom(styleOriginFormAtom);
  const [genState, setGenState] = useAtom(genStateAtom);
  const { addHistory, updateHistoryImage } = useStyleHistory();
  const [naturalLanguage, setNaturalLanguage] = useAtom(naturalLanguageAtom);
  const [keywords, setKeywords] = useAtom(keywordsAtom);
  const { apiKey } = store.get(appConfigAtom);

  const handleGenerateImage = async () => {
    const historyId = await addHistory({
      rawPrompt: imageStyle.prompt,
      image: {
        base64: "", // Empty base64 for now
        // prompt: imageStyle.prompt,
        status: "pending",
      } as any,
      shouldOptimize: false,
      aspectRatio: "",
    });
    try {
      setIsGenerating(true);

      const { url } = await generateStyleImage({
        apiKey: apiKey || "",
        prompt: imageStyle.prompt,
        image: originImage.image,
      });

      // Update the history record with the actual image

      await updateHistoryImage(
        historyId,
        0, // index
        {
          base64: url,
          status: "success",
          prompt: imageStyle.prompt,
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
          prompt: imageStyle.prompt,
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
