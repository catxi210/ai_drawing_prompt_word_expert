"use client";

import { useHistory } from "@/hooks/db/use-gen-history";
import { useStyleHistory } from "@/hooks/db/use-gen-style-history";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { add, format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  CopyIcon,
  Download,
  Trash2,
  Trophy,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Feather,
  MoreVertical,
  Info,
  Sparkles,
} from "lucide-react";
import { getModelById } from "@/constants/models";
import Image from "next/image";
import { GalleryModal } from "@/components/ui/gallery/gallery-modal";
import { useState, useMemo } from "react";
import type { MediaItemType } from "@/components/ui/gallery/gallery";
import type { History as HistoryType } from "@/db/types";
import { useMonitorMessage } from "@/hooks/global/use-monitor-message";
import { useCopyToClipboard } from "@/hooks/global/use-copy-to-clipboard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CollapsibleText from "./collapsible-text";
import { useAtom } from "jotai";
import { styleFormAtom } from "@/stores/slices/style_form_store";
import { styleReferenceFormAtom } from "@/stores/slices/style_reference_form_store";
import { styleOriginFormAtom } from "@/stores/slices/style_origin_form_store";
import { referenceImageStoreAtom } from "@/stores/slices/reference_image_store";
import { switchStoreAtom } from "@/stores/slices/switch_store";
import { uiStoreAtom } from "@/stores/slices/ui_store";
import { useReferenceImages } from "@/hooks/db/use-reference-images";

interface GalleryItem extends MediaItemType {
  id: string;
  url: string;
  base64: string;
  title: string;
  desc: string;
  tag?: string;
}

interface HistoryProps {
  type?: "default" | "style";
}

