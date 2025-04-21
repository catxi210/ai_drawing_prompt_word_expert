import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { genStateAtom } from "@/stores/slices/gen_store";
import { createScopedLogger } from "@/utils";
import { useAtom } from "jotai";
import { Loader2, Wand2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextDesc from "./text-desc";
import ImageActions from "../../components/change-style/image-actions";
import { styleFormAtom } from "@/stores/slices/style_form_store";
import ImageDesc from "./image-desc";
import GenerateStyleReferenceImageButton from "../../components/change-style/generate-style-reference-image-button";
import { styleOriginFormAtom } from "@/stores/slices/style_origin_form_store";
import { switchStoreAtom } from "@/stores/slices/switch_store";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";
import ImageDrop from "../../components/shared/image-drop";

interface ModelGenTopProps {
  className?: string;
}

const logger = createScopedLogger("gen-style-image-top");

const GenStyleImageTop = ({ className }: ModelGenTopProps) => {
  const t = useTranslations();
  // const [styleForm, setStyleForm] = useAtom(styleFormAtom);
  const [originImage, setOriginImage] = useAtom(styleOriginFormAtom);
  const [switchState, setSwitchState] = useAtom(switchStoreAtom);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleTabChange = (value: string) => {
    setSwitchState({
      ...switchState,
      activeTab: value as "text-desc" | "image-desc",
    });
  };
  return (
    <div className="w-full @container">
      <div className="flex flex-col">
        <div
          className={cn(
            "flex min-h-[300px] w-full flex-col gap-4 overflow-hidden rounded-lg p-2 pt-2 @[600px]:flex-row md:gap-12 md:p-4",
            "",
            className
          )}
        >
          <div className="w-full flex-shrink-0 self-start @[600px]:w-[320px] @[600px]:min-w-[320px]">
            {/* <ImageActions
              setStyleForm={setOriginImage}
              styleForm={originImage}
            /> */}
            <ImageDrop
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              imageForm={originImage}
              setImageForm={setOriginImage}
              height="280px"
            />
          </div>

          <div className="flex w-full flex-col space-y-2">
            <Tabs
              value={switchState.activeTab}
              onValueChange={handleTabChange}
              className="w-full max-w-full sm:max-w-[500px]"
            >
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger
                  value="text-desc"
                  className="flex-1 sm:flex-initial"
                >
                  {t("switch.text_description")}
                </TabsTrigger>
                <TabsTrigger
                  value="image-desc"
                  className="flex-1 sm:flex-initial"
                >
                  {t("switch.image_reference")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="text-desc">
                <TextDesc />
              </TabsContent>
              <TabsContent value="image-desc" className="space-y-2">
                <ImageDesc />
                {/* <div className="h-[400px]">123</div> */}
                <GenerateStyleReferenceImageButton />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenStyleImageTop;
