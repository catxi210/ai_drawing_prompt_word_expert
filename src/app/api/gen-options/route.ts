import { APICallError, generateText } from "ai";
import { createAI302 } from "@302ai/ai-sdk";
import { createScopedLogger } from "@/utils";
import { env } from "@/env";

const logger = createScopedLogger("gen-options");

export async function POST(request: Request) {
  try {
    const {
      prompt,
      apiKey,
    }: {
      prompt: string;
      apiKey: string;
    } = await request.json();
    console.log({ prompt });

    const ai302 = createAI302({
      apiKey,
      baseURL: `${env.NEXT_PUBLIC_API_URL}/v1/chat/completions`,
    });

    const result = await generateText({
      model: ai302("gpt-4o"),
      system: `
Generate inspiration options based on the input content.

-The inspiration option needs to be of the same category as the input content, but different from it.
-Ensure that the inspiration options can directly replace input content, with high transitional and strong applicability.
-Return exactly 5 options in a JSON array format.

This is an example:
Input content: Fox
Output content:
["cat", "elephant", "lion", "tiger", "dog"]

Return the 5 options as a JSON array only, without any additional text or explanation.
      `,
      prompt,
    });

    logger.info("Generated options successfully");

    // Parse the text response as JSON
    try {
      const jsonResult = JSON.parse(result.text);

      return Response.json({
        options: jsonResult,
      });
    } catch (parseError) {
      logger.error("Failed to parse model output as JSON", parseError);
      // Return the raw text if parsing fails
      const jsonResult = JSON.parse(
        result.text.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      );
      return Response.json({
        options: jsonResult,
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
          messageCn: "生成灵感选项失败",
          messageEn: "Failed to generate options",
          messageJa: "生成灵感选项に失敗しました",
          type: "GEN_OPTIONS_ERROR",
        },
      },
      { status: errorCode }
    );
  }
}
