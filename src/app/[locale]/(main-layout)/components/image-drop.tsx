"use client";
import { imageGenFormAtom } from "@/stores/slices/image_form_store";
import { useAtom } from "jotai";
import { ArrowDownUp, Loader2, UploadIcon, XCircleIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslations } from "next-intl";
import ky from "ky";
import { env } from "@/env";

function ImageDrop() {
  const t = useTranslations();
  const [imageGenForm, setImageGenForm] = useAtom(imageGenFormAtom);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      try {
        setIsUploading(true);
        const file = acceptedFiles[0];

        // Create preview immediately for better UX
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            setPreviewUrl(result);
          }
        };
        reader.readAsDataURL(file);

        // Create form data for the API
        const formData = new FormData();
        formData.append("file", file);

        // Upload the image
        const response = await ky
          .post(`${env.NEXT_PUBLIC_AUTH_API_URL}/gpt/api/upload/gpt/image`, {
            body: formData,
          })
          .json<{
            code: number;
            msg: string;
            data: {
              url: string;
            };
          }>();

        if (response.code === 0) {
          setImageGenForm({
            ...imageGenForm,
            image: response.data.url,
          });
        } else {
          console.error("Upload failed:", response.msg);
          setPreviewUrl("");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setPreviewUrl("");
      } finally {
        setIsUploading(false);
      }
    },
    [imageGenForm, setImageGenForm]
  );

  const handleDeleteImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent triggering the dropzone click event
    setImageGenForm({
      ...imageGenForm,
      image: "",
      prompt: "",
    });
    setPreviewUrl("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    multiple: false,
  });

  // Determine which image URL to display
  const displayImage = previewUrl || imageGenForm.image;

  return (
    <div className="flex h-full w-full flex-col">
      {displayImage && (
        <div className="mb-2 flex justify-end gap-1">
          <button className="rounded-md bg-white p-1 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
            <ArrowDownUp
              size={16}
              className="text-gray-600 dark:text-gray-400"
            />
          </button>
          <button
            onClick={handleDeleteImage}
            className="rounded-md bg-white p-1 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
            title={t("actions.delete_image") || "Delete image"}
          >
            <XCircleIcon
              size={16}
              className="text-gray-600 dark:text-gray-400"
            />
          </button>
        </div>
      )}
      <div
        {...getRootProps()}
        className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-solid border-gray-300 bg-white text-center dark:bg-gray-900"
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : displayImage ? (
          <div className="relative h-full w-full">
            <img
              src={displayImage}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4">
            <div className="mb-1">
              <UploadIcon size={40} className="text-gray-400" />
            </div>
            <p className="mb-2 text-sm font-medium">{t("file.drop_file")}</p>
            <p className="mb-1 text-xs font-medium">{t("file.or")}</p>
            <p className="mb-1 text-xs font-medium">{t("file.upload_file")}</p>
            <p className="text-xs text-gray-400">{t("file.support")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageDrop;
