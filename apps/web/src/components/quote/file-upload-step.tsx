"use client";

import { useState, useEffect } from "react";
import { Upload, File, X } from "lucide-react";

interface FileUploadStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onRemoveFile: (index: number) => void;
}

export function FileUploadStep({
  formData,
  updateFormData,
  fileInputRef,
  onRemoveFile,
}: FileUploadStepProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Prevent default drag behavior on the entire page
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Add listeners to prevent page navigation on accidental drops
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      document.body.addEventListener(eventName, preventDefaults);
    });

    // Cleanup
    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        document.body.removeEventListener(eventName, preventDefaults);
      });
    };
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Required to allow dropping
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone itself
    // not a child element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    // Validate PDF files only
    const invalidFiles = files.filter(
      (file) =>
        !file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf"),
    );
    if (invalidFiles.length > 0) {
      alert(
        `Please upload PDF files only. Invalid files: ${invalidFiles.map((f) => f.name).join(", ")}`,
      );
      return;
    }

    if (files.length > 0 && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      // Add existing files
      formData.files.forEach((file: File) => dataTransfer.items.add(file));
      // Add new files
      files.forEach((file) => dataTransfer.items.add(file));

      fileInputRef.current.files = dataTransfer.files;
      updateFormData({ files: [...formData.files, ...files] });
    }
  };

  return (
    <div
      className={`space-y-6 transition-all duration-600 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Your Files
        </h2>
        <p className="text-gray-600">
          Upload your design files, artwork, or reference materials.
        </p>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer ${
          isDragging
            ? "border-magenta-600 bg-magenta-100 scale-105"
            : "border-gray-300 hover:border-magenta-500 hover:bg-magenta-50"
        }`}
      >
        <Upload
          className={`w-12 h-12 mx-auto mb-4 ${isDragging ? "text-magenta-600 scale-110" : "text-gray-400"} transition-all duration-200`}
        />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isDragging ? "Drop files here" : "Click to upload files"}
        </h3>
        <p className="text-gray-500 mb-4">or drag and drop your files here</p>
        <p className="text-sm text-gray-400">
          Supported format: PDF only (Max 50MB per file)
        </p>
      </div>

      {/* Uploaded Files */}
      {formData.files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">
            Uploaded Files ({formData.files.length})
          </h3>
          <div className="space-y-2">
            {formData.files.map((file: File, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Requirements */}
      <div className="bg-magenta-50 p-4 rounded-lg">
        <h4 className="font-medium text-magenta-900 mb-2">
          File Requirements & Tips:
        </h4>
        <ul className="text-sm text-magenta-800 space-y-1">
          <li>• High-resolution files (300 DPI) for best print quality</li>
          <li>
            • Include bleed area (0.125&quot; minimum) for products requiring
            cutting
          </li>
          <li>• Convert text to outlines/curves to avoid font issues</li>
          <li>• Use CMYK color mode for accurate color reproduction</li>
          <li>
            • Don&apos;t have files ready? No problem! We can help with design.
          </li>
        </ul>
      </div>

      {/* No Files Option */}
      <div className="border border-gray-200 rounded-lg p-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="needsDesignAssistance"
            checked={!!formData.needsDesignAssistance}
            onChange={(e) =>
              updateFormData({ needsDesignAssistance: e.target.checked })
            }
            className="w-4 h-4 text-magenta-600 border-gray-300 rounded focus:ring-magenta-500"
          />
          <span className="text-sm text-gray-700">
            I don&apos;t have files ready yet and would like design assistance
          </span>
        </label>
      </div>
    </div>
  );
}
