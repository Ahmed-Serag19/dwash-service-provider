import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

interface OrderCardProps {
  order: {
    request: { id: number; statusName: string };
    itemDto: { itemNameEn: string; itemNameAr: string };
    latitude: string;
    longitude: string;
    reservationDate: string;
    userNameEn: string;
    userNameAr: string;
    userPhoneNumber: string;
    totalAmount: number;
  };
  onStatusChange: (action: string) => void;
  language: "en" | "ar";
}

export function OrderCard({ order, onStatusChange, language }: OrderCardProps) {
  const { t } = useTranslation();

  const openLocation = () => {
    const lat = order.latitude.replace(/\\|"/g, "");
    const lng = order.longitude.replace(/\\|"/g, "");
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <Card className="w-full mb-4">
      <CardContent className="p-6">
        <div className="space-y-2 text-blue-950">
          <h3 className="text-xl font-semibold">
            {language === "en"
              ? order.itemDto.itemNameEn
              : order.itemDto.itemNameAr}
          </h3>
          <p>
            {t("orderId")}: {order.request.id}
          </p>
          <p>
            {t("date")}: {order.reservationDate}
          </p>
          <p>
            {t("customer")}:{" "}
            {language === "en" ? order.userNameEn : order.userNameAr}
          </p>
          <p>
            {t("phone")}: {order.userPhoneNumber}
          </p>
          <p className="font-semibold">
            {t("total")}: {order.totalAmount} {t("currency")}
          </p>
          <div
            className="flex items-center gap-2 cursor-pointer text-blue-600"
            onClick={openLocation}
          >
            <MapPin className="h-4 w-4" />
            <span>{t("viewLocation")}</span>
          </div>
        </div>

        <Select
          value={order.request.statusName}
          onValueChange={(value) => onStatusChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACCEPTED">{t("accepted")}</SelectItem>
            <SelectItem value="UNDER_PROCESSING">{t("inProgress")}</SelectItem>
            <SelectItem value="COMPLETED">{t("completed")}</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
