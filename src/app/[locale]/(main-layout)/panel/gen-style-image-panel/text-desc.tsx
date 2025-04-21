import React from "react";
import StyleInput from "../../components/change-style/style-input";
import DescSwitch from "../../components/change-style/desc-switch";
import GenerateStyleImageButton from "../../components/change-style/generate-style-image-button";

const TextDesc = () => {
  return (
    <div className="space-y-3">
      <StyleInput />
      <DescSwitch />
      <GenerateStyleImageButton />
    </div>
  );
};

export default TextDesc;
