import { motion } from "framer-motion";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/types/Product/Product";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/Slices/CartSlice";
import { openCart, openWishlist } from "@/store/Slices/UISlice";
import { addToWishlist, removeFromWishlist } from "@/store/Slices/wishlistSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const isWishlisted = wishlistItems.some(item => item._id === product._id);

  const { basicInfo, price, images, rating, stockStatus, additionalInfo } = product;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({
      id: product._id,
      name: basicInfo.title,
      price: price.discounted || price.regular,
      image: images[0]?.url,
      quantity: 1,
      selectedVariants: []
    }));
    
    dispatch(openCart());
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
      dispatch(openWishlist());
    }
  };

  const discountPercentage = price.discounted 
    ? Math.round(((price.regular - price.discounted) / price.regular) * 100)
    : 0;

  return (
    <Link to={`/product/${product._id}`} className="h-full block">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-primary-green/20 transition-all duration-500 h-full flex flex-col"
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-primary-red text-white uppercase tracking-wider shadow-lg">
              -{discountPercentage}%
            </span>
          )}
          {additionalInfo?.isFeatured && (
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-primary-blue text-white uppercase tracking-wider shadow-lg">
              Featured
            </span>
          )}
          {stockStatus === "Out of Stock" && (
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-500 text-white uppercase tracking-wider shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
            isWishlisted 
              ? "bg-primary-red text-white" 
              : "bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-primary-red hover:bg-white dark:hover:bg-slate-700"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Image Container */}
        <div className="relative h-56 mb-5 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/50 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors duration-500">
          <motion.img
            src={images[0]?.url || "https://via.placeholder.com/300"}
            alt={basicInfo.title}
            className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          />

          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 bg-black/10 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xl flex items-center justify-center hover:bg-primary-blue hover:text-white transition-all duration-300"
              title="Quick View"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              disabled={stockStatus === "Out of Stock"}
              className={`w-11 h-11 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
                stockStatus === "Out of Stock" 
                  ? "bg-slate-300 cursor-not-allowed text-slate-500" 
                  : "bg-primary-green text-white hover:bg-green-600"
              }`}
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-1">
          <div className="text-[10px] font-bold text-primary-green uppercase tracking-widest mb-1">
            {basicInfo.category}
          </div>
          
          <h3
            className="font-bold text-slate-800 dark:text-slate-100 mb-2 line-clamp-2 min-h-[48px] text-lg leading-tight group-hover:text-primary-green transition-colors duration-300"
            title={basicInfo.title}
          >
            {basicInfo.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-primary-yellow">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(rating?.average || 0)
                      ? "fill-current"
                      : "text-slate-200 dark:text-slate-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-slate-400">
              ({rating?.count || 0} reviews)
            </span>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div className="flex flex-col">
              {price.discounted ? (
                <>
                  <span className="text-xs text-slate-400 line-through font-medium">
                    ৳{price.regular.toLocaleString()}
                  </span>
                  <span className="text-xl font-extrabold text-primary-red">
                    ৳{price.discounted.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                  ৳{price.regular.toLocaleString()}
                </span>
              )}
            </div>

            <div className="text-right">
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                stockStatus === "In Stock" ? "bg-primary-green/10 text-primary-green" :
                stockStatus === "Pre-order" ? "bg-primary-yellow/10 text-primary-yellow" :
                "bg-primary-red/10 text-primary-red"
              }`}>
                {stockStatus}
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                {product.sold || 0} Sold
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
