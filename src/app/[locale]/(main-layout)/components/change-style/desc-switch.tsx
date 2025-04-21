import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "@/components/ui/button";
import { styleFormAtom } from "@/stores/slices/style_form_store";
import { useAtom } from "jotai";

// All available styles
const allStyles = [
  "anime",
  "watercolor",
  "low_poly",
  "pixel_art",
  "steampunk",
  "cyberpunk",
  "minimalist",
  "retro",
  "graffiti",
  "realistic",
  "impressionism",
  "surrealism",
  "abstract",
  "classical",
  "pop_art",
  "ghibli",
  "sci_fi",
  "illustration",
  "ink_painting",
  "sketch",
  "black_and_white",
  "crayon",
  "disney",
  "3d_animation",
  "dreamy",
];

const DescSwitch = () => {
  const t = useTranslations();
  const [styleForm, setStyleForm] = useAtom(styleFormAtom);

  const onClick = (style: string) => {
    setStyleForm({
      ...styleForm,
      prompt: style,
    });
  };

  return (
    <div className="w-full space-y-2">
      <div className="h-[120px] overflow-y-auto pr-2">
        <div className="grid grid-cols-4 gap-2">
          {allStyles.map((style) => (
            <Button
              key={style}
              variant="outline"
              size="sm"
              className="mb-2 h-6 w-full text-xs"
              onClick={() => onClick(t(`styles.${style}`))}
            >
              {t(`styles.${style}`)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DescSwitch;
