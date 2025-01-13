import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { endpoints } from "@/constants/endPoints";
import Modal from "@/components/ui/Modal";
import { t } from "i18next";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TimeSlotPicker: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
  });

  const handleTimeChange = (
    field: "startTime" | "endTime",
    hour: number,
    minute: number
  ) => {
    const time = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    setFormData((prev) => ({ ...prev, [field]: time }));
  };

  const handleSubmit = async () => {
    const { startTime, endTime } = formData;

    if (!date || !startTime || !endTime) {
      toast.error("All fields are required!");
      return;
    }

    if (startTime >= endTime) {
      toast.error("Start time must be earlier than end time!");
      return;
    }

    const payload = [
      {
        timeFrom: `${startTime}:00`,
        timeTo: `${endTime}:00`,
        date: format(date, "yyyy-MM-dd"),
      },
    ];

    try {
      await axios.post(endpoints.addTimeSlot, payload, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      toast.success("Time slot added successfully!");
      setFormData({ startTime: "", endTime: "" });
      setDate(undefined);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add time slot!");
    }
  };

  return (
    <div className="container h-full mx-auto px-4 flex justify-center  py-8">
      <Button
        variant="outline"
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-blue-950 text-white hover:bg-blue-900 hover:text-white"
        size="lg"
      >
        {t("add")}
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4 text-blue-950">
          {t("addTimeSlot")}
        </h2>
        <form className="space-y-4">
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>{t("pickDate")}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid  grid-cols-2 gap-4">
            <TimePicker
              label={t("startTime")}
              selectedTime={formData.startTime}
              onTimeChange={(hour, minute) =>
                handleTimeChange("startTime", hour, minute)
              }
            />

            <TimePicker
              label={t("endTime")}
              selectedTime={formData.endTime}
              onTimeChange={(hour, minute) =>
                handleTimeChange("endTime", hour, minute)
              }
            />
          </div>
        </form>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outline"
            className="md:text-lg md:px-7 md:py-5"
            onClick={() => setIsModalOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button className="md:text-lg md:px-7 md:py-5" onClick={handleSubmit}>
            {t("save")}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

interface TimePickerProps {
  label: string;
  selectedTime: string;
  onTimeChange: (hour: number, minute: number) => void;
}

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
      <label className="block mb-2 text-sm font-medium text-gray-900">
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

export default TimeSlotPicker;
