import {
  LayoutDashboard,
  Clock,
  Wallet,
  UserCircle,
  Settings,
  Package,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/assets/images/navbar-logo.png";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import LogoutModal from "@/components/LogoutModal";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Home", to: "/" },
  { icon: Package, label: "Orders", to: "/orders" },
  { icon: Clock, label: "Timeslots", to: "/time-slots" },
  // { icon: Wallet, label: "Wallet", to: "/wallet" },
  { icon: UserCircle, label: "Profile", to: "/profile" },
  { icon: Settings, label: "Services", to: "/services" },
];

const navItemsAr = [
  { icon: LayoutDashboard, label: "الرئيسية", to: "/" },
  { icon: Package, label: "الطلبات", to: "/orders" },
  { icon: Clock, label: "الفواصل الزمنية", to: "/time-slots" },
  // { icon: Wallet, label: "المحفظة", to: "/wallet" },
  { icon: UserCircle, label: "الصفحة الشخصية", to: "/profile" },
  { icon: Settings, label: "خدماتك", to: "/services" },
];

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const { i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pathname } = useLocation(); // Get the current URL pathname

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const items = i18n.language === "en" ? navItems : navItemsAr;

  return (
    <>
      <aside
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-42 md:w-52 border-r border-stone-200 bg-stone-50 transition-transform overflow-y-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Logo */}
            <Link
              to="/"
              className="flex h-16 items-center justify-center border-b border-stone-200 hover:bg-stone-200 transition duration-300"
            >
              <img src={Logo} alt="dwash car logo" className="w-36" />
            </Link>

            {/* Navigation */}
            <nav className="flex flex-col gap-3 p-4">
              {items.map((item) => (
                <Link to={item.to} key={item.label}>
                  <button
                    className={cn(
                      "w-full justify-start gap-3 font-semibold flex text-md text-blue-950 hover:bg-stone-200 items-center rounded-sm px-2 py-1.5 outline-none ",
                      pathname === item.to &&
                        "bg-stone-200 text-blue-950 font-semibold"
                    )}
                  >
                    <item.icon />
                    {item.label}
                  </button>
                </Link>
              ))}
            </nav>
          </div>

          {/* Logout */}
          <div className="p-4">
            <button
              onClick={handleOpenModal}
              className="w-full h-10 rounded-md justify-center flex items-center font-semibold gap-2 text-blue-950 hover:bg-stone-200"
            >
              <LogOut className="h-5 w-5 text-red-500" />
              {i18n.language === "ar" ? "تسجيل الخروج" : "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      {isModalOpen && <LogoutModal handleCloseModal={handleCloseModal} />}

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
