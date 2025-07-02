import type React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { Order } from "@/interface/interfaces";
import type { OrderAction } from "@/interface/interfaces";
import { OrderStatus, WaitingProcessId } from "@/interface/interfaces";
import { isOrderCancellable } from "@/utils/order-utils";

interface OrderActionProps {
  order: Order;
  onAction: (action: OrderAction) => void;
  loading: boolean;
  isClosed?: boolean;
}

export const OrderActions: React.FC<OrderActionProps> = ({
  order,
  onAction,
  loading,
  isClosed,
}) => {
  const { t } = useTranslation();
  const { statusName, waitingProcessId } = order.request;

  // Render action buttons based on order status
  const renderActionButtons = () => {
    switch (statusName) {
      case OrderStatus.WAITING:
        return (
          <div className="flex gap-3">
            <Button
              disabled={loading}
              onClick={() => onAction("accept")}
              className="px-6 py-2 text-sm bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? t("loading") : t("accept")}
            </Button>
            <Button
              disabled={loading}
              onClick={() => onAction("reject")}
              variant="destructive"
              className="px-6 py-2 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? t("loading") : t("reject")}
            </Button>
          </div>
        );

      case OrderStatus.ACCEPTED:
        if (waitingProcessId === WaitingProcessId.READY_TO_PROCEED) {
          return (
            <Button
              disabled={loading}
              onClick={() => onAction("proceed")}
              className="px-6 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? t("loading") : t("proceedOrder")}
            </Button>
          );
        }
        break;

      case OrderStatus.UNDER_PROCESSING:
        if (waitingProcessId === WaitingProcessId.READY_TO_PROCEED) {
          return (
            <Button
              disabled={loading}
              onClick={() => onAction("complete")}
              className="px-6 py-2 text-sm bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? t("loading") : t("completeOrder")}
            </Button>
          );
        }
        break;

      default:
        break;
    }

    // Show cancel button for orders that can be cancelled
    if (isOrderCancellable(statusName, isClosed)) {
      return (
        <Button
          disabled={loading}
          onClick={() => onAction("reject")}
          variant="destructive"
          className="px-6 py-2 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? t("loading") : t("cancel")}
        </Button>
      );
    }

    return null;
  };

  return <div className="flex justify-end">{renderActionButtons()}</div>;
};
