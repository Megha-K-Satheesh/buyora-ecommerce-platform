
import { useNavigate } from "react-router-dom";

const MobilePageWrapper = ({ title, children }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden">
      {/* Back header */}
      <div className="flex items-center h-14 px-4 border-b bg-white">
        <button
          className="text-xl font-bold"
          onClick={() => navigate("/account")} 
        >
          ⬅
        </button>
        <h2 className="ml-3 font-semibold">{title}</h2>
      </div>

      {/* Page content */}
      <div className="p-4">{children}</div>
    </div>
  );
};

export default MobilePageWrapper;
