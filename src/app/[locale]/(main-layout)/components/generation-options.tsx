import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODEL_LIST } from "@/constants/models";
import {
  AspectRatio,
  AspectRatioSelector,
} from "@/components/ui/aspect-ratio-selector";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";

const defaultRatios: AspectRatio[] = [
  { width: 1, height: 1, label: `1:1` },
  { width: 2, height: 3, label: `2:3` },
  { width: 3, height: 2, label: `3:2` },
  { width: 3, height: 4, label: `3:4` },
];

const GenerationOptions = () => {
  const t = useTranslations();
  const [imageGenForm, setImageGenForm] = useAtom(imageGenFormAtom);

  return (
    <div className="@container">
      <div className="flex w-full flex-col items-center justify-end gap-6 md:flex-row">
        <div className="@[600px]:flex w-full items-center gap-2 sm:ml-0 sm:w-auto">
          <Label htmlFor="terms" className="whitespace-nowrap">
            {t("modelPlaceholder")}
          </Label>

          <Select
            onValueChange={(value) => {
              setImageGenForm((prev) => ({
                ...prev,
                model: value,
              }));
            }}
            defaultValue={imageGenForm.model}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("modelPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {MODEL_LIST.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center gap-2">
                    <model.icon className="h-4 w-4" />
                    {model.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="@[600px]:flex w-full items-center gap-2 sm:mr-0 sm:w-auto">
          <Label className="whitespace-nowrap text-sm">{t("resolution")}</Label>
          <AspectRatioSelector
            ratios={defaultRatios}
            value={imageGenForm as any}
            onChange={(value) =>
              setImageGenForm((prev) => ({
                ...prev,
                width: value.width,
                height: value.height,
              }))
            }
            placeholder={t("resolutionPlaceholder")}
          />
        </div>
      </div>
    </div>
  );
};

export default GenerationOptions;
