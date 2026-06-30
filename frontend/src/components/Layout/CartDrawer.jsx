import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;
  const itemCount =
    cart?.products?.reduce((total, p) => total + p.quantity, 0) || 0;

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleCheckout = () => {
    toggleCartDrawer(); // Close drawer before navigating
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={toggleCartDrawer}
        className={`fixed inset-0 bg-ink/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 w-[88%] max-w-md h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col z-50 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-ink/10">
          <h2 className="font-heading text-lg font-semibold text-ink flex items-center gap-2">
            Your Cart
            {itemCount > 0 && (
              <span className="text-xs font-semibold bg-ink text-cream rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </h2>
          <button
            onClick={toggleCartDrawer}
            aria-label="Close cart"
            className="transition-transform hover:rotate-90 duration-300"
          >
            <IoMdClose className="h-6 w-6 text-charcoal hover:text-ink transition-colors" />
          </button>
        </div>

        {/* Cart contents with scrollable area */}
        <div className="flex-grow p-5 overflow-y-auto">
          {cart && cart?.products?.length > 0 ? (
            <CartContent cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-20 h-20 rounded-full bg-sand flex items-center justify-center mb-5">
                <HiOutlineShoppingBag className="h-9 w-9 text-stone" />
              </div>
              <p className="font-heading text-lg text-ink mb-1">
                Your cart is empty
              </p>
              <p className="text-stone text-sm mb-6">
                Add something you love to get started.
              </p>
              <button
                onClick={toggleCartDrawer}
                className="btn-outline py-2.5 px-6 text-sm"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Checkout Button fixed at the bottom */}
        {cart && cart?.products?.length > 0 && (
          <div className="p-5 bg-white border-t border-ink/10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-stone text-sm">Subtotal</span>
              <span className="font-heading font-semibold text-ink">
                ${cart.totalPrice?.toLocaleString()}
              </span>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full">
              Checkout
            </button>
            <p className="text-xs tracking-wide text-stone mt-2 text-center">
              Shipping &amp; taxes calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </>,
    document.body
  );
};

export default CartDrawer;
