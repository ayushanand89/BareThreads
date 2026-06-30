import { useState } from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router";
import { toast } from "sonner";
import { axiosInstance } from "../../utils/axios";
import { Reveal } from "./Reveal";

const shopLinks = [
  { label: "Men's Top Wear", to: "/collections/all?gender=Men&category=Top Wear" },
  { label: "Women's Top Wear", to: "/collections/all?gender=Women&category=Top Wear" },
  { label: "Men's Bottom Wear", to: "/collections/all?gender=Men&category=Bottom Wear" },
  { label: "Women's Bottom Wear", to: "/collections/all?gender=Women&category=Bottom Wear" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await axiosInstance.post("/subscribe", { email });
      toast.success("You're subscribed! Welcome to BareThreads.");
      setEmail("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Subscription failed. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-cream border-t border-ink/10 pt-16 pb-8">
      {/* Brand band */}
      <div className="container mx-auto px-4 lg:px-6 mb-14">
        <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-ink/10 pb-12">
          <div>
            <p className="eyebrow mb-3">Elevated Everyday</p>
            <h2 className="font-display text-5xl md:text-7xl font-semibold text-ink leading-none">
              BareThreads
            </h2>
          </div>
          <p className="text-stone max-w-sm lg:text-right leading-relaxed">
            Thoughtfully designed essentials — crafted to last, and made to move
            with you wherever the season takes you.
          </p>
        </Reveal>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-4 lg:px-6">
        {/* Newsletter */}
        <div className="md:pr-6">
          <h3 className="font-heading text-base font-semibold text-ink mb-3 uppercase tracking-wide">
            Newsletter
          </h3>
          <p className="text-stone text-sm mb-4 leading-relaxed">
            Be the first to hear about new arrivals, exclusive events and online
            offers. Sign up and get 10% off your first order.
          </p>

          <form onSubmit={handleSubscribe} className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-3 w-full text-sm border border-ink/20 rounded-l-md bg-white focus:outline-none focus:border-ink transition-colors"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-ink text-cream px-5 text-sm rounded-r-md hover:bg-charcoal transition-colors disabled:opacity-60"
            >
              {submitting ? "..." : "Subscribe"}
            </button>
          </form>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-heading text-base font-semibold text-ink mb-4 uppercase tracking-wide">
            Shop
          </h3>
          <ul className="space-y-2.5 text-sm text-stone">
            {shopLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="hover:text-accent transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-heading text-base font-semibold text-ink mb-4 uppercase tracking-wide">
            Support
          </h3>
          <ul className="space-y-2.5 text-sm text-stone">
            <li>
              <Link to="/collections/all" className="hover:text-accent transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/my-orders" className="hover:text-accent transition-colors">
                Track Order
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-accent transition-colors">
                My Account
              </Link>
            </li>
            <li>
              <a href="mailto:hello@barethreads.com" className="hover:text-accent transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Follow */}
        <div>
          <h3 className="font-heading text-base font-semibold text-ink mb-4 uppercase tracking-wide">
            Follow Us
          </h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-charcoal hover:text-accent transition-colors"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Meta"
              className="text-charcoal hover:text-accent transition-colors"
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a
              href="https://www.x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="text-charcoal hover:text-accent transition-colors"
            >
              <RiTwitterXLine className="h-4 w-4" />
            </a>
          </div>
          <p className="text-stone text-sm mb-1">Call Us</p>
          <p className="flex items-center text-ink text-sm">
            <FiPhoneCall className="inline-block mr-2" />
            0123-456-789
          </p>
        </div>
      </div>

      <div className="container mx-auto mt-12 px-4 lg:px-6 border-t border-ink/10 pt-6">
        <p className="text-stone text-xs tracking-wide text-center">
          © 2026 BareThreads. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
