import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/Sidebar";

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { i18n } = useTranslation();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
  }, [direction]);

  return (
    <div className="min-h-screen bg-stone-50 flex relative ">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="grid min-h-screen w-full grid-rows-[auto_1fr_auto] md:ml-52 ">
        {/* Navbar */}
        <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

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
