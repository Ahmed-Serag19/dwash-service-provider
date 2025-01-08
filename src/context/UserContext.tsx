import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUser } from "@/utils/user";
import { UserContextProps, UserContent } from "@/interface/interfaces";

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, error }}>
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
