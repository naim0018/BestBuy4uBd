// modals/CartModal.tsx
import React from "react";

interface CartModalProps {
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const cartItems = [
    { id: 1, name: "Nutri 7-In-1 Formula", price: 400, qty: 1 },
    { id: 2, name: "Baby Stroller", price: 800, qty: 1 },
    { id: 3, name: "Diaper Pack", price: 489, qty: 1 },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Cart (3 items)</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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

        <div className="space-y-4 mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  ${item.price} x {item.qty}
                </p>
              </div>
              <span className="font-bold">${item.price * item.qty}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded transition-colors"
            onClick={() => alert("Proceeding to checkout...")}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
