import type React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type {
  EditProfileFormData,
  ValidationRule,
} from "@/interface/interfaces";

interface FormFieldProps {
  name: keyof EditProfileFormData;
  label: string;
  control: any;
  errors: any;
  rules?: ValidationRule;
  textarea?: boolean;
  type?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  control,
  errors,
  rules,
  textarea = false,
  type = "text",
}) => (
  <div className="space-y-2">
    <Label className="text-lg" htmlFor={name}>
      {label}
    </Label>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) =>
        textarea ? (
          <Textarea
            {...field}
            id={name}
            className={error ? "border-red-500" : ""}
          />
        ) : (
          <Input
            {...field}
            id={name}
            type={type}
            className={error ? "border-red-500" : ""}
          />
        )
      }
    />
    {errors[name] && (
      <p className="text-red-500 text-sm">{errors[name].message}</p>
    )}
  </div>
);
