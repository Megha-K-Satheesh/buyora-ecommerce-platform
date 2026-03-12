

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const COLORS = ["#ff3f6c", "#ff7a9a", "#9c27b0", "#ffc107", "#4caf50"];

const renderLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;

const OrderStatusPieChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Order Status Distribution
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={320}>

        <PieChart>

          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            labelLine={false}
            label={renderLabel}
          >

            {data?.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>

          <Tooltip />

          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
          />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
};

export default OrderStatusPieChart;
