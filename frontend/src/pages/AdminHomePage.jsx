import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";

const statusStyles = {
  Delivered: "bg-success/10 text-success",
  Shipped: "bg-amber-100 text-amber-700",
  Processing: "bg-sand text-charcoal",
  Cancelled: "bg-danger/10 text-danger",
};

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);
  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const cards = [
    {
      label: "Revenue",
      value: `$${(totalSales || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      to: "/admin/orders",
      link: "View orders",
    },
    { label: "Total Orders", value: totalOrders, to: "/admin/orders", link: "Manage orders" },
    { label: "Total Products", value: products.length, to: "/admin/products", link: "Manage products" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <p className="eyebrow mb-1.5">Overview</p>
      <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-8">
        Admin Dashboard
      </h1>

      {productsLoading || ordersLoading ? (
        <p className="text-stone">Loading...</p>
      ) : productsError || ordersError ? (
        <p className="text-danger">{productsError || ordersError}</p>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {cards.map((c) => (
              <div
                key={c.label}
                className="bg-white border border-ink/10 rounded-2xl shadow-[var(--shadow-card)] p-6"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-stone mb-2">
                  {c.label}
                </p>
                <p className="font-display text-4xl font-semibold text-ink">
                  {c.value}
                </p>
                <Link
                  to={c.to}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark mt-3 group"
                >
                  {c.link}
                  <HiOutlineArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <h2 className="font-heading text-lg font-semibold text-ink mb-4">
            Recent Orders
          </h2>
          <div className="bg-white border border-ink/10 rounded-2xl shadow-[var(--shadow-card)] overflow-x-auto hide-scrollbar">
            <table className="min-w-full text-left text-stone">
              <thead className="bg-sand/70 text-[11px] uppercase tracking-wider text-charcoal">
                <tr>
                  <th className="py-3 px-5">Order ID</th>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Total</th>
                  <th className="py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.slice(0, 8).map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-ink/5 hover:bg-cream transition-colors"
                    >
                      <td className="py-3.5 px-5 font-medium text-ink whitespace-nowrap">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="py-3.5 px-5">{order.user?.name || "—"}</td>
                      <td className="py-3.5 px-5 text-ink">
                        ${order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusStyles[order.status] || "bg-sand text-charcoal"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 px-5 text-center text-stone">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHomePage;
