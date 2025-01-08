import axios from "axios";
import { endpoints } from "@/constants/endPoints";
export const getUser = async (accessToken: string) => {
  const { getUser } = endpoints;
  try {
    const response = await axios.get(getUser, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
