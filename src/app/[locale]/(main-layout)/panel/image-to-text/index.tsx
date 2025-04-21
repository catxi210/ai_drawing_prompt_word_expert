import React from "react";
import ImageToTextTop from "./top";
import ImageToTextBottom from "./bottom";
import { Separator } from "@/components/ui/separator";

const ImageToTextPanel = () => {
  return (
    <div className="flex size-full flex-col gap-4">
      <div className="@container">
        <div className="rounded-lg border bg-card text-card-foreground">
          <div className="grid gap-4 p-4">
            <ImageToTextTop />
            <Separator />
            <ImageToTextBottom />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToTextPanel;
