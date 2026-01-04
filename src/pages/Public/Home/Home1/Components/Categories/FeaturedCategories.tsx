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
          <h2 className="mb-4">Shop by Category</h2>
          <p className="text-light-gray max-w-2xl mx-auto">
            Explore our curated collections of premium products across multiple
            categories
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {isLoading
            ? // Skeleton Loading
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-light-background rounded-2xl p-8 border border-border shadow-lg animate-pulse"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-200/50" />
                    <div className="h-4 w-24 bg-gray-200/50 rounded" />
                    <div className="h-3 w-16 bg-gray-200/50 rounded" />
                  </div>
                </div>
              ))
            : categories.map((category: any) => {
                const { icon: Icon, color } = getCategoryConfig(category.name);
                return (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    whileHover={{
                      scale: 1.05,
                      y: -8,
                    }}
                    className="group cursor-pointer"
                  >
                    {/* Glassmorphic Card */}
                    <div className="relative bg-light-background rounded-2xl p-8 border border-border shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
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
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
                        >
                          <Icon
                            className="w-8 h-8 text-white"
                            strokeWidth={2}
                          />
                        </motion.div>

                        {/* Category Name */}
                        <h3 className="text-dark-blue line-clamp-1">
                          {category.name}
                        </h3>

                        {/* View Collection Label (Replaces Count) */}
                        <p className="text-light-gray font-medium text-sm">
                          View Collection
                        </p>

                        {/* CTA Arrow */}
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}
                        >
                          <span className="text-sm font-semibold text-primary-blue flex items-center gap-2">
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
    </section>
  );
};

export default FeaturedCategories;
