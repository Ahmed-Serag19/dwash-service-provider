import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { GoBell, GoPersonFill } from "react-icons/go";
import { GiHamburgerMenu } from "react-icons/gi";
import LogoutModal from "@/components/LogoutModal";
import i18n from "@/i18n";
import { useUser } from "@/context/UserContext";
import { t } from "i18next";

interface HeaderProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const Navbar = ({ mobileOpen, setMobileOpen }: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isLoading, refreshUser } = useUser();

  useEffect(() => {
    refreshUser();
  }, []);

  const dropDownClassName =
    "outline-none cursor-pointer rounded-md transition font-semibold duration-300 hover:bg-slate-100 w-full px-3 my-1 py-2 hover:text-blue-800 hover:bg-stone-200";
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading && !user) {
    return (
      <header className="flex items-center justify-start p-4  bg-gray-200 animate-pulse">
        <div className="h-6 w-32 bg-gray-400 rounded"></div>
        <div className="h-6 w-24 bg-gray-400 rounded"></div>
      </header>
    );
  }
  return (
    <header
      className="z-30 flex h-16 items-center min-h-16 justify-between md:justify-between border-b border-stone-200 bg-stone-50 px-4"
      dir="rtl"
    >
      <div className="flex items-center gap-2 md:gap-7">
        <LanguageSwitcher />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="gap-2 text-md flex items-center font-semibold text-blue-950  px-2 py-2 rounded-md  hover:bg-stone-200 transition duration-300">
              <GoPersonFill size={28} />
              {i18n.language === "en"
                ? user?.userDto?.nameEn
                : user?.userDto?.nameAr}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-42 border-blue-950 border-[1px] flex flex-col  rounded-md my-2 bg-stone-100"
          >
            <Link to="/profile">
              <DropdownMenuItem className={dropDownClassName}>
                {t("profile")}
              </DropdownMenuItem>
            </Link>
            <Link to="/change-password">
              <DropdownMenuItem className={dropDownClassName}>
                {t("changePassword")}
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleOpenModal}
              className={dropDownClassName}
            >
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative hover:bg-stone-200 rounded-lg transition duration-300">
              <GoBell className="text-blue-950 w-6 h-6" />
              <div className="absolute left-2 -top-1  h-4 w-4 rounded-full bg-blue-500 text-xs text-white">
                <div className="relative flex items-center justify-center justify-items-center ">
                  <span className="absolute translate-y-[9px] left-[4.5px]">
                    3
                  </span>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="md:w-52 mx-2 border-blue-950 border-[1px] flex flex-col rounded-md my-3 bg-stone-100"
          >
            <DropdownMenuLabel className={dropDownClassName}>
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="" />
            <DropdownMenuItem className={dropDownClassName}>
              New order received
            </DropdownMenuItem>
            <DropdownMenuItem className={dropDownClassName}>
              Payment confirmed
            </DropdownMenuItem>
            <DropdownMenuItem className={dropDownClassName}>
              Schedule updated
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <button
        className={`md:hidden text-2xl transition duration-300 ${
          mobileOpen ? "sm:translate-x-40" : ""
        }`}
        // size="icon"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <GiHamburgerMenu
          size={32}
          className="text-blue-950 h-7 w-7 hover:text-blue-800 transition duration-300 "
        />
      </button>
      {/* Modal for Logout Confirmation */}
      {isModalOpen && <LogoutModal handleCloseModal={handleCloseModal} />}
    </header>
  );
};

export default Navbar;
