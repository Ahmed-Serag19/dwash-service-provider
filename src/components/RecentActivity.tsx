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
import { Link } from "react-router-dom";

interface Service {
  customer: React.ReactNode | Iterable<React.ReactNode>;
  statusAr: React.ReactNode | Iterable<React.ReactNode>;
  customerAr: React.ReactNode | Iterable<React.ReactNode>;
  status: React.ReactNode | Iterable<React.ReactNode>;
  serviceId: number;
  servicesNameEn: string;
  servicesNameAr: string;
  servicesPrice: number;
  extraServices: { extraPrice: number }[];
}

interface RecentActivityProps {
  orders: Service[] | undefined; // Adjusted to handle undefined state
}

export default function RecentActivity({ orders }: RecentActivityProps) {
  const { t, i18n } = useTranslation();

  // Check if orders is defined and not empty
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-blue-950">
          {t("recentOrders")}
        </h3>
        <p>{t("noOrders")}</p>{" "}
        {/* Display a message when there are no orders */}
      </div>
    );
  }

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
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-blue-950">
                  {i18n.language === "en"
                    ? order.servicesNameEn
                    : order.servicesNameAr}
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
                  {order.extraServices ? order.extraServices.length : 0}
                </TableCell>
                <TableCell className="text-right text-blue-950">
                  {order.servicesPrice} SAR
                  <div className="lg:hidden text-sm text-blue-700">
                    {order.extraServices ? order.extraServices.length : 0} extra
                    services
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Link to="/orders">
        <Button
          variant="link"
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          {t("viewOrders")} <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
