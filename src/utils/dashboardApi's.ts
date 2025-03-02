import axios from "axios";
import { endpoints } from "@/constants/endPoints"; // Ensure correct import of your endpoints

// Fetch Orders
export const fetchOrders = async (
  page: number,
  size: number = 10,
  orderStatus: string = "pending"
) => {
  try {
    console.log(
      `Fetching orders for status: ${orderStatus}, page: ${page}, size: ${size}`
    );

    const response = await axios.get(
      endpoints.getOrders(page, size, orderStatus),
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );

    console.log("Orders API Response:", response.data); // ✅ Debugging step
    return response.data.content?.data || []; // Ensure this structure is correct
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
    console.log(response);
    return response.data.content;
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return { balance: 0 };
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
