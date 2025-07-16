// hooks/usePendingSlots.ts
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { PendingSlot } from "@/utils/timeSlotUtils";
import { calculateEndTime } from "@/utils/timeSlotUtils";
import { useTranslation } from "react-i18next";

export function usePendingSlots() {
  const [pendingSlots, setPendingSlots] = useState<PendingSlot[]>([]);
  const { t } = useTranslation();

  // Add a new pending slot (with conflict and time‐validation)
  const addSlot = useCallback(
    (date: Date, startTime: string, endTimeOverride?: string) => {
      let endTime = endTimeOverride;
      if (!endTime) {
        const [startHourStr, startMinStr] = startTime.split(":");
        const startHour = parseInt(startHourStr, 10);
        const startMin = parseInt(startMinStr, 10);
        endTime = calculateEndTime(startHour, startMin);
      }
      if (!endTime) {
        toast.error(t("endTimeInvalidError"));
        return;
      }
      // Ensure start < end
      if (startTime >= endTime) {
        toast.error(t("endTimeError"));
        return;
      }
      // Check for conflicts among existing pending slots
      const conflict = pendingSlots.some((slot) => {
        return (
          slot.date.toDateString() === date.toDateString() &&
          !(endTime! <= slot.startTime || startTime >= slot.endTime)
        );
      });
      if (conflict) {
        toast.error(t("slotConflictError"));
        return;
      }
      const newSlot: PendingSlot = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        date,
        startTime,
        endTime,
      };
      setPendingSlots((prev) => [...prev, newSlot]);
    },
    [pendingSlots, t]
  );

  // Remove one pending slot by its ID
  const removeSlot = useCallback((id: string) => {
    setPendingSlots((prev) => prev.filter((slot) => slot.id !== id));
  }, []);

  // Clear all pending slots
  const clearSlots = useCallback(() => {
    setPendingSlots([]);
  }, []);

  return {
    pendingSlots,
    addSlot,
    removeSlot,
    clearSlots,
  };
}
