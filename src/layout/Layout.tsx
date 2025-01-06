import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="mx-auto sm:max-w-6xl p-2 sm:p-5 w-full flex items-center justify-center overflow-y-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
