import type React from "react"
import { CheckCircle2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { OrderSectionProps } from "./types"

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

function getStatusVariant(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800"
    case "CANCELLED_BY_ADMIN":
      return "bg-red-100 text-red-800"
    case "WAITING":
      return "bg-yellow-100 text-yellow-800"
    case "ACCEPTED":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const StatusSection: React.FC<OrderSectionProps> = ({ order, language }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-start space-x-4 gap-4">
      <div className="flex-shrink-0">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <CheckCircle2 className="h-6 w-6 text-indigo-600" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{t("status") || "Status"}</h4>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusVariant(
            order.request.statusName,
          )}`}
        >
          {language === "en" ? formatStatus(order.request.statusName) : order.request.statusName}
        </span>
      </div>
    </div>
  )
}
