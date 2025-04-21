import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import History from "./history";
import Pictures from "./pictures";

const PicAndHistoryTab = () => {
  const t = useTranslations();
  return (
    <Tabs defaultValue="history" className="w-full">
      <TabsList className="mb-2 flex justify-center bg-transparent">
        <TabsTrigger value="pic" className="mt-2 w-20 px-4 py-2 text-lg">
          {t("switch.pic")}
        </TabsTrigger>
        <TabsTrigger value="history" className="mt-2 w-20 px-4 py-2 text-lg">
          {t("switch.history")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pic">
        <Pictures />
      </TabsContent>
      <TabsContent value="history">
        <History />
      </TabsContent>
    </Tabs>
  );
};

export default PicAndHistoryTab;
