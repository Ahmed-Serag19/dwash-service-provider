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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Order } from "@/interface/interfaces";
import OrderModal from "@/components/OrderModal";
import { dummyClosedOrders, dummyOpenOrders } from "@/utils/dummyOrders";

// Mock API call - replace with actual API call when ready
const fetchOrders = async (status: "OPENNING" | "CLOSED") => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
  if (status === "OPENNING") {
    return { content: { data: dummyOpenOrders } };
  } else {
    return { content: { data: dummyClosedOrders } };
  }
};

export default function OrderList() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<"current" | "closed">("current");

  const {
    data: currentOrders,
    isLoading: isLoadingCurrent,
    error: errorCurrent,
  } = useQuery(["orders", "OPENNING"], () => fetchOrders("OPENNING"));
  const {
    data: closedOrders,
    isLoading: isLoadingClosed,
    error: errorClosed,
  } = useQuery(["orders", "CLOSED"], () => fetchOrders("CLOSED"));
  function renderOrderContent(
    isLoading: boolean,
    error: unknown,
    orders: Order[] | undefined,
    language: string
  ) {
    if (isLoading) return <div>{t("loading")}</div>;
    if (error) return <ErrorAlert message={t("failedToFetchOrders")} />;
    if (!orders || orders.length === 0)
      return <ErrorAlert message={t("noOrdersFound")} />;
    return <OrderTable orders={orders} language={language} />;
  }
  // const isLoading =
  //   activeTab === "current" ? isLoadingCurrent : isLoadingClosed;
  // const error = activeTab === "current" ? errorCurrent : errorClosed;
  // const orders =
  //   activeTab === "current"
  //     ? currentOrders?.content?.data
  //     : closedOrders?.content?.data;

  return (
    <Card className="w-full text-blue-950">
      <CardHeader>
        <CardTitle className="text-2xl">{t("orders")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "current" | "closed")}
          className="w-full"
        >
          <div className="flex justify-center py-10">
            <TabsList>
              <TabsTrigger value="current">{t("activeOrders")}</TabsTrigger>
              <TabsTrigger value="closed">{t("closedOrders")}</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="current">
            {renderOrderContent(
              isLoadingCurrent,
              errorCurrent,
              // @ts-expect-error
              currentOrders?.content?.data,
              i18n.language
            )}
          </TabsContent>
          <TabsContent value="closed">
            {renderOrderContent(
              isLoadingClosed,
              errorClosed,
              // @ts-expect-error
              closedOrders?.content?.data,
              i18n.language
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

function OrderTable({
  orders,
  language,
}: {
  orders: Order[];
  language: string;
}) {
  const { t, i18n } = useTranslation();
  return (
    <div className="overflow-auto min-h-[450px] text-blue-950">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className={`min-w-[75px] ${
                i18n.language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t("orderId")}
            </TableHead>
            <TableHead
              className={`min-w-[100px] ${
                i18n.language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t("service")}
            </TableHead>
            <TableHead
              className={`min-w-[100px] ${
                i18n.language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t("customer")}
            </TableHead>
            <TableHead
              className={`min-w-[150px] ${
                i18n.language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t("dateTime")}
            </TableHead>
            <TableHead
              className={`min-w-[100px] ${
                i18n.language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t("status")}
            </TableHead>
            <TableHead
              className={`min-w-[100px] ${
                i18n.language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t("price")}
            </TableHead>
            <TableHead
              className={`min-w-[100px] ${
                i18n.language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t("actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.invoiceId}>
              <TableCell
                className={`min-w-[75px] ${
                  i18n.language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {order.invoiceId}
              </TableCell>
              <TableCell
                className={`min-w-[100px] ${
                  i18n.language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {language === "en"
                  ? order.itemDto.itemNameEn
                  : order.itemDto.itemNameAr}
              </TableCell>
              <TableCell
                className={`min-w-[100px] ${
                  i18n.language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {language === "en" ? order.userNameEn : order.userNameAr}
              </TableCell>
              <TableCell
                className={`min-w-[100px] ${
                  i18n.language === "ar" ? "text-right" : "text-left"
                }`}
              >
                <div className="flex flex-col ">
                  <span
                    className={`flex items-center min-w-[150px] ${
                      i18n.language === "ar" ? "justify-end" : "justify-start"
                    } `}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(order.reservationDate), "MMM dd, yyyy")}
                  </span>
                  <span
                    className={`flex items-center ${
                      i18n.language === "ar" ? "justify-end" : "justify-start"
                    }  `}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {order.fromTime.split(":").slice(0, 2).join(":")} -{" "}
                    {order.timeTo.split(":").slice(0, 2).join(":")}{" "}
                  </span>
                </div>
              </TableCell>
              <TableCell
                className={`min-w-[100px] ${
                  i18n.language === "ar" ? "text-right" : "text-left"
                }`}
              >
                <Badge variant={getStatusVariant(order.request.statusName)}>
                  {language === "en"
                    ? formatStatus(order.request.statusName)
                    : order.request.statusName}
                </Badge>
              </TableCell>
              <TableCell
                className={`min-w-[100px] ${
                  i18n.language === "ar" ? "text-right" : "text-left"
                }`}
              >
                {order.totalAmount} SAR
              </TableCell>
              <TableCell
                className={`min-w-[100px] ${
                  i18n.language === "ar" ? "justify-end" : "justify-start"
                } flex `}
              >
                <OrderModal order={order} language={language} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
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
