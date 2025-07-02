import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import TimePicker from "@/components/TimePicker";
import DatePicker from "@/components/DatePicker";
import UserSlots from "@/components/time-slots/UserSlots";
import PendingSlotsList from "@/components/PendingSlotsList";

import { endpoints } from "@/constants/endPoints";
import { PendingSlot } from "@/utils/timeSlotUtils";
import { calculateEndTime } from "@/utils/timeSlotUtils";

import { useSlots } from "@/hooks/useSlots";
import { usePendingSlots } from "@/hooks/usePendingSlots";

// Helper to centralize auth header
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  },
});

const TimeSlotPicker: React.FC = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ar" ? "ar-EG" : "en-US";
  const isRTL = i18n.language === "ar";
  const location = useLocation();

  // Hooks for live slots and pending slots
  const { slots, loading, fetchSlots, deleteSlot } = useSlots();
  const { pendingSlots, addSlot, removeSlot, clearSlots } = usePendingSlots();

  // Form & modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("");

  // Prevent double‐submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open modal automatically if URL has ?add=true
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("add") === "true") {
      setIsModalOpen(true);
    }
  }, [location.search]);

  // Handler: “Add to pending list” button
  const handleAddToPending = useCallback(() => {
    if (!date || !startTime) {
      toast.error(t("fillAllFieldsError") || "Fill all fields");
      return;
    }
    addSlot(date, startTime);
    setStartTime(""); // reset only time, keep date for multiple additions
  }, [date, startTime, addSlot, t]);

  // Handler: “Submit all pending” button
  const handleSubmitAll = useCallback(async () => {
    if (pendingSlots.length === 0) {
      toast.error(t("noSlotsToAdd") || "No slots to add");
      return;
    }

    setIsSubmitting(true);

    const payload = pendingSlots.map((slot: PendingSlot) => ({
      timeFrom: `${slot.startTime}:00`,
      timeTo: `${slot.endTime}:00`,
      date: format(slot.date, "yyyy-MM-dd"),
    }));

    try {
      await axios.post(endpoints.addTimeSlot, payload, getAuthHeader());
      toast.success(t("timeSlotAdded"));
      clearSlots();
      setStartTime("");
      setDate(undefined);
      setIsModalOpen(false);
      await fetchSlots();
    } catch (err: any) {
      console.error("Error adding slots:", err);

      // If it’s an Axios error with a JSON response
      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data as {
          messageEn?: string;
          messageAr?: string;
        };
        if (data.messageAr === "Conflict slot") {
          toast.error(t("conflictSlotError"));
        } else if (data.messageAr === "out of allowed range") {
          toast.error(t("outOfAllowedRangeError"));
        } else if (i18n.language === "ar" && data.messageAr) {
          toast.error(data.messageAr);
        } else if (data.messageEn) {
          toast.error(data.messageEn);
        } else {
          // Fallback if messageEn/messageAr missing
          toast.error(t("addTimeSlotError") || "Failed to add time slots");
        }
      } else {
        // Completely generic fallback
        toast.error(t("addTimeSlotError") || "Failed to add time slots");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [pendingSlots, t, clearSlots, fetchSlots, i18n.language]);

  // Handler: “Delete one live slot”
  const handleDeleteSlot = useCallback(
    (slotId: number) => {
      deleteSlot(slotId);
    },
    [deleteSlot]
  );

  // Handler: “Clear pending + close modal”
  const handleCancelModal = useCallback(() => {
    clearSlots();
    setDate(undefined);
    setStartTime("");
    setIsModalOpen(false);
  }, [clearSlots]);

  return (
    <div className="container h-full mx-auto px-4 flex flex-col justify-start py-8">
      {/* ADD BUTTON */}
      <div className={`flex ${isRTL ? "justify-start" : "justify-end"} w-full`}>
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="mb-4 bg-blue-950 text-white hover:bg-blue-900 text-lg px-8 py-4"
          disabled={isSubmitting}
        >
          {t("add")}
        </Button>
      </div>

      {/* LIVE SLOTS LIST */}
      <UserSlots
        slots={slots}
        handleDeleteSlot={handleDeleteSlot}
        loading={loading}
      />

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={handleCancelModal}>
        <h2 className="text-lg md:text-2xl font-bold mb-4 text-blue-950">
          {t("addTimeSlot")}
        </h2>

        {/* PENDING SLOTS */}
        <PendingSlotsList
          pendingSlots={pendingSlots}
          onRemove={removeSlot}
          formatTimeDisplay={(time) =>
            new Date(`1970-01-01T${time}:00`).toLocaleTimeString(locale, {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })
          }
        />

        {/* FORM TO ADD A SINGLE SLOT TO PENDING */}
        <div className="space-y-4">
          <DatePicker date={date} setDate={setDate} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <TimePicker
                label={t("startTime")}
                selectedTime={startTime}
                onTimeChange={(h, m) => {
                  const hh = h.toString().padStart(2, "0");
                  const mm = m.toString().padStart(2, "0");
                  setStartTime(`${hh}:${mm}`);
                }}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("endTime")}
              </label>
              <div className="px-4 py-1 border rounded-md bg-gray-50">
                {startTime
                  ? new Date(
                      `1970-01-01T${calculateEndTime(
                        parseInt(startTime.split(":")[0], 10),
                        parseInt(startTime.split(":")[1], 10)
                      )}:00`
                    ).toLocaleTimeString(locale, {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })
                  : "--:--"}
              </div>
              <p className="text-xs text-blue-900">{t("endTimeMessage")}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddToPending}
              className="flex items-center gap-1"
              disabled={isSubmitting}
            >
              <Plus size={16} />
              {t("addToList")}
            </Button>
          </div>
        </div>

        {/* MODAL ACTIONS */}
        <div className="flex justify-between gap-4 mt-6">
          <Button
            variant="outline"
            className="md:text-lg"
            onClick={handleCancelModal}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="md:text-lg"
              onClick={clearSlots}
              disabled={pendingSlots.length === 0 || isSubmitting}
            >
              {t("clear")}
            </Button>
            <Button
              className="md:text-lg bg-blue-950"
              onClick={handleSubmitAll}
              disabled={pendingSlots.length === 0 || isSubmitting}
            >
              {isSubmitting
                ? t("saving")
                : `${t("save")} (${pendingSlots.length})`}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TimeSlotPicker;
