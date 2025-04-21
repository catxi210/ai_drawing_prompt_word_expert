import { APICallError, experimental_generateImage as generateImage } from "ai";
import { createAI302 } from "@302ai/ai-sdk";
import { createScopedLogger } from "@/utils";
import { env } from "@/env";
import ky from "ky";

const logger = createScopedLogger("gen-image");

export async function POST(request: Request) {
  try {
    const {
      prompt,
      apiKey,
      modelId,
      aspectRatio,
    }: {
      prompt: string;
      apiKey: string;
      modelId: string;
      aspectRatio: string;
    } = await request.json();

    const ai302 = createAI302({
      apiKey,
      baseURL: env.NEXT_PUBLIC_API_URL,
    });

    const { image } = await generateImage({
      model: ai302.image(modelId) as any,
      prompt,
      aspectRatio: aspectRatio as `${number}:${number}`,
    });

    logger.info("Image generated successfully");

    // Upload the generated base64 image to the server
    try {
      // Convert base64 to blob
      const base64Response = await fetch(
        `data:image/png;base64,${image.base64}`
      );
      const blob = await base64Response.blob();

      // Create FormData and append the image
      const formData = new FormData();
      formData.append("file", blob, "generated-image.png");

      // Upload the image
      const uploadResponse = await ky
        .post(`${env.NEXT_PUBLIC_AUTH_API_URL}/gpt/api/upload/gpt/image`, {
          body: formData,
        })
        .json<{
          code: number;
          msg: string;
          data: {
            url: string;
          };
        }>();

      if (uploadResponse.code === 0) {
        logger.info("Image uploaded successfully");

        return Response.json({
          image: {
            image: uploadResponse.data.url,
            imageUrl: uploadResponse.data.url,
            prompt: prompt,
            model: modelId,
          },
        });
      } else {
        logger.error(`Upload failed: ${uploadResponse.msg}`);
        throw new Error(`Image upload failed: ${uploadResponse.msg}`);
      }
    } catch (uploadError) {
      logger.error("Error uploading generated image:", uploadError);
      // If upload fails, still return the base64 image
      return Response.json({
        image: {
          image: image.base64,
          prompt: prompt,
          model: modelId,
          uploadError: "Failed to upload the image to server",
        },
      });
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
          messageCn: "生成图片失败",
          messageEn: "Failed to generate image",
          messageJa: "画像の生成に失敗しました",
          type: "IMAGE_GENERATION_ERROR",
        },
      },
      { status: errorCode }
    );
  }
}
