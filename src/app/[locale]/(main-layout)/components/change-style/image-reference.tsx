import React from "react";
import ImageReferenceLeft from "./image-reference-left";
import ImageReferenceRight from "./image-reference-right";
import GenerateStyleReferenceImageButton from "./generate-style-reference-image-button";

const ImageReference = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-8">
        <ImageReferenceLeft />
        <ImageReferenceRight />
      </div>
      <div className="mt-4 flex justify-end">
        <GenerateStyleReferenceImageButton />
      </div>
    </div>
  );
};

export default ImageReference;
