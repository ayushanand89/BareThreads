import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaUser,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const links = [
  { to: "/admin/users", label: "Users", icon: FaUser },
  { to: "/admin/products", label: "Products", icon: FaBoxOpen },
  { to: "/admin/orders", label: "Orders", icon: FaClipboardList },
  { to: "/", label: "Back to Shop", icon: FaStore },
];

const AdminSidebar = ({ toggleSideBar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  const closeOnMobile = () => {
    if (window.innerWidth < 768) toggleSideBar();
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <Link
        to="/admin"
        onClick={closeOnMobile}
        className="font-display text-2xl font-semibold text-cream"
      >
        BareThreads
      </Link>
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold mt-1 mb-8">
        Admin Suite
      </p>

      <nav className="flex flex-col gap-1.5 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={closeOnMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-cream text-ink"
                    : "text-cream/65 hover:text-cream hover:bg-white/[0.06]"
                }`
              }
            >
              <Icon className="text-base" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full mt-6 border border-cream/20 text-cream/90 rounded-lg py-3 text-sm font-medium transition-all duration-300 hover:border-danger hover:bg-danger hover:text-white active:scale-[0.98]"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
