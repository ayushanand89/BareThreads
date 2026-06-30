import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../redux/slices/adminOrderSlice";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  if (loading) return <p className="text-stone">Loading...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto">
      <p className="eyebrow mb-1.5">Operations</p>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-8">
        Order Management
      </h2>

      <div className="bg-white border border-ink/10 rounded-2xl shadow-[var(--shadow-card)] overflow-x-auto hide-scrollbar">
        <table className="min-w-full text-left text-stone">
          <thead className="bg-sand/70 text-[11px] uppercase tracking-wider text-charcoal">
            <tr>
              <th className="py-3 px-5">Order ID</th>
              <th className="py-3 px-5">Customer</th>
              <th className="py-3 px-5">Total</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-ink/5 hover:bg-cream transition-colors"
                >
                  <td className="py-4 px-5 font-medium text-ink whitespace-nowrap">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="py-4 px-5">{order.user?.name || "—"}</td>
                  <td className="py-4 px-5 text-ink">
                    ${order.totalPrice?.toFixed(2)}
                  </td>
                  <td className="py-4 px-5">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border border-ink/20 bg-white text-ink text-sm rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink/20"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-5">
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      disabled={order.status === "Delivered"}
                      className="text-sm font-medium px-4 py-2 rounded-md bg-ink text-cream hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Mark Delivered
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 px-5 text-center text-stone">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
