import React from "react";
import GenStyleImageTop from "./top";
import GenStyleImageBottom from "./bottom";
import { Separator } from "@/components/ui/separator";

const GenStyleImagePanel = () => {
  return (
    <div className="flex size-full flex-col gap-4">
      <div className="@container">
        <div className="rounded-lg border bg-card text-card-foreground">
          <div className="grid gap-4 p-4">
            <GenStyleImageTop />
            <Separator />
            <GenStyleImageBottom />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenStyleImagePanel;
