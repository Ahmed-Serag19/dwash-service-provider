import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";

interface Service {
  serviceId: number;
  servicesNameEn: string;
  servicesNameAr: string;
  servicesPrice: number;
  extraServices: { extraPrice: number }[];
}

interface RecentActivityProps {
  services: Service[];
}

export default function RecentActivity({ services }: RecentActivityProps) {
  const { t, i18n } = useTranslation();
  const recentOrders = [
    {
      service: "Exterior Wash",
      serviceAr: "غسيل خارجي",
      customer: "Alice Johnson",
      customerAr: "ماجد احمد",
      status: "In Progress",
      statusAr: "جاري",
      extraServices: 0,
      amount: 50,
    },
    {
      service: "Interior Wash",
      serviceAr: "غسيل داخلي",
      customer: "Bob Smith",
      customerAr: "مصطفى ياسر",
      status: "Pending",
      statusAr: "معلق",
      extraServices: 1,
      amount: 100,
    },
    {
      service: "Car Polishing",
      serviceAr: "تلميع السيارة",
      customer: "Charlie Brown",
      customerAr: "احمد الدوسري",
      status: "In Progress",
      statusAr: "جاري",
      extraServices: 2,
      amount: 190,
    },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium text-blue-950">
        {t("recentOrders")}
      </h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className={`text-blue-950 ${
                  i18n.language === "en" ? "text-left" : "text-right"
                }`}
              >
                {t("service")}
              </TableHead>
              <TableHead
                className={`text-blue-950 hidden sm:table-cell ${
                  i18n.language === "en" ? "text-left" : "text-right"
                }`}
              >
                {t("customer")}
              </TableHead>
              <TableHead
                className={`text-blue-950 hidden sm:table-cell ${
                  i18n.language === "en" ? "text-left" : "text-right"
                }`}
              >
                {t("status")}
              </TableHead>
              <TableHead
                className={`text-blue-950 hidden lg:table-cell  ${
                  i18n.language === "en" ? "text-left" : "text-right"
                }`}
              >
                {t("extraServices")}
              </TableHead>
              <TableHead
                className={`text-blue-950 ${
                  i18n.language === "en" ? "text-left" : "text-right"
                }`}
              >
                {t("price")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-blue-950">
                  {i18n.language === "en" ? order.service : order.serviceAr}
                  <div className="sm:hidden text-sm text-blue-700">
                    {i18n.language === "en" ? order.customer : order.customerAr}
                  </div>
                  <div className="md:hidden text-sm text-blue-600">
                    {i18n.language === "en" ? order.status : order.statusAr}
                  </div>
                </TableCell>
                <TableCell className="text-blue-950 hidden sm:table-cell">
                  {i18n.language === "en" ? order.customer : order.customerAr}
                </TableCell>
                <TableCell className="text-blue-950 hidden md:table-cell">
                  {i18n.language === "en" ? order.status : order.statusAr}
                </TableCell>
                <TableCell className="text-blue-950 hidden lg:table-cell">
                  {order.extraServices}
                </TableCell>
                <TableCell className="text-right text-blue-950">
                  {order.amount} SAR
                  <div className="lg:hidden text-sm text-blue-700">
                    {order.extraServices} extra services
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button variant="link" className="mt-4 text-blue-600 hover:text-blue-700">
        View all orders <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
