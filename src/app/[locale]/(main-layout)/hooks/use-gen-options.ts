import { appConfigAtom } from "@/stores/slices/config_store";
import { store } from "@/stores";
import { genResultAtom } from "@/stores/slices/gen-result-store";
import { useAtom } from "jotai";
import { genStateAtom } from "@/stores/slices/gen_store";
import { genOptions } from "@/services/gen-options";
import { useState } from "react";

interface GenOptionsResult {
  options: string[];
}

export const useGenOptions = () => {
  const { apiKey } = store.get(appConfigAtom);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const handleGenOptions = async (text: string): Promise<GenOptionsResult> => {
    try {
      setLoading(true);
      const result = await genOptions({
        apiKey: apiKey || "",
        message: text,
      });

      setOptions(result.options);
      return result;
    } catch (error) {
      console.error("Failed to generate options:", error);
      return { options: [] };
    } finally {
      setLoading(false);
    }
  };

  return { handleGenOptions, options, loading };
};
