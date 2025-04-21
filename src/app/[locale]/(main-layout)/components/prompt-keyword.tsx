import React from "react";
import PromptResult from "./prompt-result";
import { useAtom } from "jotai";
import { genResultAtom } from "@/stores/slices/gen-result-store";
import { genStateAtom } from "@/stores/slices/gen_store";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";
import { keywordsAtom } from "@/stores/slices/keywords_store";

const PromptKeyword = () => {
  const [genResult, setGenResult] = useAtom(genResultAtom);
  const [genState, setGenState] = useAtom(genStateAtom);
  const [imageGenForm, setImageGenForm] = useAtom(imageGenFormAtom);
  const [keywords, setKeywords] = useAtom(keywordsAtom);

  const handleTextChange = (newText: string) => {
    // setImageGenForm((prev) => ({
    //   ...prev,
    //   prompt: newText,
    // }));
    setKeywords((prev) => ({
      ...prev,
      text: newText,
    }));
  };

  return (
    <PromptResult
      text={keywords.text || ""}
      isGenerating={genState.isGeneratingPrompt}
      onTextChange={handleTextChange}
    />
  );
};

export default PromptKeyword;
