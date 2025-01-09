import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/context/UserContext";

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { i18n } = useTranslation();
  const { user, isLoading } = useUser();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
  }, [direction]);

  if (isLoading) {
    return (
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-stone-50 flex justify-center items-center min-h-screen">
          <div className="loader flex justify-center items-center absolute top-0 bottom-0 left-0 right-0  inset-1 z-50"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-stone-50 flex relative">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="grid min-h-screen w-full grid-rows-[auto_1fr_auto] md:ml-52">
        {/* Navbar */}
        <Navbar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          user={user}
        />

        {/* Main Content */}
        <main
          style={{ direction }}
          className="mx-auto sm:max-w-6xl p-2 sm:p-5 w-full flex items-center justify-center overflow-y-auto"
        >
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
