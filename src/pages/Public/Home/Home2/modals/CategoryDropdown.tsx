// dropdowns/CategoryDropdown.tsx
import React from "react";

interface CategoryDropdownProps {
  onClose: () => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ onClose }) => {
  const categories = [
    { name: "SALE 40% OFF", isSale: true },
    { name: "Pregnant & Postpartum" },
    { name: "Milks & Foods" },
    { name: "Diapers & Wipes" },
    { name: "Infant" },
    { name: "Eat & Drink Supplies" },
    { name: "Baby Fashion" },
    { name: "Baby Out" },
    { name: "Toys & Study" },
    { name: "Stroller, Crib, Chair" },
    { name: "Washes & Bath" },
    { name: "Homewares" },
    { name: "Clearance" },
  ];

  return (
    <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Categories</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="py-2 max-h-96 overflow-y-auto">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
              cat.isSale ? "text-red-600 font-bold" : "text-gray-700"
            }`}
          >
            <span>{cat.name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
