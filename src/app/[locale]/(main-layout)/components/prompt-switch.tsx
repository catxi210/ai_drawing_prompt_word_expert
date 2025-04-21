"use client";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PromptInput from "./prompt-input";
import PromptKeyword from "./prompt-keyword";
import { useTranslations } from "next-intl";
import { genResultAtom } from "@/stores/slices/gen-result-store";
import { useAtom } from "jotai";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";
import { genStateAtom } from "@/stores/slices/gen_store";

const PromptSwitch = () => {
  const t = useTranslations();
  const [genResult] = useAtom(genResultAtom);
  const [imageGenForm, setImageGenForm] = useAtom(imageGenFormAtom);
  const [genState, setGenState] = useAtom(genStateAtom);
  // The initial setup of the prompt based on the default tab
  useEffect(() => {
    if (!imageGenForm.prompt && genResult?.naturalLanguage) {
      setImageGenForm({
        ...imageGenForm,
        prompt: genResult.naturalLanguage,
      });
    }
  }, [genResult?.naturalLanguage]);

  const handleValueChange = (value: string) => {
    if (value === "naturalLanguage") {
      setImageGenForm({
        ...imageGenForm,
        prompt: genResult?.naturalLanguage || "",
      });
      setGenState({
        ...genState,
        textType: "naturalLanguage",
      });
    } else {
      setImageGenForm({
        ...imageGenForm,
        prompt: genResult?.keywords || "",
      });
      setGenState({
        ...genState,
        textType: "keywords",
      });
    }
  };
  return (
    <Tabs
      defaultValue={genState.textType}
      onValueChange={handleValueChange}
      className="w-full"
    >
      <TabsList>
        <TabsTrigger value="naturalLanguage">
          {t("switch.natural_language")}
        </TabsTrigger>
        <TabsTrigger value="keywords">{t("switch.keywords")}</TabsTrigger>
      </TabsList>
      <TabsContent value="naturalLanguage">
        <PromptInput />
      </TabsContent>
      <TabsContent value="keywords">
        <PromptKeyword />
      </TabsContent>
    </Tabs>
  );
};

export default PromptSwitch;
