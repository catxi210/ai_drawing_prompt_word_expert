import * as React from "react";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import { appConfigAtom, store } from "@/stores";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";
import { genResultAtom } from "@/stores/slices/gen-result-store";
import { genStateAtom } from "@/stores/slices/gen_store";
import { translatePrompt } from "@/services/translate-prompt";
import { naturalLanguageAtom } from "@/stores/slices/naturalLanguage_store";
import { keywordsAtom } from "@/stores/slices/keywords_store";
import { originalTextAtom } from "@/stores/slices/original_text_store";

type Option = "ZH" | "JA" | "EN";

export function useTranslate() {
  const { apiKey } = store.get(appConfigAtom);
  const [genState, setGenState] = useAtom(genStateAtom);
  const [isTranslating, setIsTranslating] = React.useState<boolean>(false);
  const [naturalLanguage, setNaturalLanguage] = useAtom(naturalLanguageAtom);
  const [keywords, setKeywords] = useAtom(keywordsAtom);
  const [currentOption, setCurrentOption] = React.useState<Option>();
  const [isTranslated, setIsTranslated] = React.useState<boolean>(false);
  const [originalText, setOriginalText] = useAtom(originalTextAtom);

  React.useEffect(() => {
    if (genState.textType === "naturalLanguage") {
      setCurrentOption(naturalLanguage.language);
    } else {
      setCurrentOption(keywords.language);
    }
  }, [genState.textType]);

  const handleTranslationChange = async (option: Option) => {
    if (currentOption === "EN") {
      if (genState.textType === "naturalLanguage") {
        setOriginalText({
          ...originalText,
          naturalLanguage: naturalLanguage.text,
        });
      } else {
        setOriginalText({
          ...originalText,
          keywords: keywords.text,
        });
      }
    }
    const isSameOption = option === currentOption;
    const targetLanguage = isSameOption ? "EN" : option;

    if (isSameOption) {
      if (genState.textType === "naturalLanguage") {
        if (naturalLanguage.text === naturalLanguage.translatedText) {
          setNaturalLanguage({
            ...naturalLanguage,
            text: originalText.naturalLanguage,
            language: "EN",
          });
          setCurrentOption("EN");
          return;
        } else {
          setNaturalLanguage({
            ...naturalLanguage,
            language: "EN",
          });
        }
      }
    }

    const sourceText =
      genState.textType === "naturalLanguage"
        ? naturalLanguage.text
        : keywords.text;
    setIsTranslating(true);

    try {
      const res = await translatePrompt({
        apiKey: apiKey || "",
        message: sourceText,
        language: targetLanguage,
      });

      // Set current option based on whether we're toggling back to English or to the target language
      const newLanguage = isSameOption ? "EN" : option;
      setCurrentOption(newLanguage);

      if (genState.textType === "naturalLanguage") {
        setNaturalLanguage({
          ...naturalLanguage,
          text: res.translatedText,
          translatedText: res.translatedText,
          language: newLanguage,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    handleTranslationChange,
    isTranslating,
    currentOption,
    option: currentOption,
  };
}
