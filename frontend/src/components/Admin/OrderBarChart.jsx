

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const OrdersBarChart = ({ data }) => {
  return (
    <div className="bg-bg-main p-6 rounded-2xl shadow-lg hover:shadow-xl transition">

      <h2 className="font-semibold text-lg mb-4 text-text-primary">
        Monthly Orders
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>

          {/* Gradient Color */}
          <defs>
           <linearGradient id="colorOrders" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stopColor="#ff3f6c" />
  <stop offset="100%" stopColor="#ff8c42" />
</linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          {/* X Axis */}
          <XAxis
            dataKey="month"
            tick={{ fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Y Axis */}
          <YAxis
            tick={{ fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          />

          {/* Legend */}
          <Legend />

          {/* Bar */}
          <Bar
            dataKey="orders"
            fill="url(#colorOrders)"
            radius={[10, 10, 0, 0]}
            barSize={40}
            animationDuration={1200}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersBarChart;



