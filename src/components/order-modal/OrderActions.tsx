"use client";

import type React from "react";
import { useTranslation } from "react-i18next";
import type { OrderActionProps } from "@/interface/interfaces";

export const OrderActions: React.FC<OrderActionProps> = ({
  order,
  onAction,
  loading,
  isClosed,
}) => {
  const { t } = useTranslation();

  const handleAccept = () => onAction(order.request.id);
  const handleReject = () => onAction(order.request.id);
  const handleProceed = () => onAction(order.request.id);
  const handleComplete = () => onAction(order.request.id);

  const renderActionButtons = () => {
    const { statusName, waitingProcessId } = order.request;

    // Waiting orders - show accept/reject
    if (statusName === "WAITING") {
      return (
        <div className="flex gap-3">
          <button
            disabled={loading}
            onClick={handleAccept}
            className="disabled:bg-gray-400 disabled:cursor-not-allowed px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {t("accept")}
          </button>
          <button
            disabled={loading}
            onClick={handleReject}
            className="disabled:bg-gray-400 disabled:cursor-not-allowed px-6 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t("reject")}
          </button>
        </div>
      );
    }

    // Accepted orders - show proceed button
    if (statusName === "ACCEPTED" && waitingProcessId === 2) {
      return (
        <button
          disabled={loading}
          onClick={handleProceed}
          className="disabled:bg-gray-400 disabled:cursor-not-allowed px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t("proceedOrder")}
        </button>
      );
    }

    // Under processing orders - show complete button
    if (statusName === "UNDER_PROCESSING" && waitingProcessId === 2) {
      return (
        <button
          disabled={loading}
          onClick={handleComplete}
          className="disabled:bg-gray-400 disabled:cursor-not-allowed px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {t("completeOrder")}
        </button>
      );
    }

    // Show cancel button for non-closed orders (except completed ones)
    if (
      !isClosed &&
      ![
        "COMPLETED",
        "COMPLETED_BY_ADMIN",
        "CANCELLED",
        "CANCELLED_BY_ADMIN",
      ].includes(statusName)
    ) {
      return (
        <button
          disabled={loading}
          onClick={handleReject}
          className="disabled:bg-gray-400 disabled:cursor-not-allowed px-6 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {t("cancel")}
        </button>
      );
    }

    return null;
  };

  return <div className="flex justify-end">{renderActionButtons()}</div>;
};
