export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const endpoints = {
  Login: `${API_BASE_URL}/auth/login`,
  changePassword: `${API_BASE_URL}/auth/changePassword`,
  getUser: `${API_BASE_URL}/freelancer/getBrand`,
  editUser: `${API_BASE_URL}/freelancer/request/editBrand`,
  getNotification: `${API_BASE_URL}/freelancer/getNotifications`,
  getSlots: `${API_BASE_URL}/freelancer/getSlot`,
  addTimeSlot: `${API_BASE_URL}/freelancer/addSlot`,
  deleteTimeSlot: (slotId: number) =>
    `${API_BASE_URL}/freelancer/deleteSlot?slotId=${slotId}`,
  getWallet: `${API_BASE_URL}/freelancer/getBalance`,
  addService: `${API_BASE_URL}/freelancer/request/addService`,
  getServices: `${API_BASE_URL}/freelancer/getServices`,
  editService: `${API_BASE_URL}/freelancer/request/editService`,
  deactivateService: `${API_BASE_URL}/freelancer/deactivateService`,
  activateService: `${API_BASE_URL}/freelancer/activateService`,
};
