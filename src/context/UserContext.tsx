import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUser } from "@/utils/user";
import {
  UserContextProps,
  UserContent,
  Notification,
} from "@/interface/interfaces";
import { endpoints } from "@/constants/endPoints";
import axios from "axios";

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsLoading, setIsNotificationsLoading] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getUser(accessToken);
        if (data.success) {
          setUser(data.content);
        } else {
          setError(data.messageEn || "Failed to fetch user data.");
        }
      } catch (err) {
        setError("An error occurred while fetching user data.");
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchNotifications = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Access token not found.");
        return;
      }

      try {
        setIsNotificationsLoading(true);
        const response = await axios.get(endpoints.getNotification, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data.success) {
          setNotifications(response.data.content);
        } else {
          console.error(
            "Failed to fetch notifications:",
            response.data.messageEn
          );
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setIsNotificationsLoading(false);
      }
    };

    fetchUser();
    fetchNotifications();
  }, []);

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.notificationId === id ? { ...notif, read: 1 } : notif
      )
    );
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        notifications,
        isNotificationsLoading,
        markNotificationAsRead,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
