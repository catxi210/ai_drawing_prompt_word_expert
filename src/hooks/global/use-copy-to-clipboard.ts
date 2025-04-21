import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type UseCopyToClipboardProps = {
  text: string;
  copyMessage?: string;
};

export function useCopyToClipboard({
  copyMessage = "Copied to clipboard!",
}: UseCopyToClipboardProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("global");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(
    (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success(copyMessage);
          setIsCopied(true);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          timeoutRef.current = setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        })
        .catch(() => {
          toast.error(t("error.copy_failed"));
        });
    },
    [copyMessage, t]
  );

  return { isCopied, handleCopy };
}
