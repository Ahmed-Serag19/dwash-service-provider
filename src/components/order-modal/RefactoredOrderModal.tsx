import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axios from "axios";
import { endpoints } from "@/constants/endPoints";

import { OrderHeader } from "./OrderHeader";
import { ServiceSection } from "./ServiceSection";
import { CustomerSection } from "./CustomerSection";
import { DateTimeSection } from "./DateTimeSection";
import { LocationSection } from "./LocationSection";
import { PricingSection } from "./PricingSection";
import { StatusSection } from "./StatusSection";
import { OrderActions } from "./OrderActions";
import type { OrderModalProps } from "@/interface/interfaces";
import type { OrderAction } from "@/interface/interfaces";

export const RefactoredOrderModal: React.FC<OrderModalProps> = ({
  language,
  order,
  refetchClosed,
  refetchCurrent,
  isClosed,
}) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOrderAction = async (action: OrderAction) => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      toast.error(t("pleaseLogin"));
      return;
    }

    setLoading(true);

    try {
      const endpointMap = {
        accept: endpoints.acceptOrder(order.request.id),
        reject: endpoints.rejectOrder(order.request.id),
        proceed: endpoints.proceedOrder(order.request.id),
        complete: endpoints.completeOrder(order.request.id),
      };

      const response = await axios.put(endpointMap[action], null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const successMessages = {
          accept: t("orderAccepted"),
          reject: t("orderRejected"),
          proceed: t("orderProceed"),
          complete: t("orderCompleted"),
        };

        toast.success(successMessages[action]);
        setIsOpen(false);

        // Refetch both lists to ensure UI is updated
        await Promise.all([refetchClosed(), refetchCurrent()]);
      } else {
        toast.error(
          t(`error${action.charAt(0).toUpperCase() + action.slice(1)}ingOrder`)
        );
      }
    } catch (error: any) {
      console.error(`Error ${action}ing order:`, error);

      // Handle specific error for proceed action
      if (
        action === "proceed" &&
        error.response?.data?.messageEn?.includes(
          "change status to under processing should be in the same day"
        )
      ) {
        toast.error(t("samedayError"));
      } else {
        toast.error(
          t(`error${action.charAt(0).toUpperCase() + action.slice(1)}ingOrder`)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-2 hover:bg-gray-50 transition-colors bg-transparent"
          aria-label={t("viewOrderDetails")}
        >
          <span>{t("details") || "View Details"}</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        className="sm:max-w-[600px] p-0 flex flex-col gap-0 rounded-md text-blue-950"
      >
        <OrderHeader orderId={order.invoiceId} />

        <ScrollArea
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          className="max-h-[70vh] overflow-auto flex flex-col text-blue-950"
        >
          <div className="p-6 space-y-6">
            <ServiceSection order={order} language={language} />
            <CustomerSection order={order} language={language} />
            <DateTimeSection order={order} language={language} />
            <LocationSection order={order} language={language} />
            <PricingSection order={order} language={language} />

            <div className="flex justify-between items-center max-[420px]:flex-col max-sm:gap-5">
              <StatusSection order={order} language={language} />
              <OrderActions
                order={order}
                onAction={handleOrderAction}
                loading={loading}
                isClosed={isClosed}
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
