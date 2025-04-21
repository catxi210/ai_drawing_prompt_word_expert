import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

// Helper function to truncate text
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Collapsible text component
const CollapsibleText = ({
  text,
  maxLength = 60,
}: {
  text: string;
  maxLength?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations();
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldTruncate, setShouldTruncate] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Measure content height when text changes or on mount and determine if truncation is needed
  useEffect(() => {
    if (contentRef.current && textRef.current) {
      const fullHeight = textRef.current.scrollHeight;
      const maxCollapsedHeight = 40; // Approximately 2.5rem in pixels
      setShouldTruncate(fullHeight > maxCollapsedHeight);
      setContentHeight(fullHeight);
    }
  }, [text]);

  return (
    <div className="px-2 py-1.5 text-sm sm:px-3 sm:py-2">
      <div
        ref={contentRef}
        style={{ maxHeight: isExpanded ? `${contentHeight}px` : "2.5rem" }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div ref={textRef}>{text}</div>
      </div>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 flex min-h-[36px] w-full items-center justify-start rounded-md py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5 sm:min-h-[28px] sm:w-auto sm:py-1"
          aria-expanded={isExpanded}
          aria-controls="collapsible-content"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-1 h-4 w-4 transition-transform duration-200 sm:h-3 sm:w-3" />
              <span>{t("actions.collapse")}</span>
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-4 w-4 transition-transform duration-200 sm:h-3 sm:w-3" />
              <span>{t("actions.expand")}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default CollapsibleText;
