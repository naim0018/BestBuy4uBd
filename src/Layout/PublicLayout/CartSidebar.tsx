import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { removeFromCart, incrementQuantity, decrementQuantity } from "@/store/Slices/CartSlice";
import { Link } from "react-router-dom";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
                <div className="w-12 h-12 bg-primary-green/10 rounded-2xl flex items-center justify-center text-primary-green">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Your Cart</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{cartItems.length} Items</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors group"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-primary-red transition-colors" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.itemKey} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl flex-shrink-0 p-2 border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2 uppercase leading-tight">{item.name}</h3>
                          <button 
                            onClick={() => dispatch(removeFromCart({ itemKey: item.itemKey }))}
                            className="text-slate-300 hover:text-primary-red transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.selectedVariants && item.selectedVariants.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedVariants.map((v: any, idx: number) => (
                              <span key={idx} className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {v.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                          <button 
                            onClick={() => dispatch(decrementQuantity({ itemKey: item.itemKey }))}
                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary-green transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-slate-800 dark:text-white">{item.quantity}</span>
                          <button 
                            onClick={() => dispatch(incrementQuantity({ itemKey: item.itemKey }))}
                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary-green transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm font-black text-primary-green">৳{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <ShoppingBag className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tighter">Your cart is empty</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">Looks like you haven't added anything yet</p>
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-primary-green text-white rounded-2xl font-black shadow-xl shadow-primary-green/20 uppercase tracking-widest text-xs hover:translate-y-[-2px] active:translate-y-0 transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Subtotal</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">৳{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Taxes and shipping calculated at checkout</p>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Link 
                    to="/cart"
                    onClick={onClose}
                    className="w-full py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-center shadow-lg hover:bg-slate-50 transition-all"
                  >
                    View Cart
                  </Link>
                  <Link 
                    to="/checkout"
                    onClick={onClose}
                    className="w-full py-4 bg-primary-green text-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-center shadow-2xl shadow-primary-green/20 flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0 transition-all group"
                  >
                    Checkout
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
