
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const STATUS_COLORS = {
  DELIVERED: "#22c55e",
  PARTIALLY_DELIVERED: "#16a34a",

  CANCELLED: "#ef4444",
  PARTIALLY_CANCELLED: "#f87171",

  CONFIRMED: "#3b82f6",
  PLACED: "#6366f1",

  SHIPPED: "#0ea5e9",
  PARTIALLY_SHIPPED: "#38bdf8",

  RETURNED: "#8b5cf6",
  PARTIALLY_RETURNED: "#a855f7"
};

const renderLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;

const OrderStatusPieChart = ({ data }) => {
  return (
    <div className="bg-bg-main p-6 rounded-2xl shadow-lg">

      <h2 className="text-lg font-semibold text-text-primary mb-6">
        Order Status Distribution
      </h2>

      <div className="flex flex-col md:flex-row items-center">

        {/* PIE CHART */}
        <div className="w-full md:w-1/2 h-[260px] sm:h-[300px] md:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={50}   // smaller for mobile
                outerRadius={90}   // smaller for mobile
                labelLine={false}
                label={renderLabel}
              >
                {data?.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[entry.status] || "#9ca3af"}
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LEGEND */}
        <div className="w-full md:w-1/2 flex flex-col gap-3 mt-6 md:mt-0 md:pl-8">

          {data?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >

              <div className="flex items-center gap-3">

                <span
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 rounded-full"
                  style={{
                    backgroundColor:
                      STATUS_COLORS[item.status] || "#9ca3af"
                  }}
                />

                <span className="text-text-muted font-medium text-xs sm:text-sm md:text-base">
                  {item.status.replaceAll("_", " ")}
                </span>

              </div>

              <span className="font-semibold text-text-muted text-xs sm:text-sm md:text-base">
                {item.count}
              </span>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default OrderStatusPieChart;
