import { useState } from "react";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative bg-cream">
      {/* Mobile top bar */}
      <div className="flex md:hidden items-center p-4 bg-noir text-cream z-20">
        <button onClick={toggleSideBar} aria-label="Toggle menu">
          <FaBars size={22} />
        </button>
        <span className="ml-4 font-heading font-semibold">Admin Dashboard</span>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-ink/50 backdrop-blur-sm md:hidden"
          onClick={toggleSideBar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-noir w-64 min-h-screen text-cream absolute md:relative transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}
      >
        <AdminSidebar toggleSideBar={toggleSideBar} />
      </aside>

      {/* Main content */}
      <main className="flex-grow p-5 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
