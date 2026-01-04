import { motion } from "framer-motion";
import { BannerData } from "./types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroBannerProps {
  data: BannerData;
  currentSlide?: number;
  totalSlides?: number;
}

const HeroBanner = ({
  data,
  currentSlide = 3,
  totalSlides = 3,
}: HeroBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative ${data.bgColor} rounded-3xl overflow-hidden h-full min-h-[400px] flex items-center`}
    >
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 max-w-lg">
        {/* Title */}
        <h2
          className={`text-2xl md:text-4xl font-bold ${data.textColor} mb-3 leading-tight`}
        >
          {data.title}
        </h2>

        {/* Subtitle */}
        {data.subtitle && (
          <h3 className={`text-lg ${data.textColor} opacity-90 mb-4`}>
            {data.subtitle}
          </h3>
        )}

        {/* Features */}
        {data.features && (
          <ul className={`${data.textColor} opacity-80 mb-8 space-y-1`}>
            {data.features.map((feature, index) => (
              <li key={index} className="text-sm">
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* CTA Button */}
        <motion.a
          href={data.ctaLink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-white text-dark-blue px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {data.ctaText}
        </motion.a>
      </div>

      {/* Product Image Placeholder (Right side) */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:flex items-center justify-center">
        <div className="relative">
          {/* Headphone silhouette - placeholder */}
          <div className="w-64 h-64 bg-white/20 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-6 right-6 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-3">
        <button className="p-1 hover:bg-light-background rounded-full transition-colors">
          <ChevronLeft className="w-4 h-4 text-dark-blue" />
        </button>
        <span className="text-sm font-semibold text-dark-blue">
          {currentSlide} / {totalSlides}
        </span>
        <button className="p-1 hover:bg-light-background rounded-full transition-colors">
          <ChevronRight className="w-4 h-4 text-dark-blue" />
        </button>
      </div>
    </motion.div>
  );
};

export default HeroBanner;
