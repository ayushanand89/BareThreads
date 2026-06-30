import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import { hiRes } from "../utils/imageUrl";
import { Reveal } from "../components/Common/Reveal";

const Badge = ({ ok, okText, noText, neutral }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${
      ok
        ? "bg-success/10 text-success"
        : neutral
        ? "bg-amber-100 text-amber-700"
        : "bg-danger/10 text-danger"
    }`}
  >
    {ok ? okText : noText}
  </span>
);

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading)
    return <p className="text-center py-20 text-stone">Loading...</p>;
  if (error)
    return <p className="text-center py-20 text-danger">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <Link
        to="/my-orders"
        className="inline-flex items-center gap-2 text-sm text-stone hover:text-ink transition-colors mb-6"
      >
        <HiOutlineArrowLeft className="h-4 w-4" /> Back to My Orders
      </Link>

      <Reveal>
        <p className="eyebrow mb-1.5">Order Details</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-8">
          Your Order
        </h2>
      </Reveal>

      {!orderDetails ? (
        <p className="text-stone">No order details found</p>
      ) : (
        <div className="bg-white rounded-2xl border border-ink/10 shadow-[var(--shadow-card)] overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 p-6 bg-sand/50 border-b border-ink/10">
            <div>
              <p className="text-xs uppercase tracking-wider text-stone mb-1">
                Order ID
              </p>
              <h3 className="font-medium text-ink break-all">
                #{orderDetails._id}
              </h3>
              <p className="text-stone text-sm mt-1">
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-wrap items-start gap-2">
              <Badge
                ok={orderDetails.isPaid}
                okText="Paid"
                noText="Pending Payment"
              />
              <Badge
                ok={orderDetails.isDelivered}
                okText="Delivered"
                noText="In Transit"
                neutral={!orderDetails.isDelivered}
              />
            </div>
          </div>

          {/* Payment / Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 border-b border-ink/10">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone mb-2">
                Payment
              </h4>
              <p className="text-ink text-sm">{orderDetails.paymentMethod}</p>
              <p className="text-sm mt-0.5">
                <span className="text-stone">Status: </span>
                <span className={orderDetails.isPaid ? "text-success" : "text-danger"}>
                  {orderDetails.isPaid ? "Paid" : "Unpaid"}
                </span>
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-stone mb-2">
                Shipping
              </h4>
              <p className="text-ink text-sm">{orderDetails.shippingMethod}</p>
              <p className="text-stone text-sm mt-0.5">
                {orderDetails.shippingAddress.city},{" "}
                {orderDetails.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="p-6 divide-y divide-ink/5">
            {orderDetails.orderItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 py-4 first:pt-0"
              >
                <img
                  src={hiRes(item.image, 200)}
                  alt={item.name}
                  className="w-14 h-16 object-cover rounded-lg bg-sand"
                />
                <Link
                  to={`/product/${item.productId}`}
                  className="flex-1 min-w-0 font-medium text-ink text-sm hover:text-accent transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                <div className="text-right shrink-0">
                  <p className="text-sm text-ink">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-xs text-stone">
                    ${item.price} × {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
