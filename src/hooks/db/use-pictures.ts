import { createScopedLogger } from "@/utils/logger";

const logger = createScopedLogger("use-pictures");
const PAGE_SIZE = 99999;

const pics = [
  {
    prompt:
      "vibrant, playful, digital illustration, turquoise hair, twin tails, stylish outfit, light gray shirt, teal tie, expressive green eyes, gentle smile, simple white background, soft lighting, lighthearted, energetic, modern anime aesthetic",
    url: "https://file.302.ai/gpt/imgs/20250403/compressed_e7cadab62bc942ada08a716750496dec.jpeg",
  },
  {
    prompt:
      "young male character, forest, deep green cloak, brown tunic, tousled hair, contemplative expression, adventure, mystery, tall trees, soft sunlight, earthy tones, tranquility, natural lighting, enchanting atmosphere, upper body composition, curiosity, introspection",
    url: "https://file.302.ai/gpt/imgs/20250403/compressed_edceaf5242c347258715e315432b62cb.jpeg",
  },
  {
    prompt:
      "Create a serene and enchanting portrait of a young girl standing in a sunlit forest, her long, wavy blonde hair cascading down her shoulders, illuminated by soft, golden sunlight filtering through the leaves. She wears a delicate, vintage-style cream blouse with lace detailing around the neckline, evoking a sense of innocence and nostalgia. The background is filled with lush greenery and soft bokeh effects, enhancing the dreamy atmosphere. The girl's expression is one of wonder and tranquility, capturing a moment of connection with nature. The overall color palette should consist of warm, earthy tones with hints of soft pastels, creating a harmonious and inviting scene. Use a shallow depth of field to keep the focus on the girl while gently blurring the background, adding to the ethereal quality of the image.",
    url: "https://file.302.ai/gpt/imgs/20250403/compressed_c941a497377046e381ecb3693e672d08.jpeg",
  },
  {
    prompt:
      "Create a vibrant and uplifting scene depicting two farmers standing in a golden wheat field, each holding a large bundle of wheat above their heads in a triumphant pose. The farmers should be dressed in traditional, casual clothing, with one wearing a wide-brimmed straw hat and the other in a plaid shirt, showcasing their connection to the land. The background should feature a clear blue sky with soft, warm sunlight illuminating the scene, casting gentle shadows on the wheat stalks. The colors should be rich and warm, emphasizing the golden hues of the wheat and the earthy tones of the farmers' clothing. The overall emotion conveyed should be one of joy and pride in their harvest, celebrating the fruits of their labor in a picturesque rural setting. The composition should be balanced, with the farmers positioned slightly off-center to create a dynamic visual flow, and the focus should be sharp to capture the details of the wheat and the expressions of the farmers.",
    url: "https://file.302.ai/gpt/imgs/20250403/compressed_932b9ca936fb4dcdbec53e2a8a7b489c.jpeg",
  },
  {
    prompt:
      "A serene and enchanting scene featuring a majestic fox sitting gracefully amidst a vibrant field of blooming flowers, illuminated by the warm glow of a sunset. The fox, with its striking orange fur and expressive eyes, gazes thoughtfully into the distance, embodying a sense of calm and curiosity. The background is filled with soft pastel colors of the sky, blending shades of pink, orange, and purple, while the foreground is adorned with delicate flowers in various hues, creating a harmonious and tranquil atmosphere. The overall composition evokes feelings of peace and wonder, capturing the beauty of nature in a whimsical, almost dreamlike style.",
    url: "https://file.302.ai/gpt/imgs/20250403/compressed_c4289bcb232c48749ced9c7969ac1e50.jpeg",
  },
  {
    prompt:
      "vibrant, whimsical, young girl, cluttered room, blue jumpsuit, green beret, white scarf, playful demeanor, white bag, pastel colors, natural light, checkered floor, lighthearted, imaginative, adventure, curiosity",
    url: "https://file.302.ai/gpt/imgs/20250403/compressed_07df56d9d99f4d3783a6a87fe1407c16.jpeg",
  },
  {
    prompt:
      "A young woman stands gracefully beneath a blooming cherry blossom tree, holding a shiny red apple in her hands. She wears a soft, white blouse with puffed sleeves, complemented by a wide-brimmed straw hat that casts a gentle shadow on her face. The bright blue sky serves as a vibrant backdrop, enhancing the delicate pink flowers surrounding her. Her expression is serene and contemplative, with a hint of warmth in her cheeks, suggesting a connection to nature and the season of spring. The lighting is soft and natural, creating a dreamy atmosphere that highlights the beauty of the moment.",
    url: "https://file.302.ai/gpt/imgs/20250403/compressed_c56e924b31df4449af3d834b7a471b88.jpeg",
  },
  {
    prompt:
      " A serene scene depicting a young girl in a school uniform standing amidst blooming cherry blossom trees, with soft pink petals gently falling around her. She has long, flowing hair and a contemplative expression, as she reaches out with one hand, seemingly interacting with the petals. The background features a softly blurred school building, bathed in warm, golden sunlight that filters through the branches, creating a dreamy atmosphere. The overall color palette is pastel, with shades of pink, blue, and white, evoking feelings of nostalgia and tranquility.",
    url: "https://file.302.ai/gpt/imgs/20250403/compressed_dc3134f505dd4c31924718cc3423d75d.jpeg",
  },
  {
    prompt:
      "pixel art, sunset, lone figure, red cloak, serene lake, ancient ruins, vibrant colors, adventure, tranquility, detailed foreground, distant mountains, glowing sun",
    url: "https://file.302.ai/gpt/imgs/20250403/compressed_edd04050d148415b89aacca2d794585e.jpeg",
  },
  {
    prompt:
      "black and white, young male character, tousled hair, expressive eyes, high-collared jacket, confident smile, bead of sweat, intricate earrings, geometric background, sharp lines, high contrast, dramatic composition",
    url: "https://file.302.ai/gpt/imgs/20250403/compressed_9833fd6b3eb3407d886ae789d6276178.jpeg",
  },
];

export const usePictures = (page = 1) => {
  const offset = (page - 1) * PAGE_SIZE;
  const items = pics.slice(offset, offset + PAGE_SIZE);
  const total = pics.length;

  return {
    items,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    currentPage: page,
  };
};
