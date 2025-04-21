"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useTranslate } from "../hooks/use-translate";
import { ChevronsUpDown, Languages, Loader2 } from "lucide-react";
import { useAtom } from "jotai";
import { genStateAtom } from "@/stores/slices/gen_store";
import { naturalLanguageAtom } from "@/stores/slices/naturalLanguage_store";
import { keywordsAtom } from "@/stores/slices/keywords_store";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const LanguageMap = {
  ZH: "language.zh",
  JA: "language.ja",
  EN: "language.translate",
};

export function TranslateButton() {
  const t = useTranslations();
  const [genState, setGenState] = useAtom(genStateAtom);
  // const { isTranslating } = useAtomValue(genStateAtom);
  const { isTranslating, handleTranslationChange, option } = useTranslate();

  // const [currentOption, setCurrentOption] = React.useState<Option>();
  const [naturalLanguage, setNaturalLanguage] = useAtom(naturalLanguageAtom);
  const [keywords, setKeywords] = useAtom(keywordsAtom);

  // React.useEffect(() => {
  //   console.log("currentOption", currentOption);

  //   if (genState.textType === "naturalLanguage") {
  //     setCurrentOption(naturalLanguage.language);
  //   } else {
  //     setCurrentOption(keywords.language);
  //   }
  // }, [genState.textType]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isTranslating}>
          {isTranslating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {/* {t(LanguageMap[(option || "EN") as keyof typeof LanguageMap])} */}
              <Languages className="h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit min-w-[80px]">
        <DropdownMenuCheckboxItem
          checked={option === "ZH"}
          onCheckedChange={() => handleTranslationChange("ZH")}
          className="pl-6 pr-2"
        >
          {t("language.zh")}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={option === "JA"}
          onCheckedChange={() => handleTranslationChange("JA")}
          className="pl-6 pr-2"
        >
          {t("language.ja")}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
