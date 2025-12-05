import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarComp({ data, title }) {
  return (
    <div className="duration-700 w-full flex flex-col gap-4 bg-white shadow-md rounded-xl p-5">
      <p className="mb-[10px] text-lg font-semibold">{title}</p>

      <div className="w-full h-[300px] sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="oklch(54.6% 0.245 262.881)"
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
