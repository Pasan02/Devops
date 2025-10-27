interface StatsCardProps {
  title: string;
  count: number;
  icon: string;
  bgColor: string;
}

export default function StatsCard({ title, count, icon, bgColor }: StatsCardProps) {
  return (
    <div className={`bg-gradient-to-r ${bgColor} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold mt-2">{count}</p>
        </div>
        <div className="text-4xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
}
