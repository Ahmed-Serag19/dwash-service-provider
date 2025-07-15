import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Calendar, Grid } from "lucide-react";
import type { Slot } from "@/interface/interfaces";
import SlotCalendarViewer from "@/components/time-slots/SlotCalendarViewer";
import SlotsByDateView from "@/components/time-slots/SlotsByDateView";

interface UserSlotsProps {
  slots: Slot[];
  handleDeleteSlot: (slotId: number) => void;
  loading: boolean;
}

type ViewMode = "all" | "by-date" | "date-selected";

const UserSlots: React.FC<UserSlotsProps> = ({
  slots,
  handleDeleteSlot,
  loading,
}) => {
  const { t, i18n } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Choose locale based on current language
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";

  // Format a date string in the correct locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format "HH:mm:ss" into a localized 12-hour clock string
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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode("date-selected");
  };

  const handleBackToCalendar = () => {
    setViewMode("by-date");
    setSelectedDate(undefined);
  };

  const handleBackToAll = () => {
    setViewMode("all");
    setSelectedDate(undefined);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-92">
        <p className="loader"></p>
      </div>
    );
  }

  if (slots.length === 0) {
    return <p>{t("noTimeSlotsAvailable")}</p>;
  }

  // Render date-specific view
  if (viewMode === "date-selected" && selectedDate) {
    return (
      <SlotsByDateView
        selectedDate={selectedDate}
        slots={slots}
        onBack={handleBackToCalendar}
        handleDeleteSlot={handleDeleteSlot}
        loading={loading}
      />
    );
  }

  // Render date picker view
  if (viewMode === "by-date") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-blue-950">
            {t("viewSlotsByDate")}
          </h2>
          <Button
            variant="outline"
            onClick={handleBackToAll}
            className="flex items-center gap-2 bg-transparent"
          >
            <Grid size={16} />
            {t("viewAllSlots")}
          </Button>
        </div>

        <div className="max-w-md">
          <SlotCalendarViewer
            date={selectedDate}
            slots={slots}
            onDateClick={handleDateClick}
          />
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">{t("clickDateToViewSlots")}</p>
        </div>
      </div>
    );
  }

  // Render all slots view (default)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-950">
          {t("availableTimeSlots")}
        </h2>
        <Button
          variant="outline"
          onClick={() => setViewMode("by-date")}
          className="flex items-center gap-2"
        >
          <Calendar size={16} />
          {t("viewByDate")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {slots.map((slot) => (
          <div
            key={slot.slotId}
            className="p-4 border rounded-lg border-blue-950 bg-slate-100"
          >
            <div className="flex justify-between gap-4 flex-col mb-4">
              <h3 className="text-md font-semibold">
                {t("date")}: <span>{formatDate(slot.date)}</span>
              </h3>
              <h2 className="text-md font-semibold">
                {t("time")}:{" "}
                <div className="flex gap-3">
                  <span>
                    {t("from")} {formatTimeToAMPM(slot.timeFrom)}
                  </span>
                  {/* <span> */}
                  {/* {t("to")} {formatTimeToAMPM(slot.timeTo)} */}
                  {/* </span> */}
                </div>
              </h2>
            </div>

            {slot.reserved !== 0 ? (
              <div>
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
              <p className="text-green-800 font-semibold text-lg">
                {t("slotAvailable")}
              </p>
            )}

            {slot.reserved === 0 && (
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => handleDeleteSlot(slot.slotId)}
                  className="text-red-500 border-red-500 hover:bg-red-100 text-lg"
                >
                  {t("deleteSlot")}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSlots;
