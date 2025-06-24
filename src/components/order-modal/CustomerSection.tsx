import type React from "react";
import { User, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { OrderSectionProps } from "@/interface/interfaces";

export const CustomerSection: React.FC<OrderSectionProps> = ({
  order,
  language,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start space-x-4 gap-3">
      <div className="flex-shrink-0">
        <div className="p-3 bg-purple-50 rounded-lg">
          <User className="h-6 w-6 text-purple-600" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">
          {t("customer") || "Customer"}
        </h4>
        <p className="text-lg font-medium mt-1">
          {language === "en" ? order.userNameEn : order.userNameAr}
        </p>
        <div
          dir="ltr"
          className="flex items-center justify-end gap-1 mt-2 text-gray-600"
        >
          <Phone className="h-4 w-4 mr-2" />
          <span>{order.userPhoneNumber}</span>
        </div>
      </div>
    </div>
  );
};
