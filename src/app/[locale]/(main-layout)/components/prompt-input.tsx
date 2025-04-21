"use client";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { genResultAtom } from "@/stores/slices/gen-result-store";
import { genStateAtom } from "@/stores/slices/gen_store";
import PromptResult from "./prompt-result";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";
import { naturalLanguageAtom } from "@/stores/slices/naturalLanguage_store";
const PromptInput = () => {
  const [genState, setGenState] = useAtom(genStateAtom);
  const [naturalLanguage, setNaturalLanguage] = useAtom(naturalLanguageAtom);

  const handleTextChange = (newText: string) => {
    // setImageGenForm((prev) => ({
    //   ...prev,
    //   prompt: newText,
    // }));
    setNaturalLanguage((prev) => ({
      ...prev,
      text: newText,
    }));
  };
  return (
    <PromptResult
      text={naturalLanguage.text || ""}
      isGenerating={genState.isGeneratingPrompt}
      onTextChange={handleTextChange}
    />
  );
};

export default PromptInput;
