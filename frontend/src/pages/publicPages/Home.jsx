




import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Footer from '../../components/ui/Footer';

import Navbar from "../../components/ui/Navbar";
import { heroSliderSettings, promoSliderSettings } from "../../utils/sliderSettings";
import { getBannersUser } from "../../Redux/slices/admin/adminBannerSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { banners, loading } = useSelector((state) => state.banner);

  useEffect(() => {
    dispatch(getBannersUser({ page: "home" }));
  }, [dispatch]);

  const heroBanners = banners.filter(
    (b) => b.type === "hero" && b.section === "home_slider" && b.isActive
  );

  const promoBanners = banners.filter(
    (b) => b.type === "promo" && b.section === "home_top" && b.isActive
  );
const treandingPromoBanners = banners.filter(
  (b) => b.type === "promo" && b.section === "home_trending" && b.isActive
);
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white mt-24">

        {/* HERO SECTION */}
        <section className="my-6 px-6">
          {loading ? (
            <p className="text-center text-lg">Loading hero banners...</p>
          ) : heroBanners.length > 0 ? (
            <Slider {...heroSliderSettings}>
              {heroBanners.map((b) => (
                <div
                  key={b._id}
                  className="cursor-pointer"
                  onClick={() => navigate(b.redirectValue)}
                >
                  <div className="flex w-full h-[400px] bg-white rounded-xl overflow-hidden">

                    <div className="w-3/4">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="w-1/4 flex flex-col justify-center px-12">
                      <h2 className="text-5xl font-medium uppercase">
                        {b.title}
                      </h2>

                      <p className="text-lg text-gray-500 mt-4">
                        {b.subtitle}
                      </p>

                      <div className="border-t my-6"></div>

                      <button className="text-left text-gray-500 hover:text-black">
                        + Explore
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-500">
              No hero banners available
            </p>
          )}
        </section>

        {/* PROMO SECTION */}
        <section className=" mt-30  px-6">
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-widest text-gray-900 mb-10 border-l-4 border-pink-500 pl-3 uppercase">
            Best Offers
          </h1>

          {promoBanners.length > 0 ? (
            <div className="w-full mt-20">
              <Slider {...promoSliderSettings}>
                {Array.from({
                  length: Math.ceil(promoBanners.length / 5),
                }).map((_, groupIndex) => {
                  const group = promoBanners.slice(
                    groupIndex * 5,
                    groupIndex * 5+ 5
                  );

                  return (
                    <div key={groupIndex} className="w-full">
                      <div className="grid grid-cols-2 md:grid-cols-5 ">
                        {group.map((b) => (
                          <div
                            key={b._id}
                            className="cursor-pointer group"
                            onClick={() => navigate(b.redirectValue)}
                          >
                            <div className="overflow-hidden ">
                              <img
                                src={b.image}
                                alt={b.title}
                                className="w-full h-115 object-cover "
                              />
                            </div>

                            <div className="text-center mt-3">
                              <h3 className="text-sm lg:text-lg font-bold">
                                {b.title}
                              </h3>

                              {b.discountText && (
                                <span className="text-xs lg:text-sm text-pink-500 font-semibold">
                                  {b.discountText}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No promo banners available
            </p>
          )}
        </section>
     


     {/* WATCHES SECTION */}
<section className="mt-30 px-6">
  <h1 className="text-xl lg:text-2xl font-extrabold tracking-widest text-gray-900 mb-10 border-l-4 border-blue-500 pl-3 uppercase">
  TRENDING NOW
  </h1>

  {treandingPromoBanners.length > 0 ? (
    <div className="w-full mt-20">
      <Slider {...promoSliderSettings}>
        {Array.from({
          length: Math.ceil(treandingPromoBanners.length / 5),
        }).map((_, groupIndex) => {
          const group = treandingPromoBanners.slice(
            groupIndex * 5,
            groupIndex * 5 + 5
          );

          return (
            <div key={groupIndex} className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-5">
                {group.map((b) => (
                  <div
                    key={b._id}
                    className="group cursor-pointer"
                    onClick={() => {
                      if (b.redirectValue) navigate(b.redirectValue);
                    }}
                  >
                    <div className="overflow-hidden">
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    <div className="text-center mt-3">
                      <h3 className="text-sm lg:text-lg font-bold">
                        {b.title}
                      </h3>

                      {b.discountText && (
                        <span className="text-xs lg:text-sm text-blue-500 font-semibold">
                          {b.discountText}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  ) : (
    <p className="text-center text-gray-500">
      No watch banners available
    </p>
  )}
</section>

      </div>
      <footer className="mt-10">

      <Footer/>
      </footer>
    </>
  );
};

export default Home;






