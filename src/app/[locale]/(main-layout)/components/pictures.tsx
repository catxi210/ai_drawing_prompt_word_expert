"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CopyIcon, Download, Feather } from "lucide-react";
import Image from "next/image";
import { GalleryModal } from "@/components/ui/gallery/gallery-modal";
import { useState, useMemo } from "react";
import type { MediaItemType } from "@/components/ui/gallery/gallery";
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
import { useAtom } from "jotai";
import { styleFormAtom } from "@/stores/slices/style_form_store";

import CollapsibleText from "./collapsible-text";
import { usePictures } from "@/hooks/db/use-pictures";

interface PictureItem {
  url: string;
  prompt: string;
}

export default function Pictures() {
  const t = useTranslations();
  const commonT = useTranslations("common");
  const [page, setPage] = useState(1);
  const { items, total, totalPages, currentPage } = usePictures(page);
  const [selectedItem, setSelectedItem] = useState<PictureItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleDownload } = useMonitorMessage();
  const { handleCopy } = useCopyToClipboard({
    text: "",
  });
  const [styleForm, setStyleForm] = useAtom(styleFormAtom);

  const currentGalleryItems = useMemo(() => {
    if (!selectedItem || !items) return [];

    const picture = items.find((item) => item.url === selectedItem.url);

    if (!picture) return [];

    return [
      {
        id: selectedItem.url,
        url: selectedItem.url,
        title: "",
        desc: selectedItem.prompt,
      },
    ];
  }, [selectedItem, items]);

  const handleImageClick = (item: PictureItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleOpen = (image: string) => {
    setStyleForm({
      ...styleForm,
      open: true,
      image,
    });
  };

  if (!items) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="">
        <div className="rounded-lg text-card-foreground">
          <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {items.map((item) => (
              <div key={item.url} className="group relative rounded-lg">
                <div className="grid w-full">
                  <div>
                    <div className="space-y-2 rounded-lg border bg-background">
                      <div
                        className={cn(
                          "group/image relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border bg-background transition-all",
                          "hover:scale-[1.02]"
                        )}
                        onClick={() => handleImageClick(item)}
                      >
                        <Image
                          src={item.url}
                          alt={item.prompt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div>
                        <CollapsibleText text={item.prompt} maxLength={100} />
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 p-0"
                          onClick={() => handleOpen(item.url)}
                        >
                          <Feather className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 p-0"
                          onClick={() => handleCopy(item.prompt)}
                        >
                          <CopyIcon className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            handleDownload(
                              item.url,
                              `${item.prompt.slice(0, 10)}.png`
                            );
                          }}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="@lg:pb-3 border-t px-4 py-3 pb-20">
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => {
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
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
                      if (pageNumber === 2 || pageNumber === totalPages - 1) {
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
                    }
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={cn(
                        page === totalPages && "pointer-events-none opacity-50"
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

      {/* Image Preview Modal */}
      {selectedItem && (
        <GalleryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedItem={{
            id: selectedItem.url,
            url: selectedItem.url,
            title: "",
            desc: selectedItem.prompt,
          }}
          setSelectedItem={() => {}}
          mediaItems={currentGalleryItems}
          showDelete={false}
          onDownload={(item: any) => {
            handleDownload(item.url, `${item.desc.slice(0, 10)}.png`);
          }}
        />
      )}
    </div>
  );
}
