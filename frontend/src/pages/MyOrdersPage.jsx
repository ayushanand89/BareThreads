import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { Reveal } from "../components/Common/Reveal";

const MyOrdersPage = ({ embedded = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) return <p className="text-center py-20 text-stone">Loading...</p>;
  if (error)
    return <p className="text-center py-20 text-danger">Error: {error}</p>;

  return (
    <div
      className={embedded ? "" : "max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12"}
    >
      <Reveal>
        <p className="eyebrow mb-1.5">Your Account</p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-8">
          My Orders
        </h2>
      </Reveal>
      <Reveal
        delay={0.1}
        className="relative bg-white border border-ink/10 rounded-xl shadow-[var(--shadow-card)] overflow-x-auto hide-scrollbar"
      >
        <table className="min-w-full text-left text-stone">
          <thead className="bg-sand/70 text-[11px] uppercase tracking-wider text-charcoal">
            <tr>
              <th className="py-2 px-4 sm:py-3">Image</th>
              <th className="py-2 px-4 sm:py-3">Order ID</th>
              <th className="py-2 px-4 sm:py-3">Created</th>
              <th className="py-2 px-4 sm:py-3">Shipping Address</th>
              <th className="py-2 px-4 sm:py-3">Items</th>
              <th className="py-2 px-4 sm:py-3">Price</th>
              <th className="py-2 px-4 sm:py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b border-ink/5 hover:bg-cream cursor-pointer transition-colors"
                >
                  {/* Image */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                    />
                  </td>

                  {/* Order ID */}
                  <td className="py-2 px-2 sm:py-4 font-medium text-ink whitespace-nowrap">
                    #{order._id}
                  </td>

                  {/* Created At */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>

                  {/* Shipping Address */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </td>

                  {/* Items */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order.orderItems.length}
                  </td>

                  {/* Price */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    ${order.totalPrice.toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <span
                      className={`${
                        order.isPaid
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      } px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-16 px-4 text-center">
                  <p className="font-heading text-ink mb-1">
                    No orders yet
                  </p>
                  <p className="text-stone text-sm mb-5">
                    When you place an order, it&apos;ll show up here.
                  </p>
                  <Link
                    to="/collections/all"
                    className="btn-primary py-2.5 px-6 text-sm"
                  >
                    Start Shopping
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
};

export default MyOrdersPage;
