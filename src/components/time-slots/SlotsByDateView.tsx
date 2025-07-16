import type React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import type { Slot } from "@/interface/interfaces";
import { useState, useEffect } from "react";

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

  // Tab state for filtering
  const [slotTab, setSlotTab] = useState<"available" | "booked">("available");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const slotsPerPage = 6;
  useEffect(() => {
    setCurrentPage(1);
  }, [slotTab, selectedDate]);

  // Group slots
  const bookedSlots = slotsForDate.filter((slot) => slot.reserved !== 0);
  const availableSlots = slotsForDate.filter((slot) => slot.reserved === 0);
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

  // Ensure currentPage is always valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  // Helper for localized page number
  const formatPageNumber = (num: number) =>
    i18n.language === "ar" ? num.toLocaleString("ar-EG") : num;

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

  // Helper to format date as Arabic numerals for day, Arabic month/year
  const getArabicDateString = (date: Date) => {
    const day = date.getDate().toLocaleString("ar-EG");
    const monthYear = date.toLocaleDateString("ar-EG", {
      month: "long",
      year: "numeric",
    });
    return `${day} ${monthYear}`;
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
            {i18n.language === "ar"
              ? getArabicDateString(selectedDate)
              : format(selectedDate, "PPP", { locale: localeObj })}
          </h2>
        </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedAvailable.map((slot) => (
                <div
                  key={slot.slotId}
                  className="p-4 border rounded-lg border-blue-950 bg-slate-100"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {formatHourLocalized(slot.timeFrom)}
                    </h3>
                    <p className="text-green-600 font-semibold">
                      {t("slotAvailable")}
                    </p>
                  </div>
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
            {t("noSlotsFoundForThisDate")}
          </p>
        )
      ) : bookedSlots.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedBooked.map((slot) => (
              <div
                key={slot.slotId}
                className="p-4 border rounded-lg border-blue-950 bg-slate-100"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {formatHourLocalized(slot.timeFrom)}
                  </h3>
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
                {formatPageNumber(currentPage)} / {formatPageNumber(totalPages)}
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
          {t("noSlotsFoundForThisDate")}
        </p>
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
