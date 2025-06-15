import { Order } from "@/interface/interfaces";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronRight,
  Package,
  User,
  Phone,
  Clock3,
  Calendar,
  Clock,
  MapPinned,
  MapPin,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { format, set } from "date-fns";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { endpoints } from "@/constants/endPoints";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

interface OrderModalProps {
  language: string;
  order: Order;
  refetchCurrent: () => void;
  refetchClosed: () => void;
  isClosed?: boolean;
}
function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}
function getStatusVariant(status: string) {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "CANCELLED_BY_ADMIN":
      return "destructive";
    case "WAITING":
      return "secondary";
    case "ACCEPTED":
      return "outline";
    default:
      return "default";
  }
}

const OrderModal = ({
  language,
  order,
  refetchClosed,
  refetchCurrent,
  isClosed,
}: OrderModalProps) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelOrder = async (id: number) => {
    const token = sessionStorage.getItem("accessToken");
    setLoading(true);
    if (!token) {
      toast.error(t("pleaseLogin"));
      return;
    }

    try {
      const response = await axios.put(endpoints.rejectOrder(id), null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(t("orderRejected"));
        setIsOpen(false);
        refetchClosed();
        refetchCurrent();
      } else {
        toast.error(t("errorRejectingOrder"));
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast.error(t("errorRejectingOrder"));
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (id: number) => {
    const token = sessionStorage.getItem("accessToken");
    setLoading(true);
    if (!token) {
      toast.error(t("pleaseLogin"));
      return;
    }

    try {
      const response = await axios.put(endpoints.acceptOrder(id), null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(t("orderAccepted"));
        setIsOpen(false);
        refetchClosed();
        refetchCurrent();
      } else {
        toast.error(t("errorAcceptingOrder"));
      }
    } catch (error) {
      console.error("Error Accepting order:", error);
      toast.error(t("errorAcceptingOrder"));
    } finally {
      setLoading(false);
    }
  };

  const handleProceedOrder = async (id: number) => {
    const token = sessionStorage.getItem("accessToken");
    setLoading(true);
    if (!token) {
      toast.error(t("pleaseLogin"));
      return;
    }

    try {
      const response = await axios.put(endpoints.proceedOrder(id), null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(t("orderProceed"));
        refetchCurrent();
        refetchClosed();
      } else {
        toast.error(t("errorProceedingOrder"));
      }
    } catch (error) {
      if (
        (error as any).response.data.messageEn ===
        "change status to under processing should be in the same day of reserved day"
      ) {
        toast.error(t("samedayError"));
        return;
      }
      toast.error(t("errorProceedingOrder"));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (id: number) => {
    const token = sessionStorage.getItem("accessToken");
    setLoading(true);
    if (!token) {
      toast.error(t("pleaseLogin"));
      return;
    }

    try {
      const response = await axios.put(endpoints.completeOrder(id), null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(t("orderCompleted"));
        refetchCurrent();
        refetchClosed();
      } else {
        toast.error(t("errorCompletingOrder"));
      }
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error(t("errorCompletingOrder"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            aria-describedby="click for more details button"
            aria-description="click to show a pop up modal to control the order, cancel accept it"
            className="flex items-center space-x-2 hover:bg-gray-50 transition-colors"
          >
            <span>{t("details") || "View Details"}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
          className={`sm:max-w-[600px] p-0 flex flex-col gap-5 rounded-md text-blue-950 ${
            language === "ar" ? "" : ""
          }`}
        >
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-xl font-semibold">
              {t("orderDetails") || "Order Details"}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              {t("orderNumber")}: <span>{order.invoiceId}</span>
            </p>
          </DialogHeader>
          <ScrollArea
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
            className="max-h-[70vh] overflow-auto flex flex-col text-blue-950"
          >
            <div className="p-6 space-y-6">
              {/* Service Section */}
              <div className="flex items-start space-x-4 gap-3">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {t("service") || "Service"}
                  </h4>
                  <p className="text-lg font-medium mt-1">
                    {language === "en"
                      ? order.itemDto.itemNameEn
                      : order.itemDto.itemNameAr}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {language === "en"
                      ? order.itemDto.serviceTypeEn
                      : order.itemDto.serviceTypeAr}
                  </p>
                </div>
              </div>

              {/* Customer Section */}
              <div className="flex items-start space-x-4 gap-3">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {t("customer") || "Customer"}
                  </h4>
                  <p className="text-lg font-medium mt-1">
                    {language === "en" ? order.userNameEn : order.userNameAr}
                  </p>
                  <div
                    dir="ltr"
                    className="flex items-center justify-end gap-1 mt-2 text-gray-600"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{order.userPhoneNumber}</span>
                  </div>
                </div>
              </div>

              {/* DateTime Section */}
              <div className="flex items-start space-x-4 gap-3">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Clock3 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {t("dateTime") || "Date & Time"}
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {format(
                          new Date(order.reservationDate),
                          "MMMM dd, yyyy"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {order.fromTime} - {order.timeTo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="flex items-start space-x-4 gap-3">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <MapPinned className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="flex-1 ">
                  <h4 className="font-semibold text-gray-900">
                    {t("location") || "Location"}
                  </h4>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="underline">
                      {t("viewOnMap") || "View on Map"}
                    </span>
                  </a>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="flex items-start space-x-4 gap-3">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <CreditCard className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {t("pricing") || "Pricing"}
                  </h4>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>{t("servicePrice") || "Service Price"}</span>
                      <span>{order.itemDto.itemPrice} SAR</span>
                    </div>
                    {order.itemDto.itemExtraDtos &&
                      order.itemDto.itemExtraDtos.length > 0 && (
                        <>
                          <div className="h-px bg-gray-200 my-2" />
                          <p className="font-medium text-gray-900">
                            {t("extraServices") || "Extra Services"}:
                          </p>
                          {order.itemDto.itemExtraDtos.map((extra, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-gray-600 pl-4"
                            >
                              <span>
                                {language === "en"
                                  ? extra.itemExtraNameEn
                                  : extra.itemExtraNameAr}
                              </span>
                              <span>{extra.itemExtraPrice} SAR</span>
                            </div>
                          ))}
                        </>
                      )}
                    <div className="h-px bg-gray-200 my-2" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>{t("totalAmount") || "Total Amount"}</span>
                      <span>{order.totalAmount} SAR</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="flex justify-between items-center max-[420px]:flex-col max-sm:gap-5">
                <div className="flex items-start space-x-4 gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {t("status") || "Status"}
                    </h4>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusVariant(
                        order.request.statusName
                      )}`}
                    >
                      {language === "en"
                        ? formatStatus(order.request.statusName)
                        : order.request.statusName}
                    </span>
                  </div>
                </div>
                {!isClosed || order.request.statusName === "WAITING" ? (
                  <div className="flex gap-5">
                    <div>
                      {order.request.statusName === "WAITING" && (
                        <button
                          disabled={loading}
                          onClick={() => handleAcceptOrder(order.request.id)}
                          className="disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-red-500 px-7 py-1.5 text-lg bg-green-600 text-white rounded-lg"
                        >
                          {t("accept")}
                        </button>
                      )}
                    </div>
                    <div>
                      <button
                        disabled={loading}
                        onClick={() => handleCancelOrder(order.request.id)}
                        className="disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-red-500 px-7 py-1.5 text-lg bg-red-600 text-white rounded-lg"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {order.request.statusName === "ACCEPTED" &&
                order.request.waitingProcessId === 2 ? (
                  <div>
                    <button
                      disabled={loading}
                      onClick={() => handleProceedOrder(order.request.id)}
                      className="disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-red-500 px-5 py-1.5 text-lg bg-green-600 text-white rounded-lg"
                    >
                      {t("proceedOrder")}
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {order.request.statusName === "UNDER_PROCESSING" &&
                order.request.waitingProcessId === 2 ? (
                  <div>
                    <button
                      disabled={loading}
                      onClick={() => handleCompleteOrder(order.request.id)}
                      className="disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-red-500  px-7 py-1.5 text-lg bg-green-600 text-white rounded-lg"
                    >
                      {t("completeOrder")}
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderModal;
