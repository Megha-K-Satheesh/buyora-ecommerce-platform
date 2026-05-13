


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Footer from "../../components/ui/Footer";
import Navbar from "../../components/ui/Navbar";
import { getBannersUser } from "../../Redux/slices/admin/adminBannerSlice";
import { heroSliderSettings, promoSliderSettings } from "../../utils/sliderSettings";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { banners, loading } = useSelector((state) => state.banner);

  const [slidesToShow, setSlidesToShow] = useState(5);

  useEffect(() => {
    dispatch(getBannersUser({ page: "home" }));
  }, [dispatch]);

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;

      if (width <= 480) setSlidesToShow(2);
      else if (width <= 768) setSlidesToShow(2);
      else if (width <= 1024) setSlidesToShow(3);
      else if (width <= 1280) setSlidesToShow(4);
      else setSlidesToShow(5);
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);

    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }, [banners]);

  const heroBanners = banners.filter(
    (b) => b.type === "hero" && b.section === "home_slider" && b.isActive
  );

  const promoBanners = banners.filter(
    (b) => b.type === "promo" && b.section === "home_top" && b.isActive
  );

  const treandingPromoBanners = banners.filter(
    (b) => b.type === "promo" && b.section === "home_trending" && b.isActive
  );

  const sliderSettings = {
    ...promoSliderSettings,
    slidesToShow,
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-bg-main lg:mt-24 mt-6 sm:mt-10">

        {/* HERO SECTION */}
        <section className="px-3 sm:px-6 lg:px-10 py-6 sm:py-10">

          {loading ? (
            <div className="text-center text-text-muted py-20 text-sm">
              Loading featured collections...
            </div>
          ) : heroBanners.length > 0 ? (
            <Slider {...heroSliderSettings}>

              {heroBanners.map((b) => (
                <div
                  key={b._id}
                  className="cursor-pointer px-2"
                  onClick={() => navigate(b.redirectValue)}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-md border border-border-light">

                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-[260px] md:h-[460px] object-cover transition-transform duration-500 hover:scale-105"
                    />

      <div className="absolute inset-0    " />

                    
                  </div>

<div className="mt-5 text-center px-4">
                    <h2 className="text-2xl md:text-4xl font-semibold uppercase text-text-primary">
                     {b.title}
                    </h2>

                     <p className="text-text-muted mt-2 text-sm md:text-base">
                      {b.subtitle}
                    </p>

                    <button className="lg:mt-4 mt-2 lg:mb-2 text-text-secondary hover:text-text-primary">
                     + Explore
                  </button>
                 </div>
                </div>
              ))}

            </Slider>
          ) : (
            <div className="text-center text-text-muted py-20">
              No featured banners available
            </div>
          )}
        </section>

        {/* BEST OFFERS */}
        <section className="mt-10 px-3 sm:px-6 lg:px-10">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wide text-text-primary uppercase">
              Best Offers
            </h1>
          </div>

          {promoBanners.length > 0 ? (
            <Slider key={`promo-${slidesToShow}`} {...sliderSettings}>

              {promoBanners.map((b) => (
                <div
                  key={b._id}
                  className="cursor-pointer px-2"
                  onClick={() => navigate(b.redirectValue)}
                >
                  <div className="rounded-2xl overflow-hidden border border-border-light  shadow-sm hover:shadow-md transition">

                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-[300px] object-cover transition-transform duration-300 hover:scale-105"
                    />

                    <div className="p-3 text-center ">

                      <h3 className="text-sm lg:text-base font-semibold text-text-primary">
                        {b.title}
                      </h3>

                      {b.discountText && (
                        <span className="inline-block mt-1  px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                          {b.discountText}% OFF
                        </span>
                      )}

                    </div>

                  </div>
                </div>
              ))}

            </Slider>
          ) : (
            <div className="text-center text-text-muted py-10">
              No promo offers available
            </div>
          )}
        </section>

        {/* TRENDING */}
        <section className="mt-12 px-3 sm:px-6 lg:px-10 pb-10">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wide text-text-primary uppercase">
              Trending Now
            </h1>
          </div>

          {treandingPromoBanners.length > 0 ? (
            <Slider key={`trend-${slidesToShow}`} {...sliderSettings}>

              {treandingPromoBanners.map((b) => (
                <div
                  key={b._id}
                  className="cursor-pointer px-2"
                  onClick={() => b.redirectValue && navigate(b.redirectValue)}
                >
                  <div className="rounded-2xl overflow-hidden border border-border-light bg-bg-soft shadow-sm hover:shadow-md transition">

                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-[240px] object-cover transition-transform duration-300 hover:scale-105"
                    />

                    <div className="p-3 text-center">

                      <h3 className="text-sm lg:text-base font-semibold text-text-primary">
                        {b.title}
                      </h3>

                      {b.discountText && (
                        <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                          {b.discountText}% OFF
                        </span>
                      )}

                    </div>

                  </div>
                </div>
              ))}

            </Slider>
          ) : (
            <div className="text-center text-text-muted py-10">
              No trending items available
            </div>
          )}
        </section>

      </div>

      <footer className="mt-10">
        <Footer />
      </footer>
    </>
  );
};

export default Home;
