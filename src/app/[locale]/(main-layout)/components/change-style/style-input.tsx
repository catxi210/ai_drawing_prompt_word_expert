import { Textarea } from "@/components/ui/textarea";
import { styleFormAtom } from "@/stores/slices/style_form_store";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import React from "react";

const StyleInput = () => {
  const t = useTranslations();
  const [styleForm, setStyleForm] = useAtom(styleFormAtom);
  return (
    <div className="w-full space-y-2">
      <Textarea
        id="text-area"
        className="h-12 w-full"
        value={styleForm.prompt}
        onChange={(e) => setStyleForm({ ...styleForm, prompt: e.target.value })}
        placeholder={t("actions.style_description")}
      ></Textarea>
    </div>
  );
};

export default StyleInput;
