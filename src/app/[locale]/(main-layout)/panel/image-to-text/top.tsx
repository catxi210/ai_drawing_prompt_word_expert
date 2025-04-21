import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { genStateAtom } from "@/stores/slices/gen_store";
import { createScopedLogger } from "@/utils";
import { useAtom } from "jotai";
import { Loader2, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import PromptInput from "../../components/prompt-input";
import GeneratePromptButton from "../../components/generate-prompt-button";
import GenerationOptions from "../../components/generation-options";
import GenerateImageButton from "../../components/generate-image-button";
import ImageDrop from "../../components/shared/image-drop";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";

interface ModelGenTopProps {
  className?: string;
}

const logger = createScopedLogger("image-to-text-top");

const ImageToTextTop = ({ className }: ModelGenTopProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageGenForm, setImageGenForm] = useAtom(imageGenFormAtom);

  return (
    <div className="@container">
      <div className="flex flex-col">
        <div
          className={cn(
            "flex min-h-[300px] flex-col gap-12 overflow-hidden rounded-lg p-4 @[600px]:flex-row",
            "",
            className
          )}
        >
          <div className="flex flex-col items-center @[600px]:w-[320px] @[600px]:min-w-[320px]">
            {/* <ImageDrop /> */}
            <ImageDrop
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              imageForm={imageGenForm}
              setImageForm={setImageGenForm}
              isAutoGenPrompt={true}
              height="280px"
            />
            {/* <div className="flex w-full justify-end">
              <GeneratePromptButton />
            </div> */}
          </div>

          <div className="flex w-full flex-col space-y-2">
            <div className="flex flex-col gap-4 @[600px]:flex-1 @[600px]:border-t-0">
              <PromptInput />
              <GenerationOptions />
            </div>
            <div className="flex w-full justify-end">
              <GenerateImageButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToTextTop;
