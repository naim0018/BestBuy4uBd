import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useRedux";
import { logOut } from "@/store/Slices/AuthSlice/authSlice";
import UserAvatar from "@/ui/UserAvatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import NavItems from "./NavItems";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <nav className="bg-website-color-green shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-white text-2xl font-bold">
            MyApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavItems />
            <ThemeToggle />

            {/* User menu */}
            <div className="relative group">
              <UserAvatar userName="User" />
              <div className="absolute right-0 mt-2 hidden group-hover:block bg-website-color-darkGray rounded-md shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-white hover:bg-website-color-lightGray"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4">
          <NavItems
            className="flex flex-col gap-2"
            classNameNC="block px-3 py-2 rounded-md hover:bg-website-color-lightGreen"
            classNameC="block px-3 py-2 rounded-md hover:bg-website-color-lightGreen"
          />
          <div className="px-3 py-2">
            <ThemeToggle />
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-white rounded-md hover:bg-website-color-lightGray"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
