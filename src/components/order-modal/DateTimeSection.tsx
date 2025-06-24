import type React from "react";
import { Clock3, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import type { OrderSectionProps } from "@/interface/interfaces";

export const DateTimeSection: React.FC<OrderSectionProps> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start space-x-4 gap-3">
      <div className="flex-shrink-0">
        <div className="p-3 bg-green-50 rounded-lg">
          <Clock3 className="h-6 w-6 text-green-600" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">
          {t("dateTime") || "Date & Time"}
        </h4>
        <div className="mt-2 space-y-2">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {format(new Date(order.reservationDate), "MMMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              {order.fromTime} - {order.timeTo}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
