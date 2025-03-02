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
import axios from "axios";
import { endpoints } from "@/constants/endPoints";
import { toast } from "react-toastify";

interface HeaderProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface Notification {
  notificationId: number;
  notificationTitleAr: string;
  notificationTitleEn: string;
  notificationDescriptionAr: string;
  notificationDescriptionEn: string;
  createdOn: string;
  read: number;
}

const Navbar = ({ mobileOpen, setMobileOpen }: HeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isLoading, refreshUser } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = sessionStorage.getItem("accessToken");
      try {
        const response = await axios.get(endpoints.getNotification, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.content;
        console.log(data);

        // Filter out notifications older than 1 week
        const filteredNotifications = data.filter(
          (notification: Notification) => {
            const notificationDate = new Date(notification.createdOn);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return notificationDate >= oneWeekAgo;
          }
        );

        // Filter unread notifications
        const unreadNotifications = filteredNotifications.filter(
          (notification: Notification) => notification.read === 0
        );

        setNotifications(unreadNotifications); // Set only unread notifications
        setUnreadCount(unreadNotifications.length); // Update unread count
      } catch (error) {
        console.error("Failed to fetch notifications", error);
        toast.error(t("errorFetchingNotifications"));
      }
    };

    fetchNotifications();
  }, []);

  // Mark a notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      await axios.put(
        endpoints.markNotificationAsRead(notificationId),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, read: 1 }
            : notification
        )
      );

      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      toast.error(t("errorMarkingAsRead"));
    }
  };

  useEffect(() => {
    refreshUser();
    setNotifications([]);
  }, []);

  const dropDownClassName =
    "outline-none cursor-pointer rounded-md transition font-semibold duration-300  w-full px-3 my-1 py-2 hover:text-blue-800 hover:bg-stone-200";

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
            <button className="relative hover:bg-stone-200 rounded-lg transition ring-0 border-0 focus:border-none duration-300">
              <GoBell className="text-blue-950 w-6 h-6 " />
              <div className="absolute left-2 -top-1  h-4 w-4 rounded-full bg-blue-500 text-xs text-white">
                <div className="relative flex items-center justify-center justify-items-center ">
                  <span className="absolute translate-y-[9px] left-[4.5px]">
                    {unreadCount || 0}
                  </span>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="md:w-52 mx-2  flex flex-col rounded-md my-3 bg-stone-100"
          >
            <DropdownMenuLabel
              className={`${dropDownClassName} hover:bg-transparent !cursor-default`}
            >
              {t("notifications")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.notificationId}
                onClick={() => markAsRead(notification.notificationId)}
                className={`${
                  notification.read === 0
                    ? "bg-blue-100 hover:bg-blue-200"
                    : "bg-gray-200 hover:bg-gray-300"
                } p-2 rounded-md mb-2 cursor-pointer transition duration-300`}
              >
                <div className="font-bold">
                  {i18n.language === "ar"
                    ? notification.notificationTitleAr
                    : notification.notificationTitleEn}
                </div>
                <div className="text-sm">
                  {i18n.language === "ar"
                    ? notification.notificationDescriptionAr
                    : notification.notificationDescriptionEn}
                </div>
                <div className="text-xs text-gray-500">
                  {t("created")}{" "}
                  {new Date(notification.createdOn).toLocaleDateString()}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <button
        className={`md:hidden text-2xl transition duration-300 ${
          mobileOpen ? "sm:translate-x-40" : ""
        }`}
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
