// import {
//   LayoutDashboard,
//   Clock,
//   Wallet,
//   UserCircle,
//   Settings,
//   Package,
//   LogOut,
// } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

// const navItems = [
//   { icon: LayoutDashboard, label: "Dashboard", active: true },
//   { icon: Package, label: "Orders" },
//   { icon: Clock, label: "Timeslots" },
//   { icon: Wallet, label: "Wallet" },
//   { icon: UserCircle, label: "Profile" },
//   { icon: Settings, label: "Services" },
// ];

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-stone-200 bg-stone-50 transition-transform overflow-y-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="flex h-16 items-center justify-center border-b border-stone-200">
              <h2 className="text-xl font-bold text-blue-950">
                Service Provider
              </h2>
            </div>
            <nav className="space-y-1 p-4">
              {/* {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 text-blue-700 hover:bg-stone-100 hover:text-blue-950",
                    item.active && "bg-stone-100 text-blue-950 font-medium"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              ))} */}
            </nav>
          </div>
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-blue-700 hover:bg-stone-100 hover:text-blue-950"
            >
              {/* <LogOut className="h-5 w-5" /> */}
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
