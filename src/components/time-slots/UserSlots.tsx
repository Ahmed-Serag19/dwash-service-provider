import type React from "react";
import { useState, useEffect } from "react";
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
  // Tab state for filtering
  const [slotTab, setSlotTab] = useState<"available" | "booked">("available");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const slotsPerPage = 8;

  // Reset page when tab changes or slots change
  useEffect(() => {
    setCurrentPage(1);
  }, [slotTab, slots]);

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
  const formatHourOnly = (time24: string) => {
    const [hourStr] = time24.split(":");
    return `${hourStr.padStart(2, "0")}:00`;
  };

  // Format slot time to localized 12-hour format, always showing hour:00
  const formatHourLocalized = (time24: string) => {
    const [hourStr] = time24.split(":");
    const hour = Number(hourStr);
    const temp = new Date();
    temp.setHours(hour, 0, 0, 0);
    return temp.toLocaleTimeString(locale, {
      hour: "numeric",
      minute: "2-digit",
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

  // Group slots for all view
  const bookedSlots = slots.filter((slot) => slot.reserved !== 0);
  const availableSlots = slots.filter((slot) => slot.reserved === 0);

  // Paginated slots
  const paginatedAvailable = availableSlots.slice(
    (currentPage - 1) * slotsPerPage,
    currentPage * slotsPerPage
  );
  const paginatedBooked = bookedSlots.slice(
    (currentPage - 1) * slotsPerPage,
    currentPage * slotsPerPage
  );
  const totalPages =
    slotTab === "available"
      ? Math.ceil(availableSlots.length / slotsPerPage)
      : Math.ceil(bookedSlots.length / slotsPerPage);

  // Helper for localized page number
  const formatPageNumber = (num: number) =>
    i18n.language === "ar" ? num.toLocaleString("ar-EG") : num;

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

      {/* Tabs for Available/Booked */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={slotTab === "available" ? "default" : "outline"}
          onClick={() => setSlotTab("available")}
        >
          {t("availableTab")}
        </Button>
        <Button
          variant={slotTab === "booked" ? "default" : "outline"}
          onClick={() => setSlotTab("booked")}
        >
          {t("bookedTab")}
        </Button>
      </div>

      {/* Show slots based on tab */}
      {slotTab === "available" ? (
        availableSlots.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paginatedAvailable.map((slot) => (
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
                          {t("from")} {formatHourLocalized(slot.timeFrom)}
                        </span>
                      </div>
                    </h2>
                  </div>
                  <p className="text-green-800 font-semibold text-lg">
                    {t("slotAvailable")}
                  </p>
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
                </div>
              ))}
            </div>
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  {t("previous")}
                </Button>
                <span className="self-center">
                  {formatPageNumber(currentPage)} /{" "}
                  {formatPageNumber(totalPages)}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  {t("next")}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            {t("noTimeSlotsAvailable")}
          </p>
        )
      ) : bookedSlots.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginatedBooked.map((slot) => (
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
                        {t("from")} {formatHourLocalized(slot.timeFrom)}
                      </span>
                    </div>
                  </h2>
                </div>
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
              </div>
            ))}
          </div>
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                {t("previous")}
              </Button>
              <span className="self-center">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                {t("next")}
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          {t("noTimeSlotsAvailable")}
        </p>
      )}
    </div>
  );
};

export default UserSlots;
