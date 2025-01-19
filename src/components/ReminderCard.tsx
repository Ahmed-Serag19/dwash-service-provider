import React from "react";

export default function ReminderCard() {
  // Dummy data for the reminder
  const reminder = {
    orderCount: 1,
    customerName: "John Doe",
    time: "2:00 PM",
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-medium text-blue-950 mb-2">
        Today's Reminder
      </h3>
      <p className="text-blue-950">
        You have {reminder.orderCount} order{reminder.orderCount > 1 ? "s" : ""}{" "}
        today with {reminder.customerName} at {reminder.time}.
      </p>
    </div>
  );
}
