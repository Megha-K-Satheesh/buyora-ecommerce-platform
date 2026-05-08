


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

      <div className="min-h-screen bg-bg-main lg:mt-24 mt-1 sm:mt-6">

        <section className="my-6 ">
          {loading ? (
            <p className="text-center text-lg text-text-muted">
              Loading hero banners...
            </p>
          ) : heroBanners.length > 0 ? (
            <Slider {...heroSliderSettings}>
              {heroBanners.map((b) => (
                <div
                  key={b._id}
                  className="cursor-pointer"
                  onClick={() => navigate(b.redirectValue)}
                >
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-[300px] md:h-[450px] object-cover "
                  />

                  <div className="mt-4 text-center px-4">
                    <h2 className="text-2xl md:text-4xl font-semibold uppercase text-text-primary">
                      {b.title}
                    </h2>

                    <p className="text-text-muted mt-2 text-sm md:text-base">
                      {b.subtitle}
                    </p>

                    <button className="mt-3 text-text-secondary hover:text-text-primary">
                      + Explore
                    </button>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-text-muted">
              No hero banners available
            </p>
          )}
        </section>

        <section className="mt-30 ">
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-widest text-text-primary mb-10 border-l-4 border-primary pl-3 uppercase">
            Best Offers
          </h1>

          {promoBanners.length > 0 ? (
            <Slider key={`promo-${slidesToShow}`} {...sliderSettings}>
              {promoBanners.map((b) => (
                <div
                  key={b._id}
                  className="cursor-pointer px-2"
                  onClick={() => navigate(b.redirectValue)}
                >
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-[320px] object-cover rounded-lg"
                  />

                  <div className="text-center mt-3">
                    <h3 className="text-sm lg:text-lg font-bold text-text-primary">
                      {b.title}
                    </h3>

                    {b.discountText && (
                      <span className="text-xs lg:text-sm text-primary font-semibold">
                        {b.discountText}% OFF
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-text-muted">
              No promo banners available
            </p>
          )}
        </section>

        <section className="mt-30 ">
          <h1 className="text-xl lg:text-2xl font-extrabold tracking-widest text-text-primary mb-10 border-l-4 border-primary pl-3 uppercase">
            TRENDING NOW
          </h1>

          {treandingPromoBanners.length > 0 ? (
            <Slider key={`trend-${slidesToShow}`} {...sliderSettings}>
              {treandingPromoBanners.map((b) => (
                <div
                  key={b._id}
                  className="cursor-pointer px-2"
                  onClick={() => b.redirectValue && navigate(b.redirectValue)}
                >
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-[250px] object-cover rounded-lg"
                  />

                  <div className="text-center mt-3">
                    <h3 className="text-sm lg:text-lg font-bold text-text-primary">
                      {b.title}
                    </h3>

                    {b.discountText && (
                      <span className="text-xs lg:text-sm text-primary font-semibold">
                        {b.discountText}% OFF
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-text-muted">
              No watch banners available
            </p>
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
