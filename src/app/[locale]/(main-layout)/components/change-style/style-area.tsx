import React from "react";
import StyleInput from "./style-input";
import DescSwitch from "./desc-switch";

const StyleArea = () => {
  return (
    <div className="flex w-full flex-1 flex-col gap-4">
      <StyleInput />
      <DescSwitch />
    </div>
  );
};

export default StyleArea;
