import React from "react";
import ImageActions from "./image-actions";
import StyleArea from "./style-area";
import GenerateStyleImageButton from "./generate-style-image-button";
import { styleFormAtom } from "@/stores/slices/style_form_store";
import { useAtom } from "jotai";

const TextDescription = () => {
  const [styleForm, setStyleForm] = useAtom(styleFormAtom);
  return (
    <div className="flex w-full justify-between gap-8">
      <div className="w-1/3">
        <ImageActions setStyleForm={setStyleForm} styleForm={styleForm} />
      </div>
      <div className="flex w-2/3 flex-col">
        <StyleArea />
        <div className="mt-4">
          <GenerateStyleImageButton />
        </div>
      </div>
    </div>
  );
};

export default TextDescription;
