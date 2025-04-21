type ExtractVariables<T extends string> =
  T extends `${string}{${infer Param}}${infer Rest}`
    ? Param | ExtractVariables<Rest>
    : never;

type InferVariables<T extends string> = {
  [K in ExtractVariables<T>]: string;
};

class PromptTemplate<T extends string> {
  constructor(private template: T) {}

  compile(variables: InferVariables<T>): string {
    let result = this.template as string;
    (Object.entries(variables) as [ExtractVariables<T>, string][]).forEach(
      ([key, value]) => {
        result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
      }
    );
    return result;
  }
}

const createPrompt = <T extends string>(template: T) => {
  return new PromptTemplate(template);
};

const prompts = {
  optimizeImage:
    createPrompt(`Generate a single, comprehensive AI art prompt for this image. Including style, composition, lighting, background, character attributes, colors, emotions, and technical details. Make it detailed enough to recreate similar images. Firstly, output natural language in the form of a single paragraph without numbering or key points. Output as keywords separated by commas.

Output format:
Natural language:
key word:

Output the results directly in two forms without further explanation.`),

  // 示例：多变量模板
  customPrompt: createPrompt(
    `Create a {style} image of {subject} with {mood} mood, using {technique} technique.`
  ),
} as const;

export type Prompts = typeof prompts;
export default prompts;
