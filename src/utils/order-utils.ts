import { OrderStatus } from "@/interface/interfaces";

/**
 * Utility functions for order management
 */

export const getStatusVariant = (status: string) => {
  switch (status) {
    case OrderStatus.COMPLETED:
    case OrderStatus.COMPLETED_BY_ADMIN:
      return "default";
    case OrderStatus.CANCELLED_BY_ADMIN:
    case OrderStatus.REJECTED:
      return "destructive";
    case OrderStatus.WAITING:
      return "secondary";
    case OrderStatus.ACCEPTED:
      return "outline";
    case OrderStatus.UNDER_PROCESSING:
      return "default";
    default:
      return "default";
  }
};

export const isOrderCancellable = (
  status: string,
  isClosed?: boolean
): boolean => {
  const nonCancellableStatuses = [
    OrderStatus.COMPLETED,
    OrderStatus.COMPLETED_BY_ADMIN,
    OrderStatus.CANCELLED,
    OrderStatus.CANCELLED_BY_ADMIN,
    OrderStatus.REJECTED,
  ];

  return !isClosed && !nonCancellableStatuses.includes(status as OrderStatus);
};

export const getOrderActionLabel = (
  status: string,
  waitingProcessId: number
): string => {
  switch (status) {
    case OrderStatus.WAITING:
      return "Accept/Reject";
    case OrderStatus.ACCEPTED:
      return waitingProcessId === 2 ? "Proceed" : "Cancel";
    case OrderStatus.UNDER_PROCESSING:
      return waitingProcessId === 2 ? "Complete" : "Cancel";
    default:
      return "No Action";
  }
};
