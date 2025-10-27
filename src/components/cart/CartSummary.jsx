// src/components/Cart/CartSummary.jsx
import React from "react";

const CartSummary = ({ totalPrice, onClear, onCheckout }) => (
  <>
    <div className="text-right font-semibold text-lg mb-4">
      Total: ${totalPrice.toFixed(2)}
    </div>
    <div className="flex justify-between space-x-2">
      <button
        onClick={onClear}
        className="flex-1 bg-red-100 text-red-600 font-semibold py-2 rounded-lg hover:bg-red-200 text-sm"
      >
        Clear
      </button>
      <button
        onClick={onCheckout}
        className="flex-1 bg-green-100 text-green-700 font-semibold py-2 rounded-lg hover:bg-green-200 text-sm"
      >
        Checkout
      </button>
    </div>
  </>
);

export default CartSummary;

