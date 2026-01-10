// CategorySidebarModal.tsx
import React from "react";

interface CategorySidebarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategorySidebarModal: React.FC<CategorySidebarModalProps> = ({
  isOpen,
  onClose,
}) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="relative w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="py-2">
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
    </div>
  );
};

export default CategorySidebarModal;
