import type React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { Slot } from "@/interface/interfaces";

interface SlotCalendarViewerProps {
  date: Date | undefined;
  slots: Slot[];
  onDateClick: (date: Date) => void;
}

const SlotCalendarViewer: React.FC<SlotCalendarViewerProps> = ({
  date,
  slots,
  onDateClick,
}) => {
  const { t, i18n } = useTranslation();
  const localeObj = i18n.language === "ar" ? ar : enUS;

  // Get unique dates that have slots
  const datesWithSlots = Array.from(
    new Set(slots.map((slot) => slot.date))
  ).map((dateStr) => new Date(dateStr));

  // Custom day renderer to highlight dates with slots with smaller background
  const modifiers = {
    hasSlots: datesWithSlots,
  };

  const modifiersStyles = {
    hasSlots: {
      backgroundColor: "#22c55e",
      color: "white",
      fontWeight: "bold",
      borderRadius: "4px",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "2px auto",
    },
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    onDateClick(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            i18n.language === "ar" ? (
              date.toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            ) : (
              date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            )
          ) : (
            <span>{t("selectDateToViewSlots")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={localeObj}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="[&_.rdp-day]:p-1 [&_.rdp-day_button]:w-8 [&_.rdp-day_button]:h-8"
        />
        <div className="p-3 border-t text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>{t("datesWithAvailableSlots")}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SlotCalendarViewer;
