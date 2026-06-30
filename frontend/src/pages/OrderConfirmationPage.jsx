import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { HiCheck, HiOutlineArrowRight } from "react-icons/hi2";
import { clearCart } from "../redux/slices/cartSlice";
import { hiRes } from "../utils/imageUrl";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const total = checkout?.checkoutItems?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-14">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6 animate-scale-in">
          <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center">
            <HiCheck className="h-8 w-8 text-white" />
          </div>
        </div>
        <p className="eyebrow mb-2">Order Confirmed</p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-3">
          Thank you for your order
        </h1>
        <p className="text-stone">
          We're getting it ready. A confirmation has been sent to your email.
        </p>
      </div>

      {checkout && (
        <div className="bg-white rounded-2xl border border-ink/10 shadow-[var(--shadow-card)] overflow-hidden animate-fade-up">
          {/* Order meta */}
          <div className="flex flex-wrap gap-4 justify-between p-6 bg-sand/50 border-b border-ink/10">
            <div>
              <p className="text-xs uppercase tracking-wider text-stone mb-1">
                Order ID
              </p>
              <p className="font-medium text-ink text-sm break-all">
                #{checkout._id}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-stone mb-1">
                Order Date
              </p>
              <p className="font-medium text-ink text-sm">
                {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-stone mb-1">
                Est. Delivery
              </p>
              <p className="font-medium text-success text-sm">
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="p-6 divide-y divide-ink/5">
            {checkout.checkoutItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <img
                  src={hiRes(item.image, 200)}
                  alt={item.name}
                  className="w-16 h-20 object-cover rounded-lg bg-sand"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-ink text-sm leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-xs text-stone mt-0.5">
                    {item.color} · {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-ink text-sm">
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="px-6 pb-6">
            <div className="flex justify-between items-center pt-4 border-t border-ink/10">
              <span className="font-heading font-semibold text-ink">Total</span>
              <span className="font-display text-2xl font-semibold text-ink">
                ${total?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment & delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-cream/60 border-t border-ink/10">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone mb-2">
                Payment
              </h4>
              <p className="text-ink text-sm">PayPal</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone mb-2">
                Delivery Address
              </h4>
              <p className="text-ink text-sm">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-ink text-sm">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        <Link to="/my-orders" className="btn-outline">
          View My Orders
        </Link>
        <Link to="/collections/all" className="btn-primary group">
          Continue Shopping
          <HiOutlineArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
