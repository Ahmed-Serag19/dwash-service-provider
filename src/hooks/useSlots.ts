import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { endpoints } from "@/constants/endPoints";
import { Slot } from "@/interface/interfaces";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  },
});

export function useSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  // Fetch all slots
  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(endpoints.getSlots, getAuthHeader());
      if (response.data.success) {
        setSlots(response.data.content || []);
      } else {
        toast.error(t("fetchTimeSlotsError"));
      }
    } catch (err) {
      console.error("Error fetching slots:", err);
      toast.error(t("fetchTimeSlotsError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Delete a single slot
  const deleteSlot = useCallback(
    async (slotId: number) => {
      try {
        await axios.delete(endpoints.deleteTimeSlot(slotId), getAuthHeader());
        toast.success(t("timeSlotDeletedSuccess"));
        // Remove deleted slot from state:
        setSlots((prev) => prev.filter((s) => s.slotId !== slotId));
      } catch (err) {
        console.error("Error deleting slot:", err);
        toast.error(t("timeSlotDeletedError"));
      }
    },
    [t]
  );

  // Automatically fetch on mount
  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return { slots, loading, fetchSlots, deleteSlot };
}
