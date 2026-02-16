"use client";

import { motion } from "framer-motion";
import { Upload, File, X } from "lucide-react";

interface FileUploadStepProps {
  formData: any;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onRemoveFile: (index: number) => void;
}

export function FileUploadStep({
  formData,
  fileInputRef,
  onRemoveFile,
}: FileUploadStepProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
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
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-magenta-500 hover:bg-magenta-50 transition-colors duration-200 cursor-pointer"
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Click to upload files
        </h3>
        <p className="text-gray-500 mb-4">or drag and drop your files here</p>
        <p className="text-sm text-gray-400">
          Supported formats: PDF, AI, EPS, JPG, PNG, PSD (Max 50MB per file)
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
    </motion.div>
  );
}
