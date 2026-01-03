import { motion } from "framer-motion";
import { BannerData } from "./types";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  data: BannerData;
  index: number;
}

const ProductCard = ({ data, index }: ProductCardProps) => {
  const isLarge = data.size === "medium";
  const isDark = data.bgColor.includes("slate-900") || data.bgColor.includes("slate-800");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      className={`${data.bgColor} ${data.textColor} rounded-2xl overflow-hidden h-full flex flex-col justify-between p-6 shadow-lg cursor-pointer transition-all duration-300`}
    >
      {/* Content */}
      <div>
        {/* Brand */}
        {data.brand && (
          <div className="mb-2">
            <span className={`text-xs font-semibold ${isDark ? "text-white/60" : "text-light-gray"} uppercase tracking-wide`}>
              {data.brand}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className={`${isLarge ? "text-2xl md:text-3xl" : "text-xl"} font-bold mb-2 leading-tight`}>
          {data.title}
        </h3>

        {/* Subtitle */}
        {data.subtitle && (
          <p className={`text-sm ${isDark ? "text-white/70" : "text-light-gray"} mb-3`}>
            {data.subtitle}
          </p>
        )}

        {/* Price */}
        {data.price && (
          <div className="mb-4">
            {data.price.toLowerCase().includes("from") ? (
              <div>
                <span className={`text-xs ${isDark ? "text-white/60" : "text-light-gray"} uppercase`}>
                  FROM
                </span>
                <p className="text-3xl font-bold text-primary-green">
                  {data.price.replace(/from\s*/i, "")}
                </p>
              </div>
            ) : (
              <p className="text-lg font-semibold">
                from <span className="text-2xl text-primary-green">{data.price}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Image Placeholder */}
      <div className="relative h-32 mb-4 flex items-center justify-center">
        <div className={`w-24 h-24 ${isDark ? "bg-white/10" : "bg-slate-200"} rounded-lg`}></div>
      </div>

      {/* CTA */}
      <motion.a
        href={data.ctaLink}
        whileHover={{ x: 5 }}
        className={`inline-flex items-center gap-2 font-semibold text-sm ${
          isDark ? "text-white" : "text-dark-blue"
        } hover:gap-3 transition-all duration-300`}
      >
        {data.ctaText}
        <ArrowRight className="w-4 h-4" />
      </motion.a>
    </motion.div>
  );
};

export default ProductCard;
