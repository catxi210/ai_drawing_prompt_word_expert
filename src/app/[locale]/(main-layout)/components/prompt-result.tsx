"use client";
import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TranslateButton } from "./translate-button";
import { Loader2, SparkleIcon, Stars, WandSparkles } from "lucide-react";
import BetterPrompt from "./better-prompt";
import { useGenOptions } from "../hooks/use-gen-options";
import { useTranslations } from "next-intl";
import { useAtom } from "jotai";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";
import { genResultAtom } from "@/stores/slices/gen-result-store";
import { genStateAtom } from "@/stores/slices/gen_store";
import ChangeStyleButton from "./change-style/change-style-button";

interface PromptResultProps {
  text: string;
  isGenerating: boolean;
  onTextChange?: (newText: string) => void;
}

const PromptResult = ({
  text,
  isGenerating = false,
  onTextChange,
}: PromptResultProps) => {
  const [imageGenForm, setImageGenForm] = useAtom(imageGenFormAtom);
  const [genResult, setGenResult] = useAtom(genResultAtom);
  const [genState, setGenState] = useAtom(genStateAtom);
  // const [value, setValue] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const { handleGenOptions, loading, options } = useGenOptions();
  const t = useTranslations();
  const optionsPopupRef = useRef<HTMLDivElement>(null);
  const [optionsPopupPosition, setOptionsPopupPosition] = useState({
    top: 0,
    left: 0,
  });

  // useEffect(() => {
  //   setValue(text);
  // }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // setValue(newValue);

    onTextChange?.(newValue);
    setShowPopup(false);
    setShowOptions(false);
  };

  // 检查文本区域的选择状态
  const checkSelection = (textarea: HTMLTextAreaElement) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      setShowPopup(false);
      setShowOptions(false);
      return false;
    }

    setSelectionStart(start);
    setSelectionEnd(end);
    const selection = textarea.value.substring(start, end);
    setSelectedText(selection);
    return true;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 检查选择状态并更新弹窗位置
    if (checkSelection(textarea)) {
      setPopupPosition({ top: e.clientY, left: e.clientX });
      setShowPopup(true);
    }
  };

  // 添加点击事件处理
  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 延迟检查，确保处理完点击事件后的选择状态
    setTimeout(() => {
      checkSelection(textarea);
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 当文本区域失去焦点时，检查选择状态
  const handleBlur = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 延迟检查选择状态，避免与点击按钮的事件冲突
    setTimeout(() => {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // 如果没有选中文本，隐藏弹窗
      if (start === end) {
        setShowPopup(false);
      }
    }, 100);
  };

  const handleGenrateOptions = async (e: React.MouseEvent) => {
    try {
      // Prevent losing focus from textarea
      e.preventDefault();

      const textarea = textareaRef.current;
      if (!textarea) return;

      // 再次检查当前是否有选中文本
      if (textarea.selectionStart === textarea.selectionEnd) {
        setShowPopup(false);
        return;
      }

      // Save current selection
      const start = selectionStart;
      const end = selectionEnd;

      // Keep focus on textarea during the async operation
      textarea.focus();

      // Create a custom CSS class for the selection
      document.execCommand("hiliteColor", false, "rgba(139, 92, 246, 0.3)");

      // Generate options
      await handleGenOptions(selectedText);

      // Make sure textarea is still focused with selection
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(start, end);
      }

      // Save the position - use the same position as the initial popup
      setOptionsPopupPosition({
        top: popupPosition.top - 10, // Slightly above the initial popup
        left: popupPosition.left, // Use same left position as the selection popup
      });

      setShowOptions(true);
      setShowPopup(false);
    } catch (error) {
      console.error("Failed to generate options:", error);
    }
  };

  const handleOptionClick = (option: string) => {
    // Get the textarea element
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Focus the textarea to ensure it receives the commands
    textarea.focus();

    // Use execCommand for undo-able operations
    // First, ensure the correct text is selected
    textarea.setSelectionRange(selectionStart, selectionEnd);

    // Use document.execCommand to insert text (this is undo-able with Ctrl+Z)
    document.execCommand("insertText", false, option);

    // Get the new text value after the replacement
    const newValue = textarea.value;

    // setValue(newValue);
    // if (genState.textType === "naturalLanguage") {
    //   setGenResult({
    //     ...genResult,
    //     naturalLanguage: newValue,
    //   });
    // } else {
    //   setGenResult({ ...genResult, keywords: newValue });
    // }

    // Pass the change to parent if needed
    onTextChange?.(newValue);

    // Hide options
    setShowOptions(false);
  };

  // Add a keyboard event handler to maintain selection on Tab and other keys
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && showPopup) {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(selectionStart, selectionEnd);
      }
    }
  };

  // 添加selectionchange事件监听器来追踪选择变化
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleSelectionChange = () => {
      // 确保焦点在文本区域上
      if (document.activeElement === textarea) {
        checkSelection(textarea);
      }
    };

    // 使用mousedown事件来捕获新的点击，可能会清除选择
    const handleMouseDown = () => {
      // 延迟检查选择状态
      setTimeout(() => {
        if (document.activeElement === textarea) {
          checkSelection(textarea);
        }
      }, 0);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    textarea.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      textarea.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // Update the useEffect to adjust the options popup position
  useEffect(() => {
    if (showOptions && optionsPopupRef.current) {
      const updatePosition = () => {
        const popup = optionsPopupRef.current;
        if (!popup) return;

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Get popup dimensions
        const popupRect = popup.getBoundingClientRect();
        const popupWidth = popupRect.width;
        const popupHeight = popupRect.height;

        // Start with the position near where the initial popup appeared
        let top = optionsPopupPosition.top;
        let left = optionsPopupPosition.left;

        // Ensure popup is fully visible horizontally
        if (left + popupWidth > viewportWidth) {
          // If it would go off right edge, adjust left position
          left = Math.max(10, viewportWidth - popupWidth - 10);
        }

        // Ensure popup is not off the left edge
        if (left < 10) {
          left = 10;
        }

        // Ensure popup is fully visible vertically
        if (top + popupHeight > viewportHeight) {
          // If it would go off bottom, position above the selection
          top = Math.max(10, viewportHeight - popupHeight - 10);
        }

        // Make sure top isn't off-screen
        if (top < 10) {
          top = 10;
        }

        setOptionsPopupPosition({ top, left });
      };

      // Initial position update
      updatePosition();

      // Update position on window resize
      window.addEventListener("resize", updatePosition);
      return () => window.removeEventListener("resize", updatePosition);
    }
  }, [showOptions, options, optionsPopupPosition]);

  return (
    <div className="relative h-[220px] w-full">
      <div className="relative h-full w-full flex-1 flex-row rounded-lg border border-solid border-gray-300 focus-within:ring-1 focus-within:ring-violet-500 @[600px]:flex dark:focus-within:ring-violet-500">
        {genState.isGeneratingPrompt ? (
          <div className="flex h-[220px] w-full items-center justify-center">
            {/* <Loader2 className="size-4 animate-spin" /> */}
            <div className="flex w-full flex-col items-center justify-center gap-3">
              <Loader2 className="size-5 animate-spin text-violet-500 dark:text-violet-400" />
              <span className="font-medium text-violet-700 dark:text-violet-300">
                {t("actions.generating_prompt")}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="relative flex h-full w-full flex-col">
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={handleChange}
                onMouseUp={handleMouseUp}
                onClick={handleClick}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="inset-0 h-full w-full border-none bg-white pb-24 shadow-none [resize:none] focus-visible:ring-0 dark:bg-gray-900 [&::selection]:bg-violet-200 dark:[&::selection]:bg-violet-700/50"
                placeholder={t("prompt_placeholder")}
              />

              {genState.isGeneratingPrompt && (
                <div className="absolute inset-0 bottom-16 mx-4 flex w-full items-center justify-center rounded-md border border-violet-200 bg-violet-50 p-3 dark:border-violet-800 dark:bg-violet-900/20">
                  <div className="flex w-full items-center gap-3">
                    <Loader2 className="size-5 animate-spin text-violet-500 dark:text-violet-400" />
                    <span className="font-medium text-violet-700 dark:text-violet-300">
                      正在生成提示...
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 bg-white p-4 pb-1 pt-0.5 dark:bg-gray-900">
                <TranslateButton />
                <BetterPrompt />
              </div>
            </div>

            {showPopup && selectedText && (
              <div
                ref={popupRef}
                style={{
                  position: "fixed",
                  top: popupPosition.top,
                  left: popupPosition.left,
                  transform: "translateY(-100%)",
                }}
                className="z-50 flex gap-2 rounded-md border shadow-lg dark:bg-gray-800"
                onMouseDown={(e) => {
                  // Prevent losing selection when clicking popup
                  e.preventDefault();
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenrateOptions}
                  className="dark:bg-gray-700"
                  onMouseDown={(e) => {
                    // Prevent losing focus/selection when clicking button
                    e.preventDefault();
                  }}
                >
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  {!loading && <Stars className="size-4" />}
                </Button>
              </div>
            )}

            {showOptions && options.length > 0 && (
              <div
                ref={optionsPopupRef}
                style={{
                  position: "fixed",
                  top: optionsPopupPosition.top,
                  left: optionsPopupPosition.left,
                  maxWidth: "400px",
                }}
                className="z-50 max-h-[70vh] overflow-auto rounded-md border bg-white p-2 shadow-lg dark:bg-gray-800"
              >
                <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("actions.options")}
                </div>
                <div className="flex flex-col gap-1">
                  {options.map((option, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="justify-start text-left hover:bg-violet-100 dark:hover:bg-violet-900/50"
                      onClick={() => handleOptionClick(option)}
                      title={option}
                    >
                      <span className="line-clamp-2 text-sm">{option}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PromptResult;
