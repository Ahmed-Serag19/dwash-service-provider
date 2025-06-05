// components/DatePicker.tsx
import React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isBefore, startOfToday } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ date, setDate }) => {
  const { t, i18n } = useTranslation();
  const localeObj = i18n.language === "ar" ? ar : enUS;
  const today = startOfToday();

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
            format(date, "PPP", { locale: localeObj })
          ) : (
            <span>{t("pickDate")}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(d) => isBefore(d, today)}
          locale={localeObj}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
