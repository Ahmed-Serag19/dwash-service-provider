import type React from "react";
import { MapPinned, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { OrderSectionProps } from "@/interface/interfaces";

export const LocationSection: React.FC<OrderSectionProps> = ({ order }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start space-x-4 gap-3">
      <div className="flex-shrink-0">
        <div className="p-3 bg-red-50 rounded-lg">
          <MapPinned className="h-6 w-6 text-red-600" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">
          {t("location") || "Location"}
        </h4>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${order.userAddressDto?.latitude},${order.userAddressDto?.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <MapPin className="h-4 w-4 mr-2" />
          <span className="underline">{t("viewOnMap") || "View on Map"}</span>
        </a>
      </div>
    </div>
  );
};
