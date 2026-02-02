import { motion } from "framer-motion";
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  Tv,
  Speaker,
  Tablet,
  Printer,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetAllCategoriesQuery } from "../../../../../../store/Api/CategoriesApi";

// Mapping for category icons and colors based on name keywords
const categoryConfig: Record<string, { icon: any; color: string }> = {
  smartphone: { icon: Smartphone, color: "from-primary-blue to-primary-cyan" },
  mobile: { icon: Smartphone, color: "from-primary-blue to-primary-cyan" },
  laptop: { icon: Laptop, color: "from-primary-purple to-primary-purple-new" },
  computer: {
    icon: Laptop,
    color: "from-primary-purple to-primary-purple-new",
  },
  audio: { icon: Headphones, color: "from-primary-green to-primary-cyan" },
  headphone: { icon: Headphones, color: "from-primary-green to-primary-cyan" },
  wearable: { icon: Watch, color: "from-primary-orange to-primary-yellow" },
  watch: { icon: Watch, color: "from-primary-orange to-primary-yellow" },
  camera: { icon: Camera, color: "from-primary-red to-primary-orange" },
  gaming: { icon: Gamepad2, color: "from-primary-purple-new to-primary-cyan" },
  game: { icon: Gamepad2, color: "from-primary-purple-new to-primary-cyan" },
  tv: { icon: Tv, color: "from-blue-500 to-indigo-500" },
  television: { icon: Tv, color: "from-blue-500 to-indigo-500" },
  speaker: { icon: Speaker, color: "from-emerald-400 to-teal-500" },
  tablet: { icon: Tablet, color: "from-pink-500 to-rose-500" },
  printer: { icon: Printer, color: "from-gray-600 to-gray-800" },
};

const getDefaultConfig = () => ({
  icon: ShoppingBag,
  color: "from-blue-400 to-indigo-500",
});

const getCategoryConfig = (name: string) => {
  const normalizedName = name.toLowerCase();
  for (const key in categoryConfig) {
    if (normalizedName.includes(key)) {
      return categoryConfig[key];
    }
  }
  return getDefaultConfig();
};

const FeaturedCategories = () => {
  const navigate = useNavigate();
  const {
    data: categoriesData,
    isLoading,
    isError,
  } = useGetAllCategoriesQuery({});
  const categories = categoriesData?.data || [];

  if (isError) {
    return null; // Or handle error gracefully
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-black text-[#0F172A] mb-4 text-center">
            <span className="text-secondary">Shop</span> by Category
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto uppercase tracking-widest text-xs font-medium">
            Explore our curated collections of premium products across multiple
            categories
          </p>
        </motion.div>

        {/* Categories Marquee */}
        <div 
          className="overflow-hidden relative pause-on-hover py-4"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          <div className="flex w-max animate-marquee gap-6">
            {isLoading
              ? Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-bg-base rounded-component p-6 border border-border-main shadow-lg animate-pulse w-[250px] flex-shrink-0"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-12 h-12 rounded-component bg-border-main/50" />
                      <div className="h-4 w-24 bg-border-main/50 rounded" />
                    </div>
                  </div>
                ))
              : [...categories, ...categories].map((category: any, index: number) => {
                  const { icon: Icon, color } = getCategoryConfig(category.name);
                  return (
                    <motion.div
                      key={`${category._id}-${index}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      whileHover={{
                        scale: 1.05,
                        y: -8,
                      }}
                      onClick={() => navigate(`/shop?category=${encodeURIComponent(category.name)}`)}
                      className="group cursor-pointer w-[250px] flex-shrink-0"
                    >
                      {/* Glassmorphic Card */}
                      <div className="relative bg-bg-surface rounded-component p-6 border border-border-main shadow-lg  transition-all duration-300 overflow-hidden">
                        {/* Gradient Background on Hover */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                        />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                          {/* Icon with Gradient */}
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className={`size-12 rounded-component bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                          >
                            <Icon
                              className="w-6 h-6 text-white"
                              strokeWidth={2}
                            />
                          </motion.div>

                          {/* Category Name */}
                          <h3 className="text-text-primary line-clamp-1 h6">
                            {category.name}
                          </h3>

                          {/* View Collection Label */}
                          <p className="small text-text-muted">View Collection</p>

                          {/* CTA Arrow */}
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={{ x: -10 }}
                            whileHover={{ x: 0 }}
                          >
                            <span className="text-[10px] font-semibold text-primary flex items-center gap-2 uppercase tracking-widest">
                              Explore
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </span>
                          </motion.div>
                        </div>

                        {/* Decorative Corner */}
                        <div
                          className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-full`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
