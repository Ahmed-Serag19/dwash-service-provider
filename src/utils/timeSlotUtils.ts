// utils/timeSlotUtils.ts
import { format, addMinutes } from "date-fns";

export interface PendingSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
}

// Calculate end time (45 minutes after start time)
export const calculateEndTime = (hour: number, minute: number): string => {
  const tempDate = new Date();
  tempDate.setHours(hour, minute);
  const endDate = addMinutes(tempDate, 45);
  return `${endDate.getHours().toString().padStart(2, "0")}:${endDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

// Format time for display (convert to 12-hour format with AM/PM)
export const formatTimeDisplay = (time: string): string => {
  if (!time) return "";
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minuteStr} ${period}`;
};

// Check for time slot conflicts
export const hasTimeSlotConflict = (
  pendingSlots: PendingSlot[],
  date: Date,
  startTime: string,
  endTime: string
): boolean => {
  return pendingSlots.some((slot) => {
    return (
      format(slot.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") &&
      ((startTime >= slot.startTime && startTime < slot.endTime) ||
        (endTime > slot.startTime && endTime <= slot.endTime) ||
        (startTime <= slot.startTime && endTime >= slot.endTime))
    );
  });
};
