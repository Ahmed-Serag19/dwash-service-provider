import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { endpoints } from "@/constants/endPoints";
import Modal from "@/components/ui/Modal";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import TimePicker from "@/components/TimePicker";
import DatePicker from "@/components/DatePicker";
import UserSlots from "@/components/UserSlots";
import { Slot } from "@/interface/interfaces";
const TimeSlotPicker: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
  });
  const { t, i18n } = useTranslation();
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
  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await axios.get(endpoints.getSlots, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      if (response.data.success) {
        setSlots(response.data.content);
      } else {
        toast.error("Failed to fetch time slots.");
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("An error occurred while fetching slots.");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    const { startTime, endTime } = formData;

    if (!date || !startTime || !endTime) {
      toast.error(t("fillAllFieldsError"));
      return;
    }

    if (startTime >= endTime) {
      toast.error(t("endTimeError"));
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
      toast.success(t("timeSlotAdded"));
      setFormData({ startTime: "", endTime: "" });
      setDate(undefined);
      setIsModalOpen(false);
      await fetchSlots();
    } catch (error) {
      console.error(error);
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.messageEn === "Conflict Slots"
      ) {
        toast.error(t("conflictSlots"));
      } else {
        toast.error(t("addTimeSlotError"));
      }
    }
  };
  useEffect(() => {
    fetchSlots();
  }, []);

  const handleDeleteSlot = async (slotId: number) => {
    try {
      await axios.delete(`${endpoints.deleteTimeSlot(slotId)}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      toast.success("Time slot deleted successfully.");
      setSlots((prev) => prev.filter((slot) => slot.slotId !== slotId));
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast.error("Failed to delete the time slot.");
    }
  };

  return (
    <div className="container h-full mx-auto px-4 flex flex-col justify-start py-8">
      <div
        className={`flex ${
          i18n.language === "en" ? "justify-end" : "justify-start"
        } w-full  `}
      >
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="mb-4 bg-blue-950 text-white hover:bg-blue-900 hover:text-white px-8 py-4 text-lg"
        >
          {t("add")}
        </Button>
      </div>
      <UserSlots
        handleDeleteSlot={handleDeleteSlot}
        slots={slots}
        loading={loading}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-lg md:text-2xl font-bold mb-4 text-blue-950">
          {t("addTimeSlot")}
        </h2>
        <form className="space-y-4">
          <div>
            <DatePicker date={date} setDate={setDate} />
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
          <Button
            className="md:text-lg md:px-7 md:py-5 bg-blue-950"
            onClick={handleSubmit}
          >
            {t("save")}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TimeSlotPicker;
