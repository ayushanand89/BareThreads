import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import { Link, useLocation, useNavigate } from "react-router";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const navLinks = [
  { label: "Men", to: "/collections/all?gender=Men" },
  { label: "Women", to: "/collections/all?gender=Women" },
  { label: "Top Wear", to: "/collections/all?category=Top Wear" },
  { label: "Bottom Wear", to: "/collections/all?category=Bottom Wear" },
];

const Navbar = ({ scrolled }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = navDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navDrawerOpen]);

  return (
    <>
      <nav
        className={`container mx-auto flex items-center justify-between px-4 lg:px-6 transition-all duration-300 ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        {/* Left - Back button (mobile) + Logo */}
        <div className="flex items-center gap-2">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="md:hidden -ml-1 p-1.5 rounded-full text-charcoal hover:text-ink hover:bg-sand transition-all active:scale-90"
            >
              <HiOutlineArrowLeft className="h-5 w-5" />
            </button>
          )}
          <Link
            to="/"
            className={`font-display font-semibold tracking-tight text-ink transition-all duration-300 hover:text-accent ${
              scrolled ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
            }`}
          >
            BareThreads
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="relative text-sm font-medium uppercase tracking-wide text-charcoal hover:text-ink transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-ink after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right - Icons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="hidden sm:block bg-ink px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide text-cream hover:bg-charcoal transition-colors"
            >
              Admin
            </Link>
          )}
          <Link
            to="/profile"
            aria-label="Account"
            className="text-charcoal hover:text-ink transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <HiOutlineUser className="h-6 w-6" />
          </Link>

          <button
            onClick={toggleCartDrawer}
            aria-label="Cart"
            className="relative text-charcoal hover:text-ink transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <HiOutlineShoppingBag className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center animate-fade-in">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Search */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>

          <button
            onClick={toggleNavDrawer}
            aria-label="Open menu"
            className="md:hidden text-charcoal hover:text-ink transition-colors"
          >
            <HiBars3BottomRight className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile Navigation — portaled to <body> so it escapes the header's
          backdrop-filter containing block (otherwise a `fixed` drawer is
          trapped inside the ~100px header instead of filling the screen). */}
      {createPortal(
        <>
          <div
            onClick={toggleNavDrawer}
            className={`fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${
              navDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
          <div
            className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-80 h-full bg-cream shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
              navDrawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center p-5 border-b border-ink/10">
              <span className="font-display text-xl font-semibold">
                BareThreads
              </span>
              <button
                onClick={toggleNavDrawer}
                aria-label="Close menu"
                className="transition-transform hover:rotate-90 duration-300"
              >
                <IoMdClose className="h-6 w-6 text-charcoal" />
              </button>
            </div>

            <div className="p-5">
              <p className="eyebrow mb-4">Menu</p>
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={toggleNavDrawer}
                    className="block py-2.5 text-lg font-heading text-charcoal hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default Navbar;
