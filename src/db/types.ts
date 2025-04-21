export type History = {
  id: string;
  rawPrompt: string;
  shouldOptimize: boolean;
  aspectRatio: string;
  image: {
    base64: string;
    prompt: string;
    model: string;
    status: "pending" | "success" | "failed";
  };
  referenceImage?: {
    base64: string;
    status: "pending" | "success" | "failed";
  };
  originImage?: {
    base64: string;
    status: "pending" | "success" | "failed";
  };

  createdAt: number;
};

export type AddHistory = Omit<History, "id" | "createdAt">;
