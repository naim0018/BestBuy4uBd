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
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
                <span className="text-xl font-bold text-dark-blue">
                  BESTBUY
                </span>
                <span className="text-xs text-light-gray font-medium">
                  TECH MART
                </span>
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:flex items-center gap-8">
              <NavItem label="HOMES" hasDropdown />
              <NavItem label="PAGES" hasDropdown />
              <NavItem label="PRODUCTS" hasDropdown />
              <NavItem label="CONTACT" />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Compare Button */}
              <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-light-background transition-colors">
                <GitCompare className="w-5 h-5 text-dark-blue" />
              </button>

              {/* Wishlist Button */}
              <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-light-background transition-colors">
                <Heart className="w-5 h-5 text-dark-blue" />
              </button>

              {/* User Account */}
              <button className="hidden md:flex items-center gap-2 hover:text-primary-blue transition-colors">
                <div className="w-10 h-10 bg-light-background rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-dark-blue" />
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xs text-light-gray">WELCOME</span>
                  <span className="text-sm font-semibold text-dark-blue">
                    LOG IN / REGISTER
                  </span>
                </div>
              </button>

              {/* Cart */}
              <button className="flex items-center gap-2 hover:text-primary-blue transition-colors">
                <div className="relative">
                  <div className="w-10 h-10 bg-light-background rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-dark-blue" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-green text-white text-xs font-bold rounded-full flex items-center justify-center">
                    3
                  </span>
                </div>
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-xs text-light-gray">CART</span>
                  <span className="text-sm font-bold text-dark-blue">
                    $1,689.00
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
            <div className="flex items-center w-full lg:w-auto lg:flex-1 lg:max-w-md">
              {/* Category Dropdown */}
              <button className="bg-white px-4 py-3 rounded-l-full flex items-center gap-2 border-r border-border whitespace-nowrap">
                <span className="text-sm font-medium text-dark-blue">
                  All Categories
                </span>
                <ChevronDown className="w-4 h-4 text-dark-blue" />
              </button>

              {/* Search Input */}
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

              {/* Search Button - Rounded End */}
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
              <MobileNavItem label="HOMES" />
              <MobileNavItem label="PAGES" />
              <MobileNavItem label="PRODUCTS" />
              <MobileNavItem label="CONTACT" />
              <div className="pt-3 border-t border-border space-y-3">
                <button className="w-full text-left py-2 text-dark-blue hover:text-primary-blue transition-colors">
                  Compare
                </button>
                <button className="w-full text-left py-2 text-dark-blue hover:text-primary-blue transition-colors">
                  Wishlist
                </button>
                <button className="w-full text-left py-2 text-dark-blue hover:text-primary-blue transition-colors">
                  Log In / Register
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Nav Item Component
const NavItem = ({
  label,
  hasDropdown = false,
}: {
  label: string;
  hasDropdown?: boolean;
}) => {
  return (
    <button className="flex items-center gap-1 text-sm font-semibold text-dark-blue hover:text-primary-blue transition-colors">
      {label}
      {hasDropdown && <ChevronDown className="w-4 h-4" />}
    </button>
  );
};

// Mobile Nav Item Component
const MobileNavItem = ({ label }: { label: string }) => {
  return (
    <button className="w-full text-left py-2 text-dark-blue hover:text-primary-blue transition-colors font-semibold">
      {label}
    </button>
  );
};

export default Navbar;