export default function History({ type = "default" }: HistoryProps) {
  const t = useTranslations();
  const commonT = useTranslations("common");
  const [page, setPage] = useState(1);

  // Fix conditional hooks by calling both hooks unconditionally
  const { history: defaultHistory, deleteHistory: deleteDefaultHistory } =
    useHistory(page);
  const { history: styleHistory, deleteHistory: deleteStyleHistory } =
    useStyleHistory(page);

  const [styleReferenceForm, setStyleReferenceForm] = useAtom(
    styleReferenceFormAtom
  );

  // Use the appropriate history and deleteHistory based on type
  const history = type === "default" ? defaultHistory : styleHistory;
  const deleteHistory =
    type === "default" ? deleteDefaultHistory : deleteStyleHistory;

  const { addReferenceImage } = useReferenceImages();

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFullPrompt, setShowFullPrompt] = useState<string | null>(null);

  // Style form atoms
  const [styleForm, setStyleForm] = useAtom(styleFormAtom);
  const [styleOriginForm, setStyleOriginForm] = useAtom(styleOriginFormAtom);
  const [uiState, setUiState] = useAtom(uiStoreAtom);
  const [switchState, setSwitchState] = useAtom(switchStoreAtom);

  const { handleDownload } = useMonitorMessage();
  const { handleCopy } = useCopyToClipboard({
    copyMessage: t("global.copied_to_clipboard"),
    text: "",
  });

  // Handle adding as style depending on history type
  const handleAddStyle = (image: string) => {
    handleAddActionImage(image);
  };

  const handleAddActionImage = (image: string) => {
    setStyleOriginForm({
      ...styleOriginForm,
      image,
    });
    setUiState({
      ...uiState,
      activeTab: "style-change",
    });
  };

  const handleAddReferenceImage = (image: string) => {
    // Generate the new image ID first
    const newImageId = Date.now();

    // const images = [
    //   { id: newImageId, url: image, isUserUploaded: true },
    //   ...referenceState.referenceImages,
    // ];
    // setReferenceState({
    //   ...referenceState,
    //   referenceImages: images,
    // });
    addReferenceImage(image, newImageId);
    setStyleReferenceForm({
      ...styleReferenceForm,
      image,
    });

    setUiState({
      ...uiState,
      activeTab: "style-change",
    });

    setSwitchState({
      ...switchState,
      activeTab: "image-desc",
      activeImageId: newImageId,
    });
  };

  // 将当前记录的图片转换为GalleryModal需要的格式
  const currentGalleryItems = useMemo(() => {
    if (!selectedItem || !history) return [];

    const record = history.items.find(
      (h) => h.image.base64 === selectedItem.base64
    );

    if (!record) return [];

    // Create an array with at least the current item to avoid findIndex errors
    return [
      {
        id: selectedItem.id,
        url: selectedItem.url,
        base64: selectedItem.base64,
        title: selectedItem.title,
        desc: selectedItem.desc,
        tag: selectedItem.tag,
      },
    ];
  }, [selectedItem, history, t]);

  const handleImageClick = (
    record: HistoryType,
    image: HistoryType["image"]
  ) => {
    // Only allow clicking non-pending images
    if (image.status === "pending") return;

    const modelName = getModelById(image.model)?.name || image.model;
    setSelectedItem({
      id: `${record.id}-${record.image}`,
      url: "",
      base64: image.base64,
      title: modelName,
      desc: image.prompt,
    });
    setIsModalOpen(true);
  };

  if (!history) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  if (history.items.length === 0) {
    return (
      <div className="flex size-full items-center justify-center py-16">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-muted-foreground">
            {t("history.empty")}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="">
        <div className="rounded-lg text-card-foreground">
          <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {history.items.map((record) => (
              <div key={record.id} className="group relative rounded-lg">
                {/* 图片展示 */}
                <div className="grid w-full">
                  <div>
                    <div className="space-y-2 rounded-lg border bg-background">
                      <div
                        className={cn(
                          "group/image relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border bg-background transition-all",
                          record.image.status !== "pending" &&
                            "hover:scale-[1.02]"
                        )}
                        onClick={() => handleImageClick(record, record.image)}
                      >
                        {record.image.status === "pending" ? (
                          <div className="flex h-full w-full items-center justify-center bg-muted/10">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />

                            {/* Add dropdown menu with delete for pending images */}
                            <div
                              className="absolute right-2 top-2 z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => deleteHistory(record.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>{t("actions.delete")}</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ) : record.image.status === "failed" ? (
                          <div className="flex h-full w-full items-center justify-center bg-muted/10">
                            <AlertCircle className="h-12 w-12 text-destructive" />

                            {/* Add dropdown menu with delete for failed images */}
                            <div
                              className="absolute right-2 top-2 z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => deleteHistory(record.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>{t("actions.delete")}</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Image
                              src={record.image.base64}
                              alt={record.image.prompt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />

                            {/* Dropdown menu in top-right corner */}
                            <div
                              className="absolute right-2 top-2 z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {record.image.status === "success" && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        handleDownload(
                                          record.image.base64,
                                          `${record.image.prompt.slice(0, 10)}.png`
                                        );
                                      }}
                                    >
                                      <Download className="mr-2 h-4 w-4" />
                                      <span>{t("actions.download")}</span>
                                    </DropdownMenuItem>
                                  )}

                                  {record.image.status === "success" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleAddStyle(record.image.base64)
                                      }
                                    >
                                      <Feather className="mr-2 h-4 w-4" />
                                      <span>{t("actions.add_as_style")}</span>
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAddReferenceImage(
                                        record.image.base64
                                      )
                                    }
                                  >
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    <span>{t("actions.add_as_reference")}</span>
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => deleteHistory(record.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>{t("actions.delete")}</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Info button in bottom-right corner */}
                            {record.rawPrompt && (
                              <div
                                className="absolute bottom-2 right-2 z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <DropdownMenu
                                  onOpenChange={(open) =>
                                    !open && setShowFullPrompt(null)
                                  }
                                >
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
                                    >
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-[300px] p-0"
                                  >
                                    <div className="flex items-center justify-between px-3 py-2">
                                      <div className="font-medium">
                                        {t("global.prompt")}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 p-0"
                                        onClick={() =>
                                          handleCopy(record.rawPrompt)
                                        }
                                      >
                                        <CopyIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="max-h-[300px] overflow-auto p-3">
                                      <div className="text-sm">
                                        {record.rawPrompt.length && (
                                          <CollapsibleText
                                            text={record.rawPrompt}
                                            maxLength={200}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {history.totalPages > 1 && (
            <div className="border-t px-4 py-3 pb-20 @lg:pb-3">
              <Pagination>
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={cn(
                        page === 1 && "pointer-events-none opacity-50"
                      )}
                      aria-label={commonT("pagination.previous")}
                    >
                      <span>{commonT("pagination.previous")}</span>
                    </PaginationPrevious>
                  </PaginationItem>
                  {Array.from(
                    { length: history.totalPages },
                    (_, i) => i + 1
                  ).map((pageNumber) => {
                    // Show first page, current page, last page, and pages around current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === history.totalPages ||
                      (pageNumber >= page - 1 && pageNumber <= page + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setPage(pageNumber)}
                            isActive={page === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    // Show ellipsis for gaps
                    if (
                      pageNumber === 2 ||
                      pageNumber === history.totalPages - 1
                    ) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationEllipsis>
                            <span className="sr-only">
                              {commonT("pagination.more_pages")}
                            </span>
                          </PaginationEllipsis>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(history.totalPages, p + 1))
                      }
                      className={cn(
                        page === history.totalPages &&
                          "pointer-events-none opacity-50"
                      )}
                      aria-label={commonT("pagination.next")}
                    >
                      <span>{commonT("pagination.next")}</span>
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* 图片预览弹窗 */}
      {selectedItem && (
        <GalleryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedItem={selectedItem}
          setSelectedItem={(item) => setSelectedItem(item as GalleryItem)}
          mediaItems={currentGalleryItems}
          showDelete={false}
          onDownload={(item) => {
            if (item.base64) {
              handleDownload(item.base64, `${item.desc.slice(0, 10)}.png`);
            }
          }}
        />
      )}
    </div>
  );
}
