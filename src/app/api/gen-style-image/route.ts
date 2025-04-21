import {
  APICallError,
  experimental_generateImage as generateImag,
  generateText,
} from "ai";
import { ai302, createAI302 } from "@302ai/ai-sdk";
import { createScopedLogger } from "@/utils";
import { env } from "@/env";
import image from "next/image";

const logger = createScopedLogger("gen-style-image");

export async function POST(request: Request) {
  try {
    const {
      prompt,
      apiKey,
      image,
    }: {
      prompt: string;
      apiKey: string;
      image: string;
    } = await request.json();

    const ai302 = createAI302({
      apiKey,
      baseURL: `${env.NEXT_PUBLIC_API_URL}/v1/chat/completions`,
    });
    const resp = await generateText({
      model: ai302("gpt-4o-image-generation"),
      system:
        "Convert the image into the corresponding style based on the provided content.",
      messages: [
        {
          role: "user",
          content: `
          User input content: "${prompt}".
          Image input: ${image}`,
        },
      ],
    });

    // Parse the response text to get the URL
    try {
      // Extract image URL using regex
      const imageUrlMatch = resp.text.match(/!\[Image\]\((https:\/\/[^)]+)\)/);
      const imageUrl = imageUrlMatch ? imageUrlMatch[1] : null;

      if (!imageUrl) {
        logger.error("Image URL not found in response");
        return Response.json(
          {
            error: "Image URL not found in response",
            resp,
          },
          { status: 500 }
        );
      }

      console.log("imageUrl", imageUrl);

      return Response.json({
        url: imageUrl,
      });
    } catch (parseError) {
      logger.error("Failed to parse response JSON", parseError);
      return Response.json(
        {
          error: "Invalid response format",
          message: resp,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error(error);
    if (error instanceof APICallError) {
      const resp = error.responseBody;
      return Response.json(resp, { status: 500 });
    }

    // Handle different types of errors
    let errorMessage = "Failed to generate prompt";
    let errorCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      if ("code" in error && typeof (error as any).code === "number") {
        errorCode = (error as any).code;
      }
    }

    return Response.json(
      {
        error: {
          errCode: errorCode,
          message: errorMessage,
          messageCn: "生成风格图片失败",
          messageEn: "Failed to generate style image",
          messageJa: "画像の生成に失敗しました",
          type: "IMAGE_GENERATION_ERROR",
        },
      },
      { status: errorCode }
    );
  }
}
