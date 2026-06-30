import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="bg-ink text-cream">
      <div className="container mx-auto flex items-center justify-between py-2.5 px-4 lg:px-6">
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-cream/70 hover:text-cream transition-colors"
          >
            <IoLogoInstagram className="h-4.5 w-4.5" />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Meta"
            className="text-cream/70 hover:text-cream transition-colors"
          >
            <TbBrandMeta className="h-4.5 w-4.5" />
          </a>
          <a
            href="https://www.x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="text-cream/70 hover:text-cream transition-colors"
          >
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>

        <div className="text-xs md:text-sm text-center flex-grow tracking-wide">
          <span className="text-cream/90">
            Complimentary worldwide shipping on all orders
          </span>
        </div>

        <div className="text-sm hidden md:block">
          <a
            href="tel:+1234567890"
            className="text-cream/70 hover:text-cream transition-colors"
          >
            +1 (123) 567-890
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
