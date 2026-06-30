import { useDispatch, useSelector } from "react-redux";
import MyOrdersPage from "./MyOrdersPage";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { HiArrowRightOnRectangle, HiOutlineCog6Tooth } from "react-icons/hi2";
import { clearCart } from "../redux/slices/cartSlice";
import { logout } from "../redux/slices/authSlice";
import { Reveal } from "../components/Common/Reveal";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "?";
  const showAvatar = user?.avatar && !avatarError;

  return (
    <div className="min-h-[70vh] container mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: profile card */}
        <Reveal className="w-full lg:w-1/3 xl:w-1/4 lg:sticky lg:top-28 lg:self-start">
          <div className="bg-white border border-ink/10 rounded-2xl shadow-[var(--shadow-card)] p-8 text-center">
            {/* Avatar */}
            <div className="mx-auto mb-5 w-24 h-24 rounded-full overflow-hidden bg-accent-soft flex items-center justify-center ring-1 ring-ink/10">
              {showAvatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display text-4xl text-accent">
                  {initial}
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl font-semibold text-ink leading-tight">
              {user?.name}
            </h1>
            <p className="text-stone text-sm mt-1 break-all">{user?.email}</p>

            <span className="inline-block mt-4 text-[11px] font-medium uppercase tracking-wider bg-sand text-charcoal px-3 py-1 rounded-full">
              {user?.role === "admin" ? "Administrator" : "Member"}
            </span>

            <div className="mt-7 space-y-3">
              {user?.role === "admin" && (
                <Link to="/admin" className="btn-primary w-full">
                  <HiOutlineCog6Tooth className="h-5 w-5" />
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 border border-ink/20 text-charcoal rounded-md px-6 py-3 font-medium transition-all duration-300 hover:border-danger hover:bg-danger hover:text-white active:scale-[0.98]"
              >
                <HiArrowRightOnRectangle className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </Reveal>

        {/* Right: orders */}
        <div className="flex-1 min-w-0">
          <MyOrdersPage embedded />
        </div>
      </div>
    </div>
  );
};

export default Profile;
