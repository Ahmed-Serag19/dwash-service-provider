"use client";

import type React from "react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOptimizedFileUpload } from "@/hooks/useOptimizedFileUpload";
import type { EditProfileFormData } from "@/interface/interfaces";

interface OptimizedFileInputProps {
  name: keyof EditProfileFormData;
  label: string;
  control: any;
  accept: string;
}

export const OptimizedFileInput: React.FC<OptimizedFileInputProps> = ({
  name,
  label,
  control,
  accept,
}) => {
  const [processing, setProcessing] = useState(false);
  const { validateAndCompress } = useOptimizedFileUpload();

  return (
    <div className="space-y-2">
      <Label className="text-lg" htmlFor={name}>
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <div>
            <Input
              {...field}
              id={name}
              type="file"
              onChange={async (e) => {
                const files = e.target.files;
                if (files && files[0]) {
                  setProcessing(true);
                  try {
                    const optimizedFile = await validateAndCompress(files[0]);
                    const fileList = new DataTransfer();
                    fileList.items.add(optimizedFile);
                    onChange(fileList.files);
                  } catch (error) {
                    console.error("File processing error:", error);
                    onChange(files); // Fallback to original file
                  }
                  setProcessing(false);
                }
              }}
              accept={accept}
              disabled={processing}
            />
            {processing && (
              <p className="text-sm text-blue-600 mt-1">Processing image...</p>
            )}
            {value && value[0] && (
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-600">
                  Selected: {value[0].name} ({(value[0].size / 1024).toFixed(2)}{" "}
                  KB)
                </p>
                {value[0].size > 500 * 1024 && (
                  <p className="text-sm text-orange-600">
                    ⚠️ File is large, consider compressing
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};
