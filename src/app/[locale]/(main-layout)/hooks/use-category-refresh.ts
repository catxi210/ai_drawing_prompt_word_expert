import { useState, useCallback } from "react";

// 类别及其细分项
export const CATEGORIES = {
  composition: [
    "rule_of_thirds",
    "symmetrical",
    "leading_lines",
    "framing",
    "negative_space",
    "diagonal",
    "close_up",
    "diagonal_composition",
    "fill_the_frame",
  ],
  lighting: [
    "side_lighting",
    "backlight",
    "soft_light",
    "hard_light",
    "natural_light",
    "artificial_light",
    "point_light",
  ],
  depth: ["shallow", "deep", "graduated", "selective_focus"],
  color: [
    "high_saturation",
    "low_saturation",
    "monochromatic",
    "complementary",
    "vibrant",
    "cool_tones",
    "warm_tones",
    "high_contrast",
    "low_contrast",
    "black_and_white",
  ],
  texture: [
    "smooth",
    "rough",
    "textured",
    "watercolor",
    "oil_painting",
    "sketch",
    "printmaking",
    "ink_painting",
    "crayon",
    "metallic",
  ],
  perspective: ["low_angle", "eye_level", "oblique"],
  style: [
    "photography",
    "illustration",
    "surrealism",
    "abstract",
    "impressionism",
    "modernism",
    "post_modernism",
    "cyberpunk",
    "post_apocalyptic",
    "anime",
    "realism",
  ],
  theme: ["fantasy", "nostalgic", "nature", "urban", "portrait"],
} as const;

export type Category = keyof typeof CATEGORIES;
export type CategoryItems = (typeof CATEGORIES)[Category];

// 获取每个类别下的随机项
const getRandomItems = () => {
  return Object.entries(CATEGORIES).reduce(
    (acc, [category, items]) => {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      acc[category as Category] = randomItem;
      return acc;
    },
    {} as Record<Category, string>
  );
};

// 自定义Hook
export const useCategoryRefresh = () => {
  const [randomItems, setRandomItems] = useState<Record<
    Category,
    string
  > | null>(null);

  const handleRefresh = useCallback(() => {
    setRandomItems(getRandomItems());
  }, []);

  return {
    randomItems,
    handleRefresh,
    categories: Object.keys(CATEGORIES) as Category[],
  };
};
