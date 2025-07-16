// components/PendingSlotsList.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format } from "date-fns";
import { PendingSlot } from "@/utils/timeSlotUtils";
import { t } from "i18next";

interface PendingSlotsListProps {
  pendingSlots: PendingSlot[];
  onRemove: (id: string) => void;
  formatTimeDisplay: (time: string) => string;
}

const PendingSlotsList: React.FC<PendingSlotsListProps> = ({
  pendingSlots,
  onRemove,
  formatTimeDisplay,
}) => {
  if (pendingSlots.length === 0) {
    return null;
  }

  function formatHourLocalized(time24: string) {
    const [hourStr] = time24.split(":");
    const hour = Number(hourStr);
    const temp = new Date();
    temp.setHours(hour, 0, 0, 0);
    return temp.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="mb-6">
      <h3 className="text-md font-medium mb-2">{t("pendingSlots")}</h3>
      <div className="max-h-40 overflow-y-auto border rounded-md p-2">
        {pendingSlots.map((slot) => (
          <div
            key={slot.id}
            className="flex justify-between items-center py-2 border-b last:border-b-0"
          >
            <div>
              <span className="font-medium">
                {format(slot.date, "yyyy-MM-dd")}
              </span>
              <span className="mx-2">|</span>
              <span>
                {formatHourLocalized(slot.startTime)} -{" "}
                {formatHourLocalized(slot.endTime)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(slot.id)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingSlotsList;
