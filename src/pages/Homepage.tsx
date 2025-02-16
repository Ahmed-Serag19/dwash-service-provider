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
import { useTranslation } from "react-i18next";

const Homepage = () => {
  const { t } = useTranslation();
  const { data: orders, isLoading: ordersLoading } = useQuery("orders", () =>
    fetchOrders(1, 10, "pending")
  );
  const { data: services, isLoading: servicesLoading } = useQuery(
    "services",
    fetchServices
  );
  const { data: wallet, isLoading: walletLoading } = useQuery(
    "wallet",
    fetchWallet
  );
  const { data: timeSlots, isLoading: timeSlotsLoading } = useQuery(
    "timeSlots",
    fetchTimeSlots
  );
  const stats = [
    { label: t("totalOrders"), value: orders?.length ?? 0 },
    {
      label: t("activeServices"),
      value:
        services?.filter(
          (s: { servicesStatus: number }) => s.servicesStatus === 0
        ).length ?? 0,
    },
    { label: t("totalEarnings"), value: `${wallet?.balance ?? 0} SAR` },
    { label: t("timeSlots"), value: timeSlots?.length ?? 0 },
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
      <RecentActivity orders={orders ?? []} />
    </div>
  );
};

export default Homepage;
