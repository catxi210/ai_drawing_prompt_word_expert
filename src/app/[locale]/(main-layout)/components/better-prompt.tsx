import { Button } from "@/components/ui/button";
import { WandSparkles } from "lucide-react";
import React from "react";
import { useBetterPrompt } from "../hooks/use-better-prompt";

const BetterPrompt = () => {
  const { handleBetterPrompt } = useBetterPrompt();

  return (
    <div>
      <Button variant="outline" size="icon" onClick={handleBetterPrompt}>
        <WandSparkles className="size-4 hover:cursor-pointer" />
      </Button>
    </div>
  );
};

export default BetterPrompt;
