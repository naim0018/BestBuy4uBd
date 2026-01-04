import { motion, AnimatePresence } from "framer-motion";
import { BannerData } from "./types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface HeroBannerProps {
  banners: BannerData[];
}

const HeroBanner = ({ banners }: HeroBannerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  const data = banners[currentSlide];

  return (
    <div
      className={`relative ${
        data.bgColor || "bg-gray-200"
      } rounded-3xl overflow-hidden h-full min-h-[400px] flex items-center transition-colors duration-500`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full absolute inset-0 flex items-center"
        >
          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 max-w-lg w-full">
            {/* Title */}
            <h2
              className={`text-2xl md:text-4xl font-bold ${
                data.textColor || "text-dark-blue"
              } mb-3 leading-tight`}
            >
              {data.title}
            </h2>

            {/* Subtitle */}
            {data.subtitle && (
              <h3
                className={`text-lg ${
                  data.textColor || "text-dark-blue"
                } opacity-90 mb-4`}
              >
                {data.subtitle}
              </h3>
            )}

            {/* Features (if mapped description contains commas or just show description) */}
            {data.description && (
              <p
                className={`${
                  data.textColor || "text-dark-blue"
                } opacity-80 mb-8`}
              >
                {data.description}
              </p>
            )}

            {/* CTA Button */}
            <motion.a
              href={data.ctaLink}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-dark-blue px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 no-underline"
            >
              {data.ctaText || "Shop Now"}
            </motion.a>
          </div>

          {/* Product Image (Right side) */}
          <div className="absolute right-0 top-0 bottom-0 w-full h-full hidden md:flex items-center justify-center pointer-events-none">
            <div className="relative w-full h-full flex items-center justify-center ">
              {data.image ? (
                <img
                  src={data.image}
                  alt={data.title}
                  className="h-full w-full object-cover drop-shadow-2xl"
                />
              ) : (
                <div className="w-64 h-64 bg-white/20 rounded-full blur-2xl"></div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination / Navigation */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 right-6 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-3 z-20">
          <button
            onClick={prevSlide}
            className="p-1 hover:bg-light-background rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-dark-blue" />
          </button>
          <span className="text-sm font-semibold text-dark-blue">
            {currentSlide + 1} / {banners.length}
          </span>
          <button
            onClick={nextSlide}
            className="p-1 hover:bg-light-background rounded-full transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-dark-blue" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
