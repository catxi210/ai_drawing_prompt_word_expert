import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { generatePrompt } from "@/services/gen-prompt";
import { useAtom } from "jotai";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";
import { appConfigAtom, store } from "@/stores";
import { genResultAtom } from "@/stores/slices/gen-result-store";
import { genStateAtom } from "@/stores/slices/gen_store";
import { createScopedLogger } from "@/utils";
import { toast } from "sonner";
import { Wand2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useHistory } from "@/hooks/db/use-gen-history";
import { keywordsAtom } from "@/stores/slices/keywords_store";
import { naturalLanguageAtom } from "@/stores/slices/naturalLanguage_store";
const logger = createScopedLogger("generate-prompt-button");

const GeneratePromptButton = () => {
  const t = useTranslations();
  const [imageGenForm] = useAtom(imageGenFormAtom);
  const [genState, setGenState] = useAtom(genStateAtom);
  const [genResult, setGenResult] = useAtom(genResultAtom);
  const { apiKey } = store.get(appConfigAtom);
  const [keywords, setKeywords] = useAtom(keywordsAtom);
  const [naturalLanguage, setNaturalLanguage] = useAtom(naturalLanguageAtom);
  const [loading, setLoading] = useState(false);
  const handleGenPrompt = async () => {
    if (imageGenForm.image === "") {
      toast.error(t("error.image_empty"));
      return;
    }
    // setGenState((prev) => ({ ...prev, isGeneratingPrompt: true }));
    setLoading(true);
    try {
      const res = await generatePrompt({
        apiKey: apiKey || "",
        prompt: imageGenForm.image,
      });

      logger.info(`generate res: `, res);

      const { keywords, naturalLanguage } = res;

      setKeywords((prev) => ({
        ...prev,
        text: keywords,
        originalText: keywords,
        // translatedText: keywords,
        language: "EN",
      }));
      setNaturalLanguage((prev) => ({
        ...prev,
        text: naturalLanguage,
        originalText: naturalLanguage,
        // translatedText: naturalLanguage,
        language: "EN",
      }));
      // setGenResult({
      //   ...genResult,
      //   keywords,
      //   naturalLanguage,
      //   originalKeywords: keywords,
      //   originalNaturalLanguage: naturalLanguage,
      // });
    } catch (error) {
      logger.error(`generateImage error: `, error);
      toast.error(t("error.generate_failed"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      onClick={handleGenPrompt}
      disabled={loading || genState.isGeneratingPrompt}
      size="sm"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("actions.generate_prompt")}
          {/* {genState.elapsedTime}s */}
        </>
      ) : (
        <>
          {/* <Wand2 className="h-4 w-4" /> */}
          {t("actions.generate_prompt")}
        </>
      )}
    </Button>
  );
};

export default GeneratePromptButton;
