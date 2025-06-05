// hooks/usePendingSlots.ts
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { PendingSlot } from "@/utils/timeSlotUtils";
import { calculateEndTime } from "@/utils/timeSlotUtils";

export function usePendingSlots() {
  const [pendingSlots, setPendingSlots] = useState<PendingSlot[]>([]);

  // Add a new pending slot (with conflict and time‐validation)
  const addSlot = useCallback(
    (date: Date, startTime: string) => {
      const [startHourStr, startMinStr] = startTime.split(":");
      const startHour = parseInt(startHourStr, 10);
      const startMin = parseInt(startMinStr, 10);
      const endTime = calculateEndTime(startHour, startMin);

      // Ensure start < end
      if (startTime >= endTime) {
        toast.error("End time must be after start time");
        return;
      }

      // Check for conflicts among existing pending slots
      const conflict = pendingSlots.some((slot) => {
        return (
          slot.date.toDateString() === date.toDateString() &&
          !(endTime <= slot.startTime || startTime >= slot.endTime)
        );
      });
      if (conflict) {
        toast.error("Conflict with existing pending slot");
        return;
      }

      const newSlot: PendingSlot = {
        id: Date.now().toString(),
        date,
        startTime,
        endTime,
      };
      setPendingSlots((prev) => [...prev, newSlot]);
    },
    [pendingSlots]
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
