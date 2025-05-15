import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface TimePickerProps {
  label: string;
  selectedTime: string;
  onTimeChange: (hour: number, minute: number) => void;
  disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  selectedTime,
  onTimeChange,
  disabled = false,
}) => {
  // Generate hours in 12-hour format (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  // Parse the time string into hour and period (AM/PM)
  const parseTime = (time: string) => {
    if (!time) return { hour: 12, period: "AM" };

    const [hourStr] = time.split(":");
    let hour = parseInt(hourStr);
    const period = hour >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hour = hour % 12 || 12;

    return { hour, period };
  };

  const { hour, period } = parseTime(selectedTime || "");

  const handleTimeChange = (newHour: number, newPeriod: string) => {
    // Convert back to 24-hour format for the parent component
    let hour24 = newHour;
    if (newPeriod === "PM" && newHour !== 12) {
      hour24 = newHour + 12;
    } else if (newPeriod === "AM" && newHour === 12) {
      hour24 = 0;
    }

    onTimeChange(hour24, 0); // Always set minutes to 0
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            disabled={disabled}
          >
            {hour}:00 {period}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {hours.map((h) => (
              <Button
                key={h}
                size="sm"
                variant={hour === h ? "default" : "outline"}
                onClick={() => handleTimeChange(h, period)}
                className="min-w-[60px]"
              >
                {h}
              </Button>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <Button
              variant={period === "AM" ? "default" : "outline"}
              onClick={() => handleTimeChange(hour, "AM")}
              className="min-w-[80px]"
            >
              AM
            </Button>
            <Button
              variant={period === "PM" ? "default" : "outline"}
              onClick={() => handleTimeChange(hour, "PM")}
              className="min-w-[80px]"
            >
              PM
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimePicker;
