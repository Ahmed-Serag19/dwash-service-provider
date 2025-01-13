import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { endpoints } from "@/constants/endPoints";
import Modal from "@/components/ui/Modal";
import { t } from "i18next";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TimeSlotPicker: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = React.useState<Date>();
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        date,
      },
    ];

    try {
      // await axios.post(endpoints.addTimeSlot, payload, {
      //   headers: {
      //     Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      //   },
      // });
      toast.success("Time slot added successfully!");
      setFormData({ startTime: "", endTime: "" });
      setDate(undefined);
      setIsModalOpen(false);
      console.log(payload);
      console.log(date);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add time slot!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Add Time Slot Button */}
      <Button onClick={() => setIsModalOpen(true)} className="mb-4">
        {t("addTimeSlot")}
      </Button>

      {/* Modal */}
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
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="flex w-auto flex-col space-y-2 p-2"
              >
                <Select
                  onValueChange={(value) =>
                    setDate(addDays(new Date(), parseInt(value)))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="0">Today</SelectItem>
                    <SelectItem value="1">Tomorrow</SelectItem>
                    <SelectItem value="3">In 3 days</SelectItem>
                    <SelectItem value="7">In a week</SelectItem>
                  </SelectContent>
                </Select>
                <div className="rounded-md border">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label
              htmlFor="startTime"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              {t("startTime")}
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-950 focus:border-blue-950 block w-full p-2.5 "
              required
            />
          </div>
          <div>
            <label
              htmlFor="endTime"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              {t("endTime")}
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="bg-gray-50 border  leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-950 focus:border-blue-950 block w-full p-2.5 "
              required
            />
          </div>
        </form>
        <div className="flex justify-end gap-4 mt-6 ">
          <Button
            variant="outline"
            size="lg"
            className="text-lg"
            onClick={() => setIsModalOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button size="lg" className="text-lg" onClick={handleSubmit}>
            {t("save")}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TimeSlotPicker;
