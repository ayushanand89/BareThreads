import React from "react";
import { Link } from "react-router";

const AdminHomePage = () => {
  const orders = [
    {
      _id: 12345,
      user: {
        name: "John Doe",
      },
      totalPrice: 110,
      status: "Processing",
    },
    {
      _id: 12346,
      user: {
        name: "Jane Smith",
      },
      totalPrice: 220,
      status: "Shipped",
    },
    {
      _id: 12347,
      user: {
        name: "Mike Johnson",
      },
      totalPrice: 75,
      status: "Delivered",
    },
    {
      _id: 12348,
      user: {
        name: "Emily Davis",
      },
      totalPrice: 145,
      status: "Cancelled",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Revenue</h2>
          <p className="text-2xl">$10000</p>
        </div>
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl">200</p>
          <Link to="/admin/orders" className="text-blue-500 hover:underline">
            Manage Orders
          </Link>
        </div>
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <p className="text-2xl">100</p>
          <Link to="/admin/orders" className="text-blue-500 hover:underline">
            Manage Products
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.user.name}</td>
                    <td className="p-4">{order.totalPrice}</td>
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr colSpan={4} className="p-4 text-center text-gray-500">
                  No recent orders found
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
