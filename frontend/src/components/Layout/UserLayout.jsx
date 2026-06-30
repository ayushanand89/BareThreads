import { Outlet, useLocation } from "react-router";
import { motion } from "framer-motion";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import ScrollProgress from "../Common/ScrollProgress";

const MotionMain = motion.main;

const UserLayout = () => {
  const location = useLocation();

  return (
    <>
      <ScrollProgress />

      {/* Header */}
      <Header />

      {/* Main Content — fades/slides in on each route change */}
      <MotionMain
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </MotionMain>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default UserLayout;
