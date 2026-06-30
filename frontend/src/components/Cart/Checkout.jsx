import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PayPalButton from "../Cart/PayPalButton";
import { PayPalCardFieldsContext } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import { axiosInstance } from "../../utils/axios";
import { hiRes } from "../../utils/imageUrl";
import { Reveal } from "../Common/Reveal";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Redirect to home if the cart is empty
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "Paypal",
          totalPrice: cart.totalPrice,
        })
      );
      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id); // Set checkout ID if checkout was successful
      } else {
        toast.error(
          res.payload?.message || "Could not start checkout. Please try again."
        );
      }
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      await axiosInstance.put(`/checkout/${checkoutId}/pay`, {
        paymentStatus: "paid",
        paymentDetails: details,
      });

      await handleFinalizeCheckout(checkoutId); // Finalize checkout if payment is successful
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "We couldn't confirm your payment. Please contact support."
      );
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      await axiosInstance.post(`/checkout/${checkoutId}/finalize`, {});
      navigate("/order-confirmation");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong finalizing your order."
      );
    }
  };

  if (loading) return <p> Loading Cart...</p>;
  if (error) return <p> Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <p>
        Your cart is empty. Please add items to your cart before proceeding to
        checkout.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-12 px-4 lg:px-6">
      {/* Left Section */}
      <Reveal
        direction="up"
        className="bg-white rounded-xl border border-ink/10 shadow-[var(--shadow-card)] p-6 lg:p-8"
      >
        <h2 className="font-display text-3xl font-semibold mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-stone mb-4">
            Contact Details
          </h3>

          {/* Email */}
          <div className="mb-4">
            <label className="label-field">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="input-field disabled:opacity-70"
              disabled
            />
          </div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-stone mb-4">
            Delivery
          </h3>

          {/* First and Last Name */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-field">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="label-field">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="input-field"
              required
            />
          </div>

          {/* City and Postal Code */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-field">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Country */}
          <div className="mb-4">
            <label className="label-field">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="input-field"
              required
            />
          </div>

          {/* Phone No. */}
          <div className="mb-4">
            <label className="label-field">Phone No.</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="input-field"
              required
            />
          </div>

          {/* Checkout Button */}
          <div className="mt-6">
            {!checkoutId ? (
              <button type="submit" className="btn-primary w-full">
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-stone mb-4">
                  Pay with PayPal
                </h3>
                {/* PayPal Component */}
                <PayPalButton
                  amount={cart.totalPrice?.toFixed(2)}
                  onSubmit={handlePaymentSuccess}
                  onError={() => toast.error("Payment failed, please try again")}
                />
              </div>
            )}
          </div>
        </form>
      </Reveal>

      {/* Right Section - Cart Summary */}
      <div className="bg-white border border-ink/8 shadow-[var(--shadow-card)] p-6 lg:p-8 rounded-xl h-fit lg:sticky lg:top-28">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-stone mb-4">
          Order Summary
        </h3>
        <div className="border-t border-ink/10 py-4 mb-4">
          {cart.products.map((product) => (
            <div
              key={`${product.productId}-${product.size}-${product.color}`}
              className="flex items-start justify-between py-2 border-b"
            >
              <div className="flex items-start">
                <img
                  src={hiRes(product.image, 240)}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4 rounded-md"
                />
                <div>
                  <h3 className="text-md">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Color: {product.color}</p>
                </div>
              </div>
              <p className="text-xl">${product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
