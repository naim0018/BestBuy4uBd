import { motion } from "framer-motion";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { ProductData } from "./types";

interface ProductCardProps {
  product: ProductData;
  onOpen: (product: ProductData) => void;
}

const ProductCard = ({ product, onOpen }: ProductCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-green/20 transition-all duration-300 h-full flex flex-col"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.tag && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded text-white uppercase tracking-wider ${
            product.tag === 'NEW' ? 'bg-dark-blue' : 'bg-primary-red'
          }`}>
            {product.tag}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-primary-red hover:bg-primary-red/10 transition-colors">
        <Heart className="w-4 h-4" />
      </button>

      {/* Image Container */}
      <div className="relative h-48 mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-gray-50 group-hover:bg-white transition-colors">
        <motion.img
          src={product.image}
          alt={product.title}
          className="h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
             <motion.button
               onClick={() => onOpen(product)}
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               className="w-10 h-10 rounded-full bg-white text-dark-blue shadow-lg flex items-center justify-center hover:bg-dark-blue hover:text-white transition-colors"
               title="Quick View"
             >
                <Eye className="w-5 h-5" />
             </motion.button>
             <motion.button
               onClick={() => onOpen(product)} // For now, both open detailed modal
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               className="w-10 h-10 rounded-full bg-primary-green text-white shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors"
               title="Add to Cart"
             >
                <ShoppingCart className="w-5 h-5" />
             </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-dark-blue mb-1 line-clamp-2 min-h-[40px] group-hover:text-primary-green transition-colors" title={product.title}>
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
           <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                 <Star
                   key={i}
                   className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"}`}
                 />
              ))}
           </div>
           <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
           <div>
              {product.oldPrice && (
                 <span className="text-xs text-gray-400 line-through mr-2">
                    ${product.oldPrice.toFixed(0)}
                 </span>
              )}
              {product.discount && (
                 <span className="text-xs font-bold text-primary-red bg-primary-red/10 px-1 rounded">
                    {product.discount}% OFF
                 </span>
              )}
              <div className="text-lg font-bold text-dark-blue">
                 ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
           </div>

           <div className="flex flex-col items-end">
             <Heart className="w-4 h-4 text-gray-300 mb-1" /> {/* Just visual for now based on design */}
             <span className="text-[10px] text-gray-400">{product.purchases} Purchases</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
