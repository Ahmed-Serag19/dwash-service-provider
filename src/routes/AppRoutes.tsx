import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "@/pages/Homepage";
import ChangePassword from "@/pages/ChangePassword";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import Services from "@/pages/Services";
import WalletComponent from "@/pages/WalletComponent";
import TimeSlots from "@/pages/TimeSlots";
import Login from "@/pages/Login";
import Layout from "@/layout/Layout";
import EditProfile from "@/pages/EditProfile";
import NotFoundPage from "@/pages/404";
import ProtectedRoute from "@/components/ProtectedRoute";
import ForgotPassword from "@/pages/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "/", element: <Homepage /> },
      { path: "/change-password", element: <ChangePassword /> },
      { path: "/orders", element: <Orders /> },
      { path: "/profile", element: <Profile /> },
      { path: "/services", element: <Services /> },
      { path: "/wallet", element: <WalletComponent /> },
      { path: "/time-slots", element: <TimeSlots /> },
      { path: "/edit-profile", element: <EditProfile /> },
    ],
  },
  { path: "/login", element: <Login />, errorElement: <NotFoundPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
