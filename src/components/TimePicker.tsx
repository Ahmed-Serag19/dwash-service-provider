import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { TimePickerProps } from "@/interface/interfaces";

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  selectedTime,
  onTimeChange,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const parseTime = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    return { hour, minute };
  };

  const { hour, minute } =
    selectedTime && selectedTime.includes(":")
      ? parseTime(selectedTime)
      : { hour: 0, minute: 0 };

  return (
    <div>
      <label className="block mb-2 text-md font-medium text-gray-900">
        {label}
      </label>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              {hour.toString().padStart(2, "0")}:
              {minute.toString().padStart(2, "0")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 grid gap-4 max-h-48 overflow-scroll">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Hour</span>
                {hours.map((h) => (
                  <Button
                    key={h}
                    size="icon"
                    variant={hour === h ? "default" : "ghost"}
                    onClick={() => onTimeChange(h, minute)}
                  >
                    {h.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Minute</span>
                {minutes.map((m) => (
                  <Button
                    key={m}
                    size="icon"
                    variant={minute === m ? "default" : "ghost"}
                    onClick={() => onTimeChange(hour, m)}
                  >
                    {m.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TimePicker;
