// import { useState } from "react";
// import { IoMdClose } from "react-icons/io";
// import CartContent from "../Cart/CartContent";
// import { useNavigate } from "react-router";

// const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
//   const navigate = useNavigate();
//   const handleCheckout = () => {
//     navigate("/checkout");
//   };

//   return (
//     <div
//       className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[28rem] h-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col z-50 ${
//         drawerOpen ? "translate-x-0" : "translate-x-full"
//       }`}
//     >
//       {/* Close Button */}
//       <div className="flex justify-end p-4">
//         <button onClick={toggleCartDrawer}>
//           <IoMdClose className="h-6 w-6 text-gray-600" />
//         </button>
//       </div>

//       {/* Cart contents with scrollable area  */}
//       <div className="flex-grow p-4 overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

//         {/* Component for Card Contents */}
//         <CartContent />
//       </div>

//       {/* Checkout Button fixed at the bottom */}
//       <div className="p-4 bg-white sticky bottom-0">
//         <button
//           onClick={handleCheckout}
//           className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
//         >
//           Checkout
//         </button>
//         <p className="text-sm tracking-tighter text-gray-500 mt-2">
//           Shipping, taxes and discount codes calculated at Checkout.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default CartDrawer;



import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const drawerRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        drawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target)
      ) {
        toggleCartDrawer();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drawerOpen, toggleCartDrawer]);

  const handleCheckout = () => {
    toggleCartDrawer(); // Close drawer before navigating
    navigate("/checkout");
  };

  return (
    <div
      ref={drawerRef}
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[28rem] h-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Cart contents with scrollable area  */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        <CartContent />
      </div>

      {/* Checkout Button fixed at the bottom */}
      <div className="p-4 bg-white sticky bottom-0">
        <button
          onClick={handleCheckout}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Checkout
        </button>
        <p className="text-sm tracking-tighter text-gray-500 mt-2">
          Shipping, taxes and discount codes calculated at Checkout.
        </p>
      </div>
    </div>
  );
};

export default CartDrawer;
