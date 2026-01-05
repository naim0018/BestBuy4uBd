import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { removeFromWishlist } from "@/store/Slices/wishlistSlice";
import { addToCart } from "@/store/Slices/CartSlice";
import { openCart } from "@/store/Slices/UISlice";
import { Link } from "react-router-dom";

interface WishlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistSidebar = ({ isOpen, onClose }: WishlistSidebarProps) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);

  const handleMoveToCart = (item: any) => {
    dispatch(addToCart({
      id: item._id,
      name: item.basicInfo?.title || item.name,
      price: item.price?.discounted || item.price?.regular || item.price,
      image: item.images?.[0]?.url || item.image,
      quantity: 1,
      selectedVariants: []
    }));
    dispatch(removeFromWishlist(item._id));
    dispatch(openCart());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-red/10 rounded-2xl flex items-center justify-center text-primary-red">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Wishlist</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{wishlistItems.length} Favorite Items</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors group"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-primary-red transition-colors" />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <div key={item._id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl flex-shrink-0 p-2 border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                      <img 
                        src={item.images?.[0]?.url || item.image || "https://via.placeholder.com/100"} 
                        alt={item.basicInfo?.title || item.name} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 uppercase leading-tight">
                            {item.basicInfo?.title || item.name}
                          </h3>
                          <button 
                            onClick={() => dispatch(removeFromWishlist(item._id))}
                            className="text-slate-300 hover:text-primary-red transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-black text-primary-green mt-1">
                          ৳{(item.price?.discounted || item.price?.regular || item.price || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                         <button 
                            onClick={() => handleMoveToCart(item)}
                            className="text-[10px] font-black uppercase tracking-widest text-primary-green flex items-center gap-2 hover:bg-primary-green/5 px-3 py-1.5 rounded-lg transition-colors border border-primary-green/10"
                         >
                            <ShoppingCart className="w-3 h-3" />
                            Add to Cart
                         </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Heart className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tighter">Your wishlist is empty</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">Save items you love to find them later</p>
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-primary-red text-white rounded-2xl font-black shadow-xl shadow-primary-red/20 uppercase tracking-widest text-xs hover:translate-y-[-2px] active:translate-y-0 transition-all font-montserrat"
                  >
                    Explore Shop
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {wishlistItems.length > 0 && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                <Link 
                  to="/shop"
                  onClick={onClose}
                  className="w-full py-4 bg-primary-red text-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-center shadow-2xl shadow-primary-red/20 flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0 transition-all group"
                >
                  Continue Shopping
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistSidebar;
