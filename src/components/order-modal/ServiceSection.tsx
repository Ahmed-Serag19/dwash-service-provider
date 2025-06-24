import type React from "react"
import { Package } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { OrderSectionProps } from "./types"

export const ServiceSection: React.FC<OrderSectionProps> = ({ order, language }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-start space-x-4 gap-3">
      <div className="flex-shrink-0">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Package className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{t("service") || "Service"}</h4>
        <p className="text-lg font-medium mt-1">
          {language === "en" ? order.itemDto.itemNameEn : order.itemDto.itemNameAr}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {language === "en" ? order.itemDto.serviceTypeEn : order.itemDto.serviceTypeAr}
        </p>
      </div>
    </div>
  )
}
