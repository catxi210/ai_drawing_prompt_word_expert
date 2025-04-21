import { naturalLanguageAtom } from "./../../../../stores/slices/naturalLanguage_store";
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
import { keywordsAtom } from "@/stores/slices/keywords_store";
import { originalTextAtom } from "@/stores/slices/original_text_store";
const logger = createScopedLogger("gen-image");

export const useGenerateImage = () => {
  const t = useTranslations();
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageGenForm, setImageGenForm] = useAtom(imageGenFormAtom);
  const [genState, setGenState] = useAtom(genStateAtom);
  const { addHistory, updateHistoryImage } = useHistory();
  const [naturalLanguage, setNaturalLanguage] = useAtom(naturalLanguageAtom);
  const [keywords, setKeywords] = useAtom(keywordsAtom);
  const [originText, setOriginText] = useAtom(originalTextAtom);
  const { apiKey } = store.get(appConfigAtom);

  const handleGenerateImage = async () => {
    let prompt = "";
    let showText = "";
    if (naturalLanguage.language === "EN") {
      prompt = naturalLanguage.text;
      showText = naturalLanguage.text;
    } else {
      prompt = originText.naturalLanguage;
      showText = naturalLanguage.text;
    }

    // if (genState.textType === "naturalLanguage") {
    //   prompt = naturalLanguage.text;
    // } else {
    //   prompt = keywords.text;
    // }
    if (!imageGenForm.model) {
      toast.error(t("error.missing_required_fields_model"));
      return;
    }
    if (!imageGenForm.width || !imageGenForm.height) {
      toast.error(t("error.missing_required_fields_resolution"));
      return;
    }
    // Check if we've reached the parallel generation limit
    if (genState.activeGenerations >= MAX_PARALLEL_GENERATIONS) {
      toast.error(
        t("error.max_parallel_generations", { count: MAX_PARALLEL_GENERATIONS })
      );
      return;
    }

    setIsGenerating(true);
    // Increment the active generations counter
    setGenState((prev) => ({
      ...prev,
      activeGenerations: prev.activeGenerations + 1,
    }));

    // Create a history record with pending status first
    const historyId = await addHistory({
      rawPrompt: showText,
      shouldOptimize: imageGenForm.isOptimized,
      aspectRatio: `${imageGenForm.width}:${imageGenForm.height}`,
      image: {
        base64: "", // Empty base64 for now
        prompt: prompt,
        model: imageGenForm.model,
        status: "pending",
      },
    });

    try {
      const { image } = await generateImage({
        ...imageGenForm,
        apiKey: apiKey || "",
        modelId: imageGenForm.model,
        aspectRatio: `${imageGenForm.width}:${imageGenForm.height}`,
        prompt,
      });

      // Update the history record with the actual image
      await updateHistoryImage(
        historyId,
        0, // index
        {
          base64: image.image,
          prompt: image.prompt,
          model: image.model,
          status: "success",
        }
      );
    } catch (error) {
      logger.error(`generateImage error: `, error);
      toast.error(t("error.generate_failed"));

      // Update history with failed status
      await updateHistoryImage(
        historyId,
        0, // index
        {
          base64: "", // Keep empty base64 for failed generations
          prompt,
          model: imageGenForm.model,
          status: "failed",
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
