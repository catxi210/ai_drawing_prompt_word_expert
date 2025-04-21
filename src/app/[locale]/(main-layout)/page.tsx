"use client";
import ImageDrop from "./components/image-drop";
import PromptSwitch from "./components/prompt-switch";
import Desc from "./components/desc";
import GeneratePromptButton from "./components/generate-prompt-button";
import PicAndHistoryTab from "./components/pic-and-history-tab";
import GenerationOptions from "./components/generation-options";
import GenerateImageButton from "./components/generate-image-button";
import { useTranslations } from "next-intl";
import ChangeStyleButton from "./components/change-style/change-style-button";
import AppFooter from "@/components/global/app-footer";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lazy, Suspense } from "react";
import { createScopedLogger } from "@/utils";
import { useAtom } from "jotai";
import { uiStoreAtom } from "@/stores/slices/ui_store";
import GenStyleImagePanel from "./panel/gen-style-image-panel";

const ImageToTextPanel = lazy(() => import("./panel/image-to-text"));

export default function AuthPage() {
  const logger = createScopedLogger("Home");
  const t = useTranslations();
  const [uiStore, setUiStore] = useAtom(uiStoreAtom);

  return (
    <div className="grid flex-1">
      <div className="container mx-auto flex h-full max-w-[1000px] flex-col px-2 transition-[padding]">
        <Tabs
          defaultValue={uiStore.activeTab}
          value={uiStore.activeTab}
          onValueChange={(value: string) =>
            setUiStore((prev) => ({
              ...prev,
              activeTab: value as "image-to-prompt" | "style-change",
            }))
          }
          className="flex size-full flex-col"
        >
          <TabsList className="h-auto w-fit rounded-none border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="image-to-prompt"
              className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
            >
              {t("actions.generate_prompt")}
            </TabsTrigger>
            <TabsTrigger
              value="style-change"
              className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
            >
              {t("actions.change_style")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="image-to-prompt" className="flex-1">
            <Suspense
              fallback={<div className="p-4 text-center">{t("loading")}</div>}
            >
              <ImageToTextPanel />
            </Suspense>
          </TabsContent>
          <TabsContent value="style-change">
            <Suspense
              fallback={<div className="p-4 text-center">{t("loading")}</div>}
            >
              <GenStyleImagePanel />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
