import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import TextDescription from "./text-description";
import ImageReference from "./image-reference";

interface ChangeStyleModalProps {
  open: boolean;
  onOpenChange: () => void;
}

const ChangeStyleModal = ({ open, onOpenChange }: ChangeStyleModalProps) => {
  const t = useTranslations();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] sm:max-w-[800px]">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="">
            <TabsTrigger value="text_description">
              {t("switch.text_description")}
            </TabsTrigger>
            <TabsTrigger value="image_reference">
              {t("switch.image_reference")}
            </TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="text_description">
            <TextDescription />
          </TabsContent>
          <TabsContent value="image_reference">
            <ImageReference />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeStyleModal;
