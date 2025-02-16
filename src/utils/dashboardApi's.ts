import axios from "axios";
import { endpoints } from "@/constants/endPoints"; // Ensure correct import of your endpoints

// Fetch Orders
export const fetchOrders = async (
  page: number,
  size: number = 10,
  orderStatus: string = "pending"
) => {
  try {
    const response = await axios.get(
      endpoints.getOrders(page, size, orderStatus),
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`, // Assuming you are using token from sessionStorage
        },
      }
    );
    return response.data.content.data; // Adjust the response structure based on your API
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// Fetch Services
export const fetchServices = async () => {
  try {
    const response = await axios.get(endpoints.getServices, {
      params: { size: 8, page: 0, servicesTypeId: 1 },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response.data.content.data; // Adjust this based on your API response
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

// Fetch Wallet
export const fetchWallet = async () => {
  try {
    const response = await axios.get(endpoints.getWallet, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response.data.content; // Adjust based on the structure of your wallet response
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return { balance: 0 }; // Fallback to a default value
  }
};

// Fetch Time Slots
export const fetchTimeSlots = async () => {
  try {
    const response = await axios.get(endpoints.getSlots, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    });
    return response.data.content; // Adjust based on your API response
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return []; // Fallback to empty array
  }
};
