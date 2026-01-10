// Header.tsx
import React, { useState } from "react";
import CategoryDropdown from "../modals/CategoryDropdown";
import CurrencyDropdown from "../modals/CurrencyDropdown";
import LanguageDropdown from "../modals/LanguageDropdown";

// Dropdown Components

const Header: React.FC = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <header className="bg-teal-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Logo + List Category Dropdown */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-teal-600 font-bold text-xl">S</span>
            </div>
            <div>
              <h1 className="font-bold text-sm">Swat</h1>
              <h2 className="text-xs">Babymall</h2>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-4 pr-10 py-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Right: Icons + Buttons */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <button className="p-2 bg-white rounded-full text-teal-600 hover:bg-teal-50 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 006.364 6.364L12 14.318l1.318 1.318a4.5 4.5 0 006.364-6.364L12 12l-1.318-1.318a4.5 4.5 0 00-6.364 6.364L12 14.318z"
              />
            </svg>
          </button>

          {/* Account */}
          <button className="flex items-center gap-1 px-3 py-2 bg-teal-700 rounded hover:bg-teal-800 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14a4 4 0 018 0m-8-8v8m0 0v8"
              />
            </svg>
            <span className="text-sm">
              WELCOME
              <br />
              LOG IN / REGISTER
            </span>
          </button>

          {/* Cart */}
          <button className="flex items-center gap-1 px-3 py-2 bg-teal-700 rounded hover:bg-teal-800 transition relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10v8a2 2 0 002 2H5a2 2 0 002-2v-8zm5-1a2 2 0 110-4 2 2 0 010 4z"
              />
            </svg>
            <span className="text-sm">
              CART
              <br />
              $1,689.00
            </span>
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* List Category Button + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center gap-1 px-3 py-2 bg-teal-700 rounded hover:bg-teal-800 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="text-sm">List Category</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${
                isCategoryOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isCategoryOpen && (
            <CategoryDropdown onClose={() => setIsCategoryOpen(false)} />
          )}
        </div>
        {/* end list category*/}
        {/* Bottom Row: Navigation + Info */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-3 pt-3 border-t border-teal-500">
          {/* Navigation Links */}
          <div className="flex space-x-4 text-sm">
            <a href="#" className="hover:underline">
              Homes
            </a>
            <a href="#" className="hover:underline">
              Pages
            </a>
            <a href="#" className="hover:underline">
              Products
            </a>
          </div>

          {/* Currency & Language */}
          <div className="flex items-center gap-4 text-sm">
            <span>Hotline 24/7</span>
            <span>(025) 3886 25 16</span>
            <CurrencyDropdown />
            <LanguageDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
