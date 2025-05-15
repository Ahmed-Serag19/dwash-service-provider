import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { endpoints } from "@/constants/endPoints";
import { UserContent } from "@/interface/interfaces";

interface UserContextProps {
  user: UserContent | null;
  isLoading: boolean;
  notifications: object[];
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<object[]>([]);

  const fetchUser = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(endpoints.getUser, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data?.success) {
        setUser(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchNotifications = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(endpoints.getNotification, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(response);
      if (response.data?.success) {
        setNotifications(response.data.content);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        notifications,
        isLoading,
        refreshUser: fetchUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
