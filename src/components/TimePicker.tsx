// components/TimePicker.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";

interface TimePickerProps {
  label: string;
  selectedTime: string; // in "HH:mm" (24-hour) format
  onTimeChange: (hour: number, minute: number) => void;
  disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  selectedTime,
  onTimeChange,
  disabled = false,
}) => {
  const { i18n, t } = useTranslation();
  const localeCode = i18n.language === "ar" ? "ar-EG" : "en-US";

  // Hours 1 through 12 for selection
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  // Parse a "HH:mm" string into 12-hour + period (“AM”/“PM”)
  const parseTime = (time: string) => {
    if (!time) return { hour12: 12, period: "AM", minute: 0 };

    const [hour24Str, minuteStr] = time.split(":");
    let hour24 = parseInt(hour24Str, 10);
    const minute = parseInt(minuteStr, 10);
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return { hour12, period, minute };
  };

  const { hour12, period } = parseTime(selectedTime);

  // Build a localized display of the full time label (“3:00 PM” or “٣:٠٠ م”)
  const timeLabel = selectedTime
    ? new Date(`1970-01-01T${selectedTime}:00`).toLocaleTimeString(localeCode, {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : "";

  // Extract just the day‐period portion (“AM”/“PM” or “ص”/“م”) via formatToParts
  const extractDayPeriod = (dateString: string) => {
    const parts = new Intl.DateTimeFormat(localeCode, {
      hour: "numeric",
      hour12: true,
    }).formatToParts(new Date(dateString));
    return parts.find((p) => p.type === "dayPeriod")?.value ?? "";
  };
  const amLabel = extractDayPeriod("1970-01-01T00:00:00");
  const pmLabel = extractDayPeriod("1970-01-01T13:00:00");

  // When user picks a new hour or toggles period, convert to 24-hour
  const handleTimeChange = (newHour12: number, newPeriod: "AM" | "PM") => {
    let hour24 = newHour12 % 12;
    if (newPeriod === "PM") {
      hour24 += 12;
    }
    onTimeChange(hour24, 0);
  };

  return (
    <div className="space-y-2">
      {/* Label above the button */}
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            disabled={disabled}
          >
            {timeLabel || (disabled ? t("noTime") : t("addTimeSlot"))}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-3 space-y-3">
          {/* Grid of hour buttons (localized numerals) */}
          <div className="grid grid-cols-3 gap-2">
            {hours.map((h12) => {
              // Display "١", "٢", … or "1", "2", … depending on locale
              const labelHour = new Intl.NumberFormat(localeCode, {
                useGrouping: false,
              }).format(h12);

              return (
                <Button
                  key={h12}
                  size="lg"
                  variant={hour12 === h12 ? "default" : "outline"}
                  onClick={() => handleTimeChange(h12, period as "AM" | "PM")}
                  className="min-w-[60px]"
                >
                  {labelHour}
                </Button>
              );
            })}
          </div>

          {/* AM/PM toggle buttons (showing only the dayPeriod) */}
          <div className="flex justify-center gap-2">
            <Button
              variant={period === "AM" ? "default" : "outline"}
              onClick={() => handleTimeChange(hour12, "AM")}
              className="min-w-[80px]"
            >
              {amLabel}
            </Button>
            <Button
              variant={period === "PM" ? "default" : "outline"}
              onClick={() => handleTimeChange(hour12, "PM")}
              className="min-w-[80px]"
            >
              {pmLabel}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimePicker;
