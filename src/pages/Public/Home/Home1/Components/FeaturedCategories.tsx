import { motion } from "framer-motion";
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Smartphones",
    icon: Smartphone,
    color: "from-primary-blue to-primary-cyan",
    count: "500+",
  },
  {
    id: 2,
    name: "Laptops",
    icon: Laptop,
    color: "from-primary-purple to-primary-purple-new",
    count: "300+",
  },
  {
    id: 3,
    name: "Audio",
    icon: Headphones,
    color: "from-primary-green to-primary-cyan",
    count: "400+",
  },
  {
    id: 4,
    name: "Wearables",
    icon: Watch,
    color: "from-primary-orange to-primary-yellow",
    count: "250+",
  },
  {
    id: 5,
    name: "Cameras",
    icon: Camera,
    color: "from-primary-red to-primary-orange",
    count: "180+",
  },
  {
    id: 6,
    name: "Gaming",
    icon: Gamepad2,
    color: "from-primary-purple-new to-primary-cyan",
    count: "350+",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-light-gray text-lg max-w-2xl mx-auto">
            Explore our curated collections of premium products across multiple
            categories
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    {/* Icon with Gradient */}
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                    </motion.div>

                    {/* Category Name */}
                    <h3 className="text-2xl font-bold text-dark-blue">
                      {category.name}
                    </h3>

                    {/* Product Count */}
                    <p className="text-light-gray font-medium">
                      {category.count} Products
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
                    className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${category.color} opacity-10 rounded-bl-full`}
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
