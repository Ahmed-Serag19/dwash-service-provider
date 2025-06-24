import type React from "react"
import { useTranslation } from "react-i18next"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface OrderHeaderProps {
  orderId: number
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ orderId }) => {
  const { t } = useTranslation()

  return (
    <DialogHeader className="px-6 py-4 border-b">
      <DialogTitle className="text-xl font-semibold">{t("orderDetails") || "Order Details"}</DialogTitle>
      <p className="text-sm text-gray-500 mt-1">
        {t("orderNumber")}: <span>{orderId}</span>
      </p>
    </DialogHeader>
  )
}
