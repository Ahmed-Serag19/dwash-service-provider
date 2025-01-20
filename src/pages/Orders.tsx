import React, { useState } from "react";
import { useQuery } from "react-query";
import { format } from "date-fns";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Order } from "@/interface/interfaces";
import { useTranslation } from "react-i18next";

// Dummy data for open orders
const dummyOpenOrders = [
  {
    invoiceId: 120,
    brandNameEn: "Nadia",
    userNameEn: "John Doe",
    userPhoneNumber: "0549976777",
    totalAmount: 650,
    fromTime: "16:35:20",
    timeTo: "17:35:20",
    reservationDate: "2024-11-19",
    latitude: "24.754280119964605",
    longitude: "46.70827533669625",
    request: {
      statusName: "WAITING",
    },
    itemDto: {
      itemNameEn: "Hair cut",
      itemNameAr: "قص شعر",
      serviceTypeEn: "Hair Service",
      serviceTypeAr: "خدمة شعر",
      itemPrice: 500,
      itemExtraDtos: [
        {
          itemExtraNameEn: "Short hair cut",
          itemExtraPrice: 150,
        },
      ],
    },
  },
  {
    invoiceId: 121,
    brandNameEn: "Nadia",
    userNameEn: "Jane Smith",
    userPhoneNumber: "0549976778",
    totalAmount: 900,
    fromTime: "14:00:00",
    timeTo: "15:30:00",
    reservationDate: "2024-11-20",
    latitude: "24.754280119964605",
    longitude: "46.70827533669625",
    request: {
      statusName: "ACCEPTED",
    },
    itemDto: {
      itemNameEn: "Full Makeup",
      itemNameAr: "مكياج كامل",
      serviceTypeEn: "Makeup Service",
      serviceTypeAr: "خدمة مكياج",
      itemPrice: 800,
      itemExtraDtos: [
        {
          itemExtraNameEn: "False lashes",
          itemExtraPrice: 100,
        },
      ],
    },
  },
];

// Dummy data for closed orders
const dummyClosedOrders = [
  {
    invoiceId: 118,
    brandNameEn: "Nadia",
    userNameEn: "Alice Johnson",
    userPhoneNumber: "0549976779",
    totalAmount: 500,
    fromTime: "10:00:00",
    timeTo: "11:00:00",
    reservationDate: "2024-11-15",
    latitude: "24.754280119964605",
    longitude: "46.70827533669625",
    request: {
      statusName: "COMPLETED",
    },
    itemDto: {
      itemNameEn: "Hair Styling",
      itemNameAr: "تصفيف الشعر",
      serviceTypeEn: "Hair Service",
      serviceTypeAr: "خدمة شعر",
      itemPrice: 500,
      itemExtraDtos: null,
    },
  },
  {
    invoiceId: 117,
    brandNameEn: "Nadia",
    userNameEn: "Bob Williams",
    userPhoneNumber: "0549976780",
    totalAmount: 750,
    fromTime: "13:00:00",
    timeTo: "14:30:00",
    reservationDate: "2024-11-14",
    latitude: "24.754280119964605",
    longitude: "46.70827533669625",
    request: {
      statusName: "CANCELLED_BY_ADMIN",
    },
    itemDto: {
      itemNameEn: "Bridal Makeup",
      itemNameAr: "مكياج عروس",
      serviceTypeEn: "Makeup Service",
      serviceTypeAr: "خدمة مكياج",
      itemPrice: 750,
      itemExtraDtos: null,
    },
  },
];

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

export default function Orders() {
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

  const isLoading =
    activeTab === "current" ? isLoadingCurrent : isLoadingClosed;
  const error = activeTab === "current" ? errorCurrent : errorClosed;
  const orders =
    activeTab === "current"
      ? currentOrders?.content?.data
      : closedOrders?.content?.data;

  return (
    <Card className="w-full min-h-96">
      <CardHeader>
        <CardTitle className="text-2xl text-blue-950">{t("orders")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "current" | "closed")}
          className="w-full"
          dir={i18n.language === "en" ? "ltr" : "rtl"}
        >
          <div className="py-10 flex justify-center">
            <TabsList>
              <TabsTrigger value="current">{t("activeOrders")}</TabsTrigger>
              <TabsTrigger value="closed">{t("closedOrders")}</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="current">
            {renderOrderContent(
              isLoadingCurrent,
              errorCurrent,
              currentOrders?.content?.data
            )}
          </TabsContent>
          <TabsContent value="closed">
            {renderOrderContent(
              isLoadingClosed,
              errorClosed,
              closedOrders?.content?.data
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function renderOrderContent(
  isLoading: boolean,
  error: any,
  orders: any[] | undefined
) {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="w-full  flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }
  if (error)
    return (
      <ErrorAlert message="Failed to fetch orders. Please try again later." />
    );
  if (!orders || orders.length === 0)
    return <ErrorAlert message="No orders found." />;
  return <OrderTable orders={orders} />;
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

function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.invoiceId}>
              <TableCell>{order.invoiceId}</TableCell>
              <TableCell>{order.itemDto.itemNameEn}</TableCell>
              <TableCell>{order.userNameEn}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(order.reservationDate), "MMM dd, yyyy")}
                  </span>
                  <span className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {order.fromTime} - {order.timeTo}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.request.statusName)}>
                  {formatStatus(order.request.statusName)}
                </Badge>
              </TableCell>
              <TableCell>{order.totalAmount} SAR</TableCell>
              <TableCell>
                <OrderDetailsDialog order={order} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function OrderDetailsDialog({ order }: { order: Order }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Order #{order.invoiceId}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Service</h4>
              <p>
                {order.itemDto.itemNameEn} ({order.itemDto.itemNameAr})
              </p>
              <p className="text-sm text-gray-500">
                {order.itemDto.serviceTypeEn} ({order.itemDto.serviceTypeAr})
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Customer</h4>
              <p>{order.userNameEn}</p>
              <p className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                {order.userPhoneNumber}
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Date & Time</h4>
              <p className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(order.reservationDate), "MMMM dd, yyyy")}
              </p>
              <p className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {order.fromTime} - {order.timeTo}
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Location</h4>
              <p className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on Map
                </a>
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Pricing</h4>
              <p>Service Price: {order.itemDto.itemPrice} SAR</p>
              {order.itemDto.itemExtraDtos &&
                order.itemDto.itemExtraDtos.length > 0 && (
                  <div>
                    <p className="font-medium">Extra Services:</p>
                    {order.itemDto.itemExtraDtos.map((extra, index) => (
                      <p key={index}>
                        {extra.itemExtraNameEn}: {extra.itemExtraPrice} SAR
                      </p>
                    ))}
                  </div>
                )}
              <p className="font-semibold mt-2">
                Total Amount: {order.totalAmount} SAR
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Status</h4>
              <Badge variant={getStatusVariant(order.request.statusName)}>
                {formatStatus(order.request.statusName)}
              </Badge>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
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
      return "default";
    default:
      return "default";
  }
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}
