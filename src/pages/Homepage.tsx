import { useQuery } from "react-query";
import {
  fetchOrders,
  fetchServices,
  fetchWallet,
  fetchTimeSlots,
} from "@/utils/dashboardApi's";
import QuickActions from "@/components/QuickActions";
import StatsCard from "@/components/StatsCard";
import ReminderCard from "@/components/ReminderCard";
import RecentActivity from "@/components/RecentActivity";

const Homepage = () => {
  const { data: orders } = useQuery("orders", fetchOrders);
  const { data: services } = useQuery("services", fetchServices);
  const { data: wallet } = useQuery("wallet", fetchWallet);
  const { data: timeSlots } = useQuery("timeSlots", fetchTimeSlots);

  const stats = [
    { label: "Total Orders", value: orders?.length ?? 0 },
    {
      label: "Active Services",
      value: services?.filter((s) => s.servicesStatus === 1).length ?? 0,
    },
    { label: "Total Earnings", value: `${wallet?.balance ?? 5931} SAR` },
    { label: "Available Time Slots", value: timeSlots?.length ?? 0 },
  ];

  return (
    <div className="space-y-12 w-full">
      <QuickActions />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>
      <ReminderCard />
      <RecentActivity services={services ?? []} />
    </div>
  );
};

export default Homepage;
