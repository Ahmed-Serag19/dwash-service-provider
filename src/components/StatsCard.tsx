interface StatsCardProps {
  label: string;
  value: string | number;
}

export default function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-medium text-blue-950">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-blue-950">{value}</div>
    </div>
  );
}
