export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const endpoints = {
  // Auth endpoints
  Login: `${API_BASE_URL}/auth/login`,
  changePassword: `${API_BASE_URL}/auth/changePassword`,

  // Freelancer profile endpoints
  getUser: `${API_BASE_URL}/freelancer/getBrand`,
  editUser: `${API_BASE_URL}/freelancer/request/editBrand`,

  // Notification endpoints
  getNotification: `${API_BASE_URL}/freelancer/getNotifications`,
  markNotificationAsRead: (notificationId: number) =>
    `${API_BASE_URL}/freelancer/notification/read?notificationId=${notificationId}`,

  // Time slot endpoints
  getSlots: `${API_BASE_URL}/freelancer/getSlot`,
  addTimeSlot: `${API_BASE_URL}/freelancer/addSlot`,
  deleteTimeSlot: (slotId: number) =>
    `${API_BASE_URL}/freelancer/deleteSlot?slotId=${slotId}`,

  // Wallet endpoints
  getWallet: `${API_BASE_URL}/freelancer/getBalance`,

  // Service endpoints
  addService: `${API_BASE_URL}/freelancer/request/addService`,
  getServices: `${API_BASE_URL}/freelancer/getServices`,
  editService: `${API_BASE_URL}/freelancer/request/editService`,
  deactivateService: `${API_BASE_URL}/freelancer/deactivateService`,
  activateService: `${API_BASE_URL}/freelancer/activateService`,

  // Order endpoints
  getOrders: (page: number, size: number, orderStatus: string) =>
    `${API_BASE_URL}/freelancer/getOrdersByStatus?page=${page}&size=${size}&orderStatus=${orderStatus}`,
  rejectOrder: (orderId: number) =>
    `${API_BASE_URL}/freelancer/rejectOrder?orderId=${orderId}`,
  proceedOrder: (orderId: number) =>
    `${API_BASE_URL}/freelancer/proceedOrder?orderId=${orderId}`,
  completeOrder: (orderId: number) =>
    `${API_BASE_URL}/freelancer/completeOrder?orderId=${orderId}`,
  acceptOrder: (orderId: number) =>
    `${API_BASE_URL}/freelancer/acceptOrder?orderId=${orderId}`,

  initiateForgotPassword: `${API_BASE_URL}/auth/forgetPassword/initiate`,
  finalizeForgotPassword: `${API_BASE_URL}/auth/forgetPassword/finalize`,
};
