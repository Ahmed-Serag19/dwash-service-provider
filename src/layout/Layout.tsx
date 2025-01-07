import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { useTranslation } from "react-i18next";

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { i18n } = useTranslation();

  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
  }, [direction]);

  return (
    <SidebarProvider dir="ltr">
      <AppSidebar />
      <SidebarTrigger />
      <div className="grid w-full min-h-screen grid-rows-[auto_1fr_auto]">
        {/* Navbar */}
        <Navbar />

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
    </SidebarProvider>
  );
};

export default Layout;
