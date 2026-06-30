import {
  HiArrowPathRoundedSquare,
  HiOutlineCreditCard,
  HiShoppingBag,
} from "react-icons/hi2";
import { StaggerGroup, StaggerItem } from "../Common/Reveal";

const features = [
  {
    icon: HiShoppingBag,
    title: "Free International Shipping",
    desc: "Complimentary delivery on all orders over $100",
  },
  {
    icon: HiArrowPathRoundedSquare,
    title: "45 Days Return",
    desc: "Shop with confidence, money-back guarantee",
  },
  {
    icon: HiOutlineCreditCard,
    title: "Secure Checkout",
    desc: "100% encrypted and protected payments",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-white py-20 px-4 border-t border-ink/5">
      <StaggerGroup className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <StaggerItem
              key={feature.title}
              className="group flex flex-col items-center text-center p-8 rounded-2xl border border-transparent
                transition-all duration-400 ease-out
                hover:border-ink/10 hover:bg-cream hover:-translate-y-1.5 hover:shadow-[var(--shadow-card)]"
            >
              <div
                className="p-5 rounded-2xl bg-accent-soft text-accent mb-5
                  transition-all duration-400 ease-out
                  group-hover:bg-ink group-hover:text-cream group-hover:scale-110 group-hover:-rotate-6"
              >
                <Icon className="text-2xl" />
              </div>
              <h4 className="font-heading font-semibold uppercase tracking-wide text-ink mb-2 text-sm">
                {feature.title}
              </h4>
              <p className="text-stone text-sm">{feature.desc}</p>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
};

export default FeaturesSection;
