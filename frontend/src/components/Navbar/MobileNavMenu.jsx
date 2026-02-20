import { useEffect, useState } from "react";
import { MdKeyboardArrowRight, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCategory } from "../../Redux/slices/admin/categorySlice";
const MobileNavbarMenu = ({ closeMenu }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const [openCategory, setOpenCategory] = useState(null); // Level 1
  const [openSubCategory, setOpenSubCategory] = useState(null); // Level 2

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  return (
    <div className="lg:hidden bg-white shadow w-64 h-screen fixed top-0 left-0 z-50 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold text-lg">Categories</h2>
        <button onClick={closeMenu} className="font-bold text-xl">
          X
        </button>
      </div>

      {/* Category List */}
      <div className="flex flex-col gap-1 p-4">
        {categories.map((level1) => (
          <div key={level1._id} className="">
            {/* Level 1 */}
            <div
              className="flex justify-between items-center py-2 cursor-pointer font-semibold uppercase"
              onClick={() =>
                setOpenCategory(openCategory === level1._id ? null : level1._id)
              }
            >
              <span>{level1.name}</span>
              <span>
                {openCategory === level1._id ? (
                  <MdOutlineKeyboardArrowDown className="w-5 h-5" />
                ) : (
                  <MdKeyboardArrowRight className="w-5 h-5" />
                )}
              </span>
            </div>

            {/* Level 2 */}
            {openCategory === level1._id &&
              level1.children.map((level2) => (
                <div key={level2._id} className="pl-4">
                  <div
                    className="flex justify-between items-center py-1 cursor-pointer font-medium text-gray-600"
                    onClick={() =>
                      setOpenSubCategory(
                        openSubCategory === level2._id ? null : level2._id
                      )
                    }
                  >
                    <span>
                       
                      
                      {level2.name}
                      </span>
                    <span>
                      {openSubCategory === level2._id ? (
                        <MdOutlineKeyboardArrowDown className="w-4 h-4" />
                      ) : (
                        <MdKeyboardArrowRight className="w-4 h-4" />
                      )}
                    </span>
                  </div>

                  {/* Level 3 */}
                  {openSubCategory === level2._id &&
                    level2.children.map((level3) => (
                      <Link
                        key={level3._id}
                        to={`/${level1.slug}/${level2.slug}/${level3.slug}`}
                        className="block py-1 pl-4 text-gray-700 hover:text-black"
                      >
                        {level3.name}
                      </Link>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>
    
    </div>
  );
};

export default MobileNavbarMenu;
