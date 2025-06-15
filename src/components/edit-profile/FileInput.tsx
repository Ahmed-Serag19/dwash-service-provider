import type React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatFileSize } from "@/utils/file-validation.utils";
import type { EditProfileFormData } from "@/interface/interfaces";

interface FileInputProps {
  name: keyof EditProfileFormData;
  label: string;
  control: any;
  accept: string;
}

export const FileInput: React.FC<FileInputProps> = ({
  name,
  label,
  control,
  accept,
}) => (
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
            onChange={(e) => {
              const files = e.target.files;
              if (files && files[0]) {
                console.log(
                  `Selected ${name}:`,
                  files[0].name,
                  files[0].size,
                  files[0].type
                );
              }
              onChange(files);
            }}
            accept={accept}
          />
          {value && value[0] && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {value[0].name} ({formatFileSize(value[0].size)} MB)
            </p>
          )}
        </div>
      )}
    />
  </div>
);
