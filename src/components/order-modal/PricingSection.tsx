import type React from "react"
import { CreditCard } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { OrderSectionProps } from "./types"

export const PricingSection: React.FC<OrderSectionProps> = ({ order, language }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-start space-x-4 gap-3">
      <div className="flex-shrink-0">
        <div className="p-3 bg-yellow-50 rounded-lg">
          <CreditCard className="h-6 w-6 text-yellow-600" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{t("pricing") || "Pricing"}</h4>
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>{t("servicePrice") || "Service Price"}</span>
            <span>{order.itemDto.itemPrice} SAR</span>
          </div>
          {order.itemDto.itemExtraDtos && order.itemDto.itemExtraDtos.length > 0 && (
            <>
              <div className="h-px bg-gray-200 my-2" />
              <p className="font-medium text-gray-900">{t("extraServices") || "Extra Services"}:</p>
              {order.itemDto.itemExtraDtos.map((extra, index) => (
                <div key={index} className="flex justify-between text-gray-600 pl-4">
                  <span>{language === "en" ? extra.itemExtraNameEn : extra.itemExtraNameAr}</span>
                  <span>{extra.itemExtraPrice} SAR</span>
                </div>
              ))}
            </>
          )}
          <div className="h-px bg-gray-200 my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <span>{t("totalAmount") || "Total Amount"}</span>
            <span>{order.totalAmount} SAR</span>
          </div>
        </div>
      </div>
    </div>
  )
}
