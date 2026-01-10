// dropdowns/LanguageDropdown.tsx
import React, { useState } from "react";

const LanguageDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: "Eng", flag: "🇺🇸" },
    { code: "Ar", flag: "🇸🇦" },
    { code: "Fr", flag: "🇫🇷" },
    { code: "Esp", flag: "🇪🇸" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1 bg-transparent border border-white rounded text-white hover:bg-white hover:text-teal-600 transition"
      >
        Eng
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
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

      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              onClick={() => {
                // Handle language change
                console.log("Selected:", lang.code);
                setIsOpen(false);
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
