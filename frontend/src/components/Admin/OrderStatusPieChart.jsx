

// import {
//   Cell,
//   Legend,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip
// } from "recharts";

// // const COLORS = ["#ff3f6c", "#ff7a9a", "#9c27b0", "#ffc107", "#4caf50"];
// const COLORS = [
//   "#22c55e", // delivered - green
//   "#ef4444", // cancelled - red
//   "#f59e0b", // pending - orange
//   "#3b82f6", // shipped - blue
//   "#8b5cf6"  // returned - purple
// ];
// const renderLabel = ({ percent }) =>
//   `${(percent * 100).toFixed(0)}%`;

// const OrderStatusPieChart = ({ data }) => {
//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">

//       <div className="flex items-center justify-between mb-5">
//         <h2 className="text-lg font-semibold text-gray-800">
//           Order Status Distribution
//         </h2>
//       </div>

//       <ResponsiveContainer width="100%" height={320}>

//         <PieChart>

//           <Pie
//             data={data}
//             dataKey="count"
//             nameKey="status"
//             cx="50%"
//             cy="50%"
//             innerRadius={70}
//             outerRadius={110}
//             labelLine={false}
//             label={renderLabel}
//           >

//             {data?.map((entry, index) => (
//               <Cell
//                 key={index}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}

//           </Pie>

//           <Tooltip />

//           <Legend
//             verticalAlign="bottom"
//             height={36}
//             iconType="circle"
//           />

//         </PieChart>

//       </ResponsiveContainer>

//     </div>
//   );
// };

// export default OrderStatusPieChart;


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
    <div className="bg-white p-6 rounded-2xl shadow-lg">

      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Order Status Distribution
      </h2>

      <div className="flex items-center">

        {/* LEFT SIDE → PIE CHART */}
        <div className="w-2/2 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={data}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
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

        {/* RIGHT SIDE  CUSTOM LEGEND */}
        <div className="w-1/2 flex flex-col gap-3 pl-8">

          {data?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between  text-sm"
            >

              <div className="flex items-center gap-3">

                <span
                  className="w-7 h-7 rounded-full"
                  style={{
                    backgroundColor:
                      STATUS_COLORS[item.status] || "#9ca3af"
                  }}
                />

                <span className="text-gray-700 font-medium">
                  {item.status.replaceAll("_", " ")}
                </span>

              </div>

              <span className="font-semibold text-gray-800 ">
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
