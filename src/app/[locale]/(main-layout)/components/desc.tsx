import { Label } from "@/components/ui/label";
import React from "react";
import { useTranslations } from "next-intl";
import { RefreshCcw } from "lucide-react";
import { useCategoryRefresh } from "../hooks/use-category-refresh";
import { useAtom } from "jotai";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";
import { genResultAtom } from "@/stores/slices/gen-result-store";
import { genStateAtom } from "@/stores/slices/gen_store";
import { naturalLanguageAtom } from "@/stores/slices/naturalLanguage_store";
import { keywordsAtom } from "@/stores/slices/keywords_store";
const Desc = () => {
  const t = useTranslations();
  const { randomItems, handleRefresh, categories } = useCategoryRefresh();
  const [genResult, setGenResult] = useAtom(genResultAtom);
  const [imageGenForm, setImageGenForm] = useAtom(imageGenFormAtom);
  const [genState, setGenState] = useAtom(genStateAtom);
  const [naturalLanguage, setNaturalLanguage] = useAtom(naturalLanguageAtom);
  const [keywords, setKeywords] = useAtom(keywordsAtom);
  const onClick = (category: string) => {
    if (genState.textType === "keywords") {
      setKeywords({
        ...keywords,
        text: keywords.text + "," + category,
      });
    } else {
      setNaturalLanguage({
        ...naturalLanguage,
        text: naturalLanguage.text + "," + category,
      });
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1">
          <Label className="whitespace-nowrap text-xs">
            {t("image_desc_reference.title")}
          </Label>
          <RefreshCcw
            className="size-3 cursor-pointer transition-colors"
            onClick={handleRefresh}
          />
        </div>
        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
          {categories.map((category, index) => (
            <span
              key={category}
              className="inline-flex items-center"
              onClick={() =>
                onClick(
                  randomItems
                    ? t(`category.${category}.${randomItems[category]}`)
                    : t(`category.${category}.title`)
                )
              }
            >
              {randomItems ? (
                <span className="text-primary">
                  {t(`category.${category}.${randomItems[category]}`)}
                </span>
              ) : (
                <span className="text-primary">
                  {t(`category.${category}.title`)}
                </span>
              )}
              {index < categories.length - 1 && <span className="mx-1"> </span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Desc;
