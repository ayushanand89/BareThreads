import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import login from "../assets/login.webp";
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
import GoogleAuthButton from "../components/Common/GoogleAuthButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, error } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // Get redirect parameter and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };
  return (
    <div className="flex min-h-[calc(100vh-105px)]">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl border border-ink/10 shadow-[var(--shadow-soft)] animate-fade-up relative overflow-hidden"
        >
          {/* accent top line */}
          <span className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-accent-dark to-accent" />

          <div className="text-center mb-7">
            <span className="font-display text-2xl font-semibold text-ink">
              BareThreads
            </span>
          </div>
          <p className="eyebrow text-center mb-2">Welcome Back</p>
          <h2 className="font-display text-3xl font-semibold text-center text-ink mb-2">
            Sign in to continue
          </h2>
          <p className="text-center text-stone mb-7 text-sm">
            Enter your details to access your account
          </p>

          {error && (
            <p className="mb-4 text-sm text-danger bg-danger/10 rounded-md px-3 py-2 text-center">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label className="label-field">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="label-field">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <GoogleAuthButton />

          <p className="text-center mt-6 text-sm text-stone">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-accent font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side Image */}
      <div className="hidden md:block md:w-1/2 relative bg-ink">
        <img
          src={login}
          alt="Login"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
