import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ExtraService {
  extraNameAr: string;
  extraNameEn: string;
  extraDescriptionsAr: string;
  extraDescriptionsEn: string;
  extraPrice: number | null;
}

interface ExtraServiceFormProps {
  extraServices: ExtraService[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const ExtraServiceForm: React.FC<ExtraServiceFormProps> = ({
  extraServices,
  onAdd,
  onRemove,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-7 rounded-md">
      {extraServices.map((extraService, index) => (
        <div
          key={index}
          className="relative border py-8 px-4 rounded-md min-h-96"
        >
          <button
            className="absolute top-2 right-2"
            onClick={() => onRemove(index)}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div className="flex flex-col gap-2">
              <Label className="text-md" htmlFor={`extraNameEn-${index}`}>
                {t("extraServiceNameEn")}
              </Label>
              <Input
                id={`extraNameEn-${index}`}
                name="extraNameEn"
                value={extraService.extraNameEn}
                onChange={(e) => onChange(index, e)}
                placeholder={t("extraServiceNameEnPlaceholder")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-md" htmlFor={`extraNameAr-${index}`}>
                {t("extraServiceNameAr")}
              </Label>
              <Input
                id={`extraNameAr-${index}`}
                name="extraNameAr"
                value={extraService.extraNameAr}
                onChange={(e) => onChange(index, e)}
                dir="rtl"
                placeholder={t("extraServiceNameArPlaceholder")}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="flex flex-col gap-2">
              <Label
                className="text-md"
                htmlFor={`extraDescriptionsEn-${index}`}
              >
                {t("extraServiceDescriptionEn")}
              </Label>
              <Textarea
                id={`extraDescriptionsEn-${index}`}
                name="extraDescriptionsEn"
                value={extraService.extraDescriptionsEn}
                onChange={(e) => onChange(index, e)}
                placeholder={t("extraServiceDescriptionEnPlaceholder")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label
                className="text-md"
                htmlFor={`extraDescriptionsAr-${index}`}
              >
                {t("extraServiceDescriptionAr")}
              </Label>
              <Textarea
                id={`extraDescriptionsAr-${index}`}
                name="extraDescriptionsAr"
                value={extraService.extraDescriptionsAr}
                onChange={(e) => onChange(index, e)}
                dir="rtl"
                placeholder={t("extraServiceDescriptionArPlaceholder")}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-6">
            <Label className="text-md" htmlFor={`extraPrice-${index}`}>
              {t("extraServicePrice")}
            </Label>
            <Input
              id={`extraPrice-${index}`}
              name="extraPrice"
              type="number"
              value={extraService.extraPrice || ""}
              onChange={(e) => onChange(index, e)}
              placeholder={t("extraServicePricePlaceholder")}
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        onClick={onAdd}
        className="mt-4 bg-green-600 text-white hover:bg-green-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        {t("addAnotherExtraService")}
      </Button>
    </div>
  );
};

export default ExtraServiceForm;
