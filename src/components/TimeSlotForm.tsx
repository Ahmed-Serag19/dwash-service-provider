import type React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TimePicker from "@/components/TimePicker";
import DatePicker from "@/components/DatePicker";

interface TimeSlotFormProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  formData: {
    startTime: string;
    endTime: string;
  };
  onStartTimeChange: (hour: number, minute: number) => void;
  onAddSlot: () => void;
  formatTimeDisplay: (time: string) => string;
  t: (key: string) => string; // Translation function
}

// Component for the time slot form
const TimeSlotForm: React.FC<TimeSlotFormProps> = ({
  date,
  setDate,
  formData,
  onStartTimeChange,
  onAddSlot,
  formatTimeDisplay,
  t,
}) => {
  return (
    <form className="space-y-4">
      <div>
        <DatePicker date={date} setDate={setDate} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TimePicker
          label={t("startTime")}
          selectedTime={formData.startTime}
          onTimeChange={onStartTimeChange}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {t("endTime")}
          </label>
          <div className="px-4 py-1 border rounded-md bg-gray-50">
            {formatTimeDisplay(formData.endTime)}
          </div>
          <p className="text-xs text-blue-900">{t("endTimeMessage")} </p>
        </div>
      </div>

      {/* Add slot button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onAddSlot}
          className="flex items-center gap-1"
        >
          <Plus size={16} />
          {t("addToList")}
        </Button>
      </div>
    </form>
  );
};

export default TimeSlotForm;
