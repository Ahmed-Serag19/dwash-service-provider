import { useTranslation } from "react-i18next";

export default function ReminderCard() {
  const { t } = useTranslation();
  const reminder = {
    orderCount: 1,
    customerName: "John Doe",
    time: "2:00 PM",
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-medium text-blue-950 mb-2">{t("title")}</h3>
      <p className="text-blue-950 text-sm sm:text-base hidden">
        {t("message", {
          count: reminder.orderCount,
          customerName: reminder.customerName,
          time: reminder.time,
        })}
      </p>
      <p className="text-blue-950 text-sm sm:text-base">لا يوجد طلبات بعد</p>
    </div>
  );
}
