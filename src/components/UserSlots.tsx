import React from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Slot } from "@/interface/interfaces";

interface UserSlotsProps {
  slots: Slot[];
  handleDeleteSlot: (slotId: number) => void;
  loading: boolean;
}

const UserSlots: React.FC<UserSlotsProps> = ({
  slots,
  handleDeleteSlot,
  loading,
}: UserSlotsProps) => {
  const { t, i18n } = useTranslation();

  // Choose locale based on current language
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";

  // Format a date string in the correct locale, with long month, day, year
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format "HH:mm" into a localized 12-hour clock string
  const formatTimeToAMPM = (time24: string) => {
    const [hourStr, minuteStr] = time24.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    // Create a Date object for today at that hour/minute
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

  if (slots.length === 0) {
    return <p>{t("noTimeSlotsAvailable")}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-950">
        {t("availableTimeSlots")}
      </h2>
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
                  <span>
                    {t("to")} {formatTimeToAMPM(slot.timeTo)}
                  </span>
                </div>
              </h2>
            </div>

            {slot.reserved ? (
              <div>
                <p>
                  <strong>{t("user")}:</strong> {slot.username || t("unknown")}
                </p>
                <p>
                  <strong>{t("mobile")}:</strong> {slot.mobile || t("unknown")}
                </p>
              </div>
            ) : (
              <p className="text-green-800 font-semibold text-lg">
                {t("Available")}
              </p>
            )}

            {!slot.reserved && (
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => handleDeleteSlot(slot.slotId)}
                  className="text-red-500 border-red-500 hover:bg-red-100 text-lg"
                >
                  {t("delete")}
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
