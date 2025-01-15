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
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-92">
        <p className="loader "></p>
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
            className={`p-4 border rounded-lg border-blue-950 bg-blue-50`}
          >
            <div className="flex justify-between gap-4 flex-col mb-4">
              <h3 className="text-md font-semibold">
                {t("date")}: <span>{slot.date}</span>
              </h3>
              <h2 className="text-md font-semibold">
                {t("time")}:{" "}
                <span>
                  ({slot.timeFrom.slice(0, 5)} - {slot.timeTo.slice(0, 5)})
                </span>
              </h2>
            </div>

            {slot.reserved ? (
              <div>
                <p>
                  <strong>User:</strong> {slot.username || "Unknown"}
                </p>
                <p>
                  <strong>Mobile:</strong> {slot.mobile || "Unknown"}
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
