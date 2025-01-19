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
  // Dummy data for recent orders
  const recentOrders = [
    {
      service: "Exterior Wash",
      customer: "Alice Johnson",
      status: "In Progress",
      extraServices: 0,
      amount: 50,
    },
    {
      service: "Interior Wash",
      customer: "Bob Smith",
      status: "Pending",
      extraServices: 1,
      amount: 100,
    },
    {
      service: "Car Polishing",
      customer: "Charlie Brown",
      status: "In Progress",
      extraServices: 2,
      amount: 190,
    },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium text-blue-950">Recent Orders</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-blue-950">Service</TableHead>
            <TableHead className="text-blue-950">Customer</TableHead>
            <TableHead className="text-blue-950">Status</TableHead>
            <TableHead className="text-blue-950">Extra Services</TableHead>
            <TableHead className="text-right text-blue-950">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-blue-950">
                {order.service}
              </TableCell>
              <TableCell className="text-blue-950">{order.customer}</TableCell>
              <TableCell className="text-blue-950">{order.status}</TableCell>
              <TableCell className="text-blue-950">
                {order.extraServices}
              </TableCell>
              <TableCell className="text-right text-blue-950">
                {order.amount} SAR
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="link" className="mt-4 text-blue-600 hover:text-blue-700">
        View all orders <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
