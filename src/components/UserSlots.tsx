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

  // Function to convert 24-hour time to 12-hour AM/PM format
  const formatTimeToAMPM = (time24: string) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour12}:${minutes} ${period}`;
  };

  // Function to format date based on current language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
            className={`p-4 border rounded-lg border-blue-950 bg-slate-100`}
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
