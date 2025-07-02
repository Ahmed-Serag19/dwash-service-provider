import type React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import type { Slot } from "@/interface/interfaces";

interface SlotsByDateViewProps {
  selectedDate: Date;
  slots: Slot[];
  onBack: () => void;
  handleDeleteSlot: (slotId: number) => void;
  loading: boolean;
}

const SlotsByDateView: React.FC<SlotsByDateViewProps> = ({
  selectedDate,
  slots,
  onBack,
  handleDeleteSlot,
  loading,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
  const localeObj = i18n.language === "ar" ? ar : enUS;

  // Filter slots for the selected date
  const slotsForDate = slots.filter((slot) => {
    const slotDate = new Date(slot.date);
    return slotDate.toDateString() === selectedDate.toDateString();
  });

  // Format time from "HH:mm:ss" to localized 12-hour format
  const formatTimeToAMPM = (time24: string) => {
    const [hourStr, minuteStr] = time24.split(":");
    const hour = Number.parseInt(hourStr, 10);
    const minute = Number.parseInt(minuteStr, 10);
    const temp = new Date();
    temp.setHours(hour, minute, 0, 0);
    return temp.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-92">
        <p className="loader"></p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 bg-transparent"
        >
          <ArrowLeft size={16} />
          {t("backToCalendar")}
        </Button>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-950" />
          <h2 className="text-2xl font-bold text-blue-950">
            {format(selectedDate, "PPP", { locale: localeObj })}
          </h2>
        </div>
      </div>

      {/* Slots for the selected date */}
      {slotsForDate.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            {t("noSlotsFoundForThisDate")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slotsForDate.map((slot) => (
            <div
              key={slot.slotId}
              className="p-4 border rounded-lg border-blue-950 bg-slate-100"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  {formatTimeToAMPM(slot.timeFrom)} -{" "}
                  {formatTimeToAMPM(slot.timeTo)}
                </h3>

                {slot.reserved !== 0 ? (
                  <div className="space-y-1">
                    <p className="text-red-600 font-medium">
                      {t("slotReserved")}
                    </p>
                    <p>
                      <strong>{t("customerName")}:</strong>{" "}
                      {slot.username || t("notAvailable")}
                    </p>
                    <p>
                      <strong>{t("customerMobile")}:</strong>{" "}
                      {slot.mobile || t("notAvailable")}
                    </p>
                  </div>
                ) : (
                  <p className="text-green-600 font-semibold">
                    {t("slotAvailable")}
                  </p>
                )}
              </div>

              {slot.reserved === 0 && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSlot(slot.slotId)}
                    className="text-red-500 border-red-500 hover:bg-red-100"
                  >
                    {t("deleteSlot")}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">
              {slotsForDate.filter((slot) => slot.reserved === 0).length}
            </p>
            <p className="text-sm text-gray-600">{t("availableSlotsCount")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">
              {slotsForDate.filter((slot) => slot.reserved !== 0).length}
            </p>
            <p className="text-sm text-gray-600">{t("reservedSlotsCount")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotsByDateView;
