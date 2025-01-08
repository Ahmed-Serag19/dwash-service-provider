export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const endpoints = {
  Login: `${API_BASE_URL}/auth/login`,
  changePassword: `${API_BASE_URL}/auth/changePassword`,
  getUser: `${API_BASE_URL}/freelancer/getBrand`,
};
