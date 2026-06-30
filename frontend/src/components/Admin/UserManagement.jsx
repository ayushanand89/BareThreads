import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../redux/slices/adminSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", //Default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(addUser(formData));

    //Reset the form after submission
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ id: userId, role: newRole }));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser({ id: userId }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <p className="eyebrow mb-1.5">People</p>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-8">
        User Management
      </h2>
      {error && <p className="text-danger mb-4">Error: {error}</p>}

      {/* Add New User */}
      <div className="bg-white border border-ink/10 rounded-2xl shadow-[var(--shadow-card)] p-6 lg:p-8 mb-8">
        <h3 className="font-heading text-lg font-semibold text-ink mb-5">
          Add New User
        </h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="label-field">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field cursor-pointer"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-primary sm:col-span-2 lg:col-span-1">
            Add User
          </button>
        </form>
      </div>

      {/* Users list */}
      <div className="bg-white border border-ink/10 rounded-2xl shadow-[var(--shadow-card)] overflow-x-auto hide-scrollbar">
        <table className="min-w-full text-left text-stone">
          <thead className="bg-sand/70 text-[11px] uppercase tracking-wider text-charcoal">
            <tr>
              <th className="py-3 px-5">Name</th>
              <th className="py-3 px-5">Email</th>
              <th className="py-3 px-5">Role</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="py-10 px-5 text-center text-stone">
                  Loading...
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-b border-ink/5 hover:bg-cream transition-colors"
              >
                <td className="py-3.5 px-5 font-medium text-ink whitespace-nowrap">
                  {u.name}
                </td>
                <td className="py-3.5 px-5">{u.email}</td>
                <td className="py-3.5 px-5">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="border border-ink/20 bg-white text-ink text-sm rounded-md px-3 py-1.5 cursor-pointer focus:outline-none focus:border-ink"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="text-sm font-medium px-3 py-1.5 rounded-md text-stone hover:text-white hover:bg-danger transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
