import { useAtom } from "jotai";
import { appConfigAtom } from "@/stores/slices/config_store";
import { store } from "@/stores";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";
import { genStateAtom } from "@/stores/slices/gen_store";
import { genResultAtom } from "@/stores/slices/gen-result-store";
import { betterPrompt } from "@/services/better-prompt";
import { keywordsAtom } from "@/stores/slices/keywords_store";
import { naturalLanguageAtom } from "@/stores/slices/naturalLanguage_store";

export const useBetterPrompt = () => {
  const { apiKey } = store.get(appConfigAtom);
  const [genState, setGenState] = useAtom(genStateAtom);
  const [genResult, setGenResult] = useAtom(genResultAtom);
  const [imageGenForm, setImageGenForm] = useAtom(imageGenFormAtom);
  const [keywords, setKeywords] = useAtom(keywordsAtom);
  const [naturalLanguage, setNaturalLanguage] = useAtom(naturalLanguageAtom);
  const handleBetterPrompt = async () => {
    setGenState((prev) => ({ ...prev, isGeneratingPrompt: true }));
    try {
      const res = await betterPrompt({
        prompt:
          genState.textType === "naturalLanguage"
            ? naturalLanguage.text
            : keywords.text,
        apiKey: apiKey || "",
        promptType: genState.textType,
        language: naturalLanguage.language,
      });
      if (genState.textType === "naturalLanguage") {
        setNaturalLanguage({
          ...naturalLanguage,
          text: res.naturalLanguage,
        });
      } else {
        setKeywords({
          ...keywords,
          text: res.keywords,
        });
      }
      // setGenResult({
      //   ...genResult,
      //   [genState.textType]: res[genState.textType],
      //   [`original${genState.textType.charAt(0).toUpperCase() + genState.textType.slice(1)}`]:
      //     res[genState.textType],
      // });
      // setImageGenForm({
      //   ...imageGenForm,
      //   prompt: res[genState.textType],
      // });
    } catch (error) {
      console.error(error);
    } finally {
      setGenState((prev) => ({ ...prev, isGeneratingPrompt: false }));
    }
  };

  return {
    handleBetterPrompt,
    isGeneratingPrompt: genState.isGeneratingPrompt,
  };
};
