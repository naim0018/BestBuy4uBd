import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  X,
  Phone,
  Globe,
  GitCompare,
  Shield,
  Truck,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavItems from "./NavItems";
import CartSidebar from "./CartSidebar";
import WishlistSidebar from "./WishlistSidebar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { toggleCart, closeCart, toggleWishlist, closeWishlist } from "@/store/Slices/UISlice";
import { logOut } from "@/store/Slices/AuthSlice/authSlice";
import UserMenuDropdown from "./UserMenuDropdown";

const Navbar = () => {
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { isCartOpen, isWishlistOpen } = useSelector((state: RootState) => state.ui);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { user } = useSelector((state: RootState) => state.auth);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-light-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm">
            {/* Left - Contact Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-dark-blue">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">
                  Hotline 24/7
                </span>
                <span className="font-semibold">(025) 3886 2516</span>
              </div>
            </div>

            {/* Right - Links & Settings */}
            <div className="flex items-center gap-4 text-light-gray">
              <a
                href="#"
                className="hover:text-primary-blue transition-colors hidden md:inline"
              >
                Sell on BestBuy
              </a>
              <a
                href="#"
                className="hover:text-primary-blue transition-colors hidden md:inline"
              >
                Order Track
              </a>

              {/* Currency Dropdown */}
              <button className="flex items-center gap-1 hover:text-primary-blue transition-colors">
                <span className="font-medium">USD</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Language Dropdown */}
              <button className="flex items-center gap-1 hover:text-primary-blue transition-colors">
                <Globe className="w-4 h-4" />
                <span className="font-medium">Eng</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <Link to="/" className="text-xl font-bold text-dark-blue hover:text-primary-green transition-colors">
                  BESTBUY4UBD
                </Link>
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <NavItems className="hidden lg:block" />

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Compare Button */}
              <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-light-background transition-colors">
                <GitCompare className="w-5 h-5 text-dark-blue" />
              </button>

              {/* Wishlist Button */}
              <button 
                onClick={() => dispatch(toggleWishlist())}
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-light-background transition-colors relative group"
              >
                <Heart className="w-5 h-5 text-dark-blue group-hover:text-primary-red transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-red text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* User Account */}
              {user?.email ? (
                <div className="relative group z-50">
                  <button className="hidden md:flex items-center gap-2 hover:text-primary-blue transition-colors">
                    <div className="w-10 h-10 bg-primary-green/10 rounded-full flex items-center justify-center border border-primary-green/20">
                      <User className="w-5 h-5 text-primary-green" />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-xs text-light-gray">
                        {user.role === 'admin' ? 'ADMIN' : 'HELLO,'}
                      </span>
                      <span className="text-sm font-semibold text-dark-blue max-w-[100px] truncate">
                        {user.email.split('@')[0]}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-light-gray group-hover:text-primary-blue transition-colors" />
                  </button>


                  {/* Dropdown Menu */}
                  <UserMenuDropdown user={user} />
                </div>
              ) : (
                <Link to="/login" className="hidden md:flex items-center gap-2 hover:text-primary-blue transition-colors">
                  <div className="w-10 h-10 bg-light-background rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-dark-blue" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs text-light-gray">WELCOME</span>
                    <span className="text-sm font-semibold text-dark-blue">
                      LOG IN / REGISTER
                    </span>
                  </div>
                </Link>
              )}

              {/* Cart */}
              <button 
                onClick={() => dispatch(toggleCart())}
                className="flex items-center gap-2 hover:text-primary-blue transition-colors group"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-light-background rounded-full flex items-center justify-center group-hover:bg-primary-green/10 transition-colors">
                    <ShoppingCart className="w-5 h-5 text-dark-blue group-hover:text-primary-green transition-colors" />
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-green text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-light-gray font-black uppercase tracking-widest">CART</span>
                  <span className="text-sm font-black text-dark-blue">
                    ৳{cartSubtotal.toLocaleString()}
                  </span>
                </div>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar & Trust Badges */}
      <div className="bg-primary-green">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between py-3 gap-4">
            {/* Search Section */}
            <div className="flex items-center w-full lg:w-auto lg:flex-1 lg:max-w-md border border-white rounded-full bg-white">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="w-full px-4 py-3 pr-12 outline-none text-sm text-dark-blue placeholder:text-light-gray"
                />
                <button className="absolute right-0 top-0 h-full px-4 hover:opacity-80 transition-opacity">
                  <Search className="w-5 h-5 text-dark-blue" />
                </button>
              </div>
              <div className="bg-white rounded-r-full pr-1">
                <div className="w-1"></div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="hidden lg:flex items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <span className="text-sm font-medium whitespace-nowrap">
                  FREE SHIPPING OVER $199
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                <span className="text-sm font-medium whitespace-nowrap">
                  30 DAYS MONEY BACK
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium whitespace-nowrap">
                  100% SECURE PAYMENT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <NavItems 
                isMobile={true} 
                onItemClick={() => setIsMobileMenuOpen(false)} 
              />
              <div className="pt-3 border-t border-border space-y-3">
                <button className="w-full text-left px-5 py-2 text-dark-blue hover:text-primary-blue transition-colors font-semibold">
                  Compare
                </button>
                <button 
                  onClick={() => { dispatch(toggleWishlist()); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-5 py-2 text-dark-blue hover:text-primary-blue transition-colors font-semibold flex items-center justify-between"
                >
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="bg-primary-red text-white text-[10px] px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </button>
                {user?.email ? (
                  <>
                     <Link
                      to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-left px-5 py-2 text-dark-blue hover:text-primary-blue transition-colors font-semibold"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(logOut());
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-5 py-2 text-danger hover:bg-red-50 transition-colors font-semibold"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                     onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left px-5 py-2 text-dark-blue hover:text-primary-blue transition-colors font-semibold"
                  >
                    Log In / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => dispatch(closeCart())} 
      />
      {/* Wishlist Sidebar */}
      <WishlistSidebar 
        isOpen={isWishlistOpen} 
        onClose={() => dispatch(closeWishlist())} 
      />
    </nav>
  );
};

export default Navbar;
