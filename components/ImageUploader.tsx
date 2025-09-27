"use client";

import { useState, useRef, useCallback } from "react";

interface ImageUploaderProps {
  onUploaded: (url: string) => void;
  initialImage?: string;
}

export default function ImageUploader({
  onUploaded,
  initialImage,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(
    initialImage ?? null
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("শুধুমাত্র ইমেজ ফাইল আপলোড করুন");
        return;
      }

      setUploading(true);
      setError("");

      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "আপলোড ব্যর্থ হয়েছে");
        }

        const data = await res.json();
        onUploaded(data.fileUrl);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "আপলোড ব্যর্থ হয়েছে";
        setError(message);
        setPreviewUrl(initialImage ?? null);
      } finally {
        setUploading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [onUploaded, initialImage]
  );

  const onSelect = (e: any) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onUploaded("");
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onSelect}
          className="hidden"
        />

        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative mx-auto w-full max-w-md">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-md object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-500">
              ইমেজ পরিবর্তন করতে ক্লিক করুন বা নতুন ইমেজ ড্র্যাগ করুন
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 
                     012.828 0L16 16m-2-2l1.586-1.586a2 
                     2 0 012.828 0L20 14m-6-6h.01M6 
                     20h12a2 2 0 002-2V6a2 2 0 
                     00-2-2H6a2 2 0 00-2 2v12a2 2 
                     0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">ক্লিক করুন</span> বা{" "}
              <span className="font-medium text-blue-600">ড্র্যাগ করুন</span>{" "}
              ইমেজ আপলোড করতে
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF সর্বোচ্চ 5MB</p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="text-center py-2">
          <span className="text-blue-600">আপলোড হচ্ছে...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-2">
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}
