// components/TimeSlotPicker.tsx
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
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import PendingSlotsList from "@/components/PendingSlotsList";
import {
  PendingSlot,
  calculateEndTime,
  formatTimeDisplay,
  hasTimeSlotConflict,
} from "@/utils/timeSlotUtils";

const TimeSlotPicker: React.FC = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
  });

  // New state for pending slots
  const [pendingSlots, setPendingSlots] = useState<PendingSlot[]>([]);

  const { t, i18n } = useTranslation();

  const handleStartTimeChange = (hour: number, minute: number) => {
    const time = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    setFormData((prev) => ({
      ...prev,
      startTime: time,
      // Automatically set end time to 45 minutes later
      endTime: calculateEndTime(hour, minute),
    }));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("add") === "true") {
      setIsModalOpen(true);
    }
  }, [location]);

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

  // Add a slot to the pending slots list
  const handleAddSlot = () => {
    const { startTime, endTime } = formData;

    if (!date || !startTime || !endTime) {
      toast.error(t("fillAllFieldsError"));
      return;
    }

    if (startTime >= endTime) {
      toast.error(t("endTimeError"));
      return;
    }

    // Check for conflicts with existing pending slots
    if (hasTimeSlotConflict(pendingSlots, date, startTime, endTime)) {
      toast.error(t("conflictSlots"));
      return;
    }

    // Add to pending slots
    setPendingSlots([
      ...pendingSlots,
      {
        id: Date.now().toString(), // Unique ID for this pending slot
        date: new Date(date),
        startTime,
        endTime,
      },
    ]);

    // Reset form for next slot
    setFormData({ startTime: "", endTime: "" });
  };

  // Remove a slot from pending slots
  const handleRemovePendingSlot = (id: string) => {
    setPendingSlots(pendingSlots.filter((slot) => slot.id !== id));
  };

  // Submit all pending slots
  const handleSubmit = async () => {
    if (pendingSlots.length === 0) {
      toast.error(t("noSlotsToAdd") || "No slots to add");
      return;
    }

    const payload = pendingSlots.map((slot) => ({
      timeFrom: `${slot.startTime}:00`,
      timeTo: `${slot.endTime}:00`,
      date: format(slot.date, "yyyy-MM-dd"),
    }));

    try {
      await axios.post(endpoints.addTimeSlot, payload, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      toast.success(t("timeSlotAdded"));
      setFormData({ startTime: "", endTime: "" });
      setDate(undefined);
      setPendingSlots([]);
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
      toast.success(t("timeSlotDeleted"));
      setSlots((prev) => prev.filter((slot) => slot.slotId !== slotId));
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast.error("Failed to delete the time slot.");
    }
  };

  const handleClearPendingSlots = () => {
    setPendingSlots([]);
    setFormData({ startTime: "", endTime: "" });
    setDate(undefined);
  };

  return (
    <div className="container h-full mx-auto px-4 flex flex-col justify-start py-8">
      <div
        className={`flex ${
          i18n.language === "en" ? "justify-end" : "justify-start"
        } w-full`}
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

        {/* Pending slots list - This is where the pending slots are rendered */}
        <PendingSlotsList
          pendingSlots={pendingSlots}
          onRemove={handleRemovePendingSlot}
          formatTimeDisplay={formatTimeDisplay}
        />

        {/* Time slot form */}
        <form className="space-y-4">
          <div>
            <DatePicker date={date} setDate={setDate} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TimePicker
              label={t("startTime")}
              selectedTime={formData.startTime}
              onTimeChange={handleStartTimeChange}
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

          {/* Add slot button - This is the new button to add a slot to the pending list */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSlot}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              {t("addToList") || "Add to List"}
            </Button>
          </div>
        </form>

        <div className="flex justify-between gap-4 mt-6">
          <Button
            variant="outline"
            className="md:text-lg"
            onClick={() => {
              setPendingSlots([]);
              setIsModalOpen(false);
            }}
          >
            {t("cancel")}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="md:text-lg"
              onClick={handleClearPendingSlots}
              disabled={pendingSlots.length === 0}
            >
              {t("clear") || "Clear"}
            </Button>
            <Button
              className="md:text-lg bg-blue-950"
              onClick={handleSubmit}
              disabled={pendingSlots.length === 0}
            >
              {t("save")} ({pendingSlots.length})
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TimeSlotPicker;
