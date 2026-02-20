import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCategory } from "../../Redux/slices/admin/categorySlice";


const NavbarMenu = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  return (
    <nav className="lg:mt-5   ">
      <div className="flex gap-8 px-10 py-4">
        {categories.map((level1) => (
          <div key={level1._id} className="relative group">
            
            {/* LEVEL 1 */}
            <span className="cursor-pointer font-semibold uppercase text-lg py-10">
              {level1.name}
            </span>

            {/* MEGA MENU */}
            <div className="absolute left-0 top-15 z-50 hidden w-[900px] bg-white shadow-xl group-hover:flex px-10 py-8 gap-12">
              {level1.children.map((level2) => (
                <div key={level2._id} className="min-w-[180px]">

                  {/* LEVEL 2  */}
                  <Link
                    to={`/${level1.slug}/${level2.slug}`}
                    className="block mb-2 font-semibold text-pink-600 hover:text-pink-700"
                  >
                    {level2.name}
                  </Link>

                  {/* LEVEL 3 */}
                  <div className="flex flex-col gap-1">
                    {level2.children.map((level3) => (
                      <Link
                        key={level3._id}
                        to={`/${level1.slug}/${level2.slug}/${level3.slug}`}
                        className="text-sm text-gray-700 hover:text-black"
                      >
                        {level3.name}
                      </Link>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavbarMenu;

