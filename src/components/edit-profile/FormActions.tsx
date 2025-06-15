import type React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end space-x-4 gap-5">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {t("cancel")}
      </Button>
      <Button
        disabled={isSubmitting}
        type="submit"
        className={isSubmitting ? "cursor-not-allowed" : ""}
      >
        {isSubmitting ? t("loading") || "Saving..." : t("save")}
      </Button>
    </div>
  );
};
