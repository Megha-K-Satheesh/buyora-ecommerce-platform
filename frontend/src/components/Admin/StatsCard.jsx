


const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-11 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            {value}
          </h2>
        </div>

        <div className="text-4xl">
          {icon}
        </div>

      </div>

    </div>
  );
};

export default StatsCard;
