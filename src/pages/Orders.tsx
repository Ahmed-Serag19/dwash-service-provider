import { useState } from "react";
import { useQuery } from "react-query";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Order } from "@/interface/interfaces";
import { RefactoredOrderModal } from "@/components/order-modal/RefactoredOrderModal";
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatModal } from "@/components/chat/ChatModal";
import { fetchOrders } from "@/utils/dashboardApi's";

// Define the status translations
const statusTranslations: { [key: string]: { en: string; ar: string } } = {
  WAITING: { en: "Waiting", ar: "في الانتظار" },
  COMPLETED: { en: "Completed", ar: "مكتمل" },
  COMPLETED_BY_ADMIN: { en: "Completed by Admin", ar: "مكتمل بواسطة الأدمن" },
  CANCELLED: { en: "Cancelled", ar: "ملغى" },
  CANCELLED_BY_ADMIN: { en: "Cancelled by Admin", ar: "ملغى بواسطة الأدمن" },
  REJECTED: { en: "Rejected", ar: "مرفوض" },
  ACCEPTED: { en: "Accepted", ar: "مقبول" },
};

export default function OrderList() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<"current" | "closed">("current");
  const [chatModal, setChatModal] = useState<{
    isOpen: boolean;
    requestId: number;
    customerName: string;
  }>({
    isOpen: false,
    requestId: 0,
    customerName: "",
  });

  const {
    data: currentOrders,
    isLoading: isLoadingCurrent,
    error: errorCurrent,
    refetch: refetchCurrentOrders,
  } = useQuery(["orders", "OPENNING"], () => fetchOrders(0, 10, "OPENNING"));

  const {
    data: closedOrders,
    isLoading: isLoadingClosed,
    error: errorClosed,
    refetch: refetchClosedOrders,
  } = useQuery(["orders", "CLOSED"], () => fetchOrders(0, 10, "CLOSED"));

  const handleOpenChat = (requestId: number, customerName: string) => {
    setChatModal({
      isOpen: true,
      requestId,
      customerName,
    });
  };

  const handleCloseChat = () => {
    setChatModal({
      isOpen: false,
      requestId: 0,
      customerName: "",
    });
  };

  return (
    <>
      <Card className="w-full text-blue-950">
        <CardHeader>
          <CardTitle className="text-2xl">{t("orders")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "current" | "closed")
            }
            className="w-full"
          >
            <div className="flex justify-center py-6">
              <TabsList>
                <TabsTrigger value="current">{t("activeOrders")}</TabsTrigger>
                <TabsTrigger value="closed">{t("closedOrders")}</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="current">
              {isLoadingCurrent ? (
                <p className="text-center text-gray-500">{t("loading")}</p>
              ) : errorCurrent ? (
                <ErrorAlert message={t("failedToFetchOrders")} />
              ) : currentOrders?.length ? (
                <OrderTable
                  orders={currentOrders}
                  language={i18n.language}
                  refetchCurrent={refetchCurrentOrders}
                  refetchClosed={refetchClosedOrders}
                  onOpenChat={handleOpenChat}
                />
              ) : (
                <ErrorAlert message={t("noOrdersFound")} />
              )}
            </TabsContent>

            <TabsContent value="closed">
              {isLoadingClosed ? (
                <p className="text-center text-gray-500">{t("loading")}</p>
              ) : errorClosed ? (
                <ErrorAlert message={t("failedToFetchOrders")} />
              ) : closedOrders?.length ? (
                <OrderTable
                  orders={closedOrders}
                  language={i18n.language}
                  refetchClosed={refetchClosedOrders}
                  refetchCurrent={refetchCurrentOrders}
                  onOpenChat={handleOpenChat}
                  isClosed={true}
                />
              ) : (
                <ErrorAlert message={t("noOrdersFound")} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModal.isOpen}
        onClose={handleCloseChat}
        requestId={chatModal.requestId}
        customerName={chatModal.customerName}
      />
    </>
  );
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <Alert variant="default" className="flex items-center justify-center">
      <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

function OrderTable({
  orders,
  language,
  refetchClosed,
  refetchCurrent,
  onOpenChat,
  isClosed,
}: {
  orders: Order[];
  language: string;
  refetchClosed: () => void;
  refetchCurrent: () => void;
  onOpenChat: (requestId: number, customerName: string) => void;
  isClosed?: boolean;
}) {
  const { t } = useTranslation();

  // Function to get the translated status
  const getTranslatedStatus = (status: string): string => {
    return statusTranslations[status]?.[language as "en" | "ar"] || status;
  };

  // Check if chat should be available (only for ACCEPTED orders)
  const isChatAvailable = (order: Order) => {
    return order.request.statusName === "ACCEPTED";
  };

  return (
    <div className="overflow-auto min-h-[450px] text-blue-950">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="min-w-[75px] text-center">
              {t("orderId")}
            </TableHead>
            <TableHead className="min-w-[150px] text-center">
              {t("service")}
            </TableHead>
            {!isClosed && (
              <>
                <TableHead className="min-w-[150px] text-center">
                  {t("customer")}
                </TableHead>
                <TableHead className="min-w-[180px] text-center">
                  {t("dateTime")}
                </TableHead>
              </>
            )}
            <TableHead className="min-w-[120px] text-center">
              {t("status")}
            </TableHead>
            <TableHead className="min-w-[120px] text-center">
              {t("price")}
            </TableHead>
            <TableHead className="min-w-[160px] text-center">
              {t("actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.invoiceId}
              className="border-b hover:bg-gray-50"
            >
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span>{order.invoiceId}</span>
                  {isChatAvailable(order) && (
                    <ChatButton
                      onClick={() =>
                        onOpenChat(
                          order.request.id,
                          language === "en"
                            ? order.userNameEn
                            : order.userNameAr
                        )
                      }
                    />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {language === "en"
                  ? order.itemDto.itemNameEn
                  : order.itemDto.itemNameAr}
              </TableCell>
              {!isClosed && (
                <>
                  <TableCell className="text-center">
                    {language === "en" ? order.userNameEn : order.userNameAr}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-600" />
                        {format(
                          new Date(order.reservationDate),
                          "MMM dd, yyyy"
                        )}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-600" />
                        {order?.fromTime
                          ?.split(":")
                          .slice(0, 2)
                          .join(":")} -{" "}
                        {order?.timeTo?.split(":").slice(0, 2).join(":")}
                      </span>
                    </div>
                  </TableCell>
                </>
              )}
              <TableCell className="text-center">
                <Badge variant={getStatusVariant(order.request.statusName)}>
                  {getTranslatedStatus(order.request.statusName)}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold text-center">
                {order.totalAmount.toFixed(2)} SAR
              </TableCell>
              <TableCell className="text-center">
                <RefactoredOrderModal
                  order={order}
                  language={language}
                  refetchCurrent={refetchCurrent}
                  refetchClosed={refetchClosed}
                  isClosed={isClosed}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "COMPLETED_BY_ADMIN":
      return "default";
    case "CANCELLED_BY_ADMIN":
      return "destructive";
    case "REJECTED":
      return "destructive";
    case "WAITING":
      return "secondary";
    case "ACCEPTED":
      return "outline";
    default:
      return "default";
  }
}
