import { APICallError, generateText } from "ai";
import { createAI302 } from "@302ai/ai-sdk";
import { createScopedLogger } from "@/utils";
import { env } from "@/env";

const logger = createScopedLogger("better-prompt");

const LANGUAGE_MAP = {
  EN: "Always return English results in plain text format and do not add any other content",
  ZH: "Always return Chinese results in plain text format and do not add any other content.",
  JA: "Always return Japanese results in plain text format and do not add any other content.",
};

export async function POST(request: Request) {
  try {
    const {
      prompt,
      apiKey,
      promptType,
      language,
    }: {
      prompt: string;
      apiKey: string;
      promptType: "naturalLanguage" | "keywords";
      language: "EN" | "JA" | "ZH";
    } = await request.json();

    const ai302 = createAI302({
      apiKey,
      baseURL: `${env.NEXT_PUBLIC_API_URL}/v1/chat/completions`,
    });

    const languagePrompt = LANGUAGE_MAP[language];
    console.log("languagePrompt", languagePrompt);

    const naturalLanguagePrompt = `
 Optimize and enhance the prompts provided for image generation to ensure that Midjourney or other diffusion models can generate excellent views.

-You should provide a detailed and accurate description of the prompt view. If the provided prompt is too simple, you should add some additional details to enrich it and improve the expression of the image content. If necessary, you can use some famous IP names.
-Introduce the topic with higher weights. Avoid using introductory phrases such as' this image displays' or 'on-site'. Avoid using terms that describe cultural values or spirits, such as "creating an xxx atmosphere" or "enhancing the xxx scene".
-Avoid ambiguous expressions and focus only on describing the scene you see in clear and specific terms. Avoid over interpreting abstract or indescribable elements.
-When there are spelling or grammar errors in the input content, you should correct them to improve the accuracy of the prompts.

${languagePrompt}
    `;

    const newPrompt = naturalLanguagePrompt;

    const result = await generateText({
      model: ai302("gpt-4o"),
      system: `
You are an AI that analyzes images and creates comprehensive art prompts.

When given an image, you will generate:
1. A detailed paragraph description (naturalLanguage)
2. A comma-separated list of keywords (keywords)

You must format your entire response as a valid JSON object with exactly this structure:
{
  "naturalLanguage": "your detailed paragraph here",
  "keywords": "keyword1, keyword2, keyword3, etc"
}

Only output the JSON object. Do not include any explanations, markdown formatting, or any text outside the JSON structure.
      `,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `${newPrompt}\n\nOptimize this prompt: ${prompt}`,
            },
          ],
        },
      ],
    });

    logger.info("Better prompt generated successfully");

    // Parse the text response as JSON
    try {
      const jsonResult = JSON.parse(result.text);

      return Response.json({
        naturalLanguage: jsonResult.naturalLanguage,
        keywords: jsonResult.keywords,
      });
    } catch (parseError) {
      logger.error("Failed to parse model output as JSON", parseError);
      // Return the raw text if parsing fails
      const { naturalLanguage, keywords } = JSON.parse(
        result.text.replace(/```json\n/, "").replace(/\n```/, "")
      );
      return Response.json({
        naturalLanguage,
        keywords,
        error: "Failed to parse as JSON, returning raw text",
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
          messageCn: "生成优化提示词失败",
          messageEn: "Failed to generate prompt",
          messageJa: "プロンプトの生成に失敗しました",
          type: "BETTER_PROMPT_ERROR",
        },
      },
      { status: errorCode }
    );
  }
}
