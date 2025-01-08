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
// import ProtectedRoute from "@/routes/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      //   <ProtectedRoute>
      <Layout />
      //   </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Homepage /> },
      { path: "/", element: <Homepage /> },
      { path: "/change-password", element: <ChangePassword /> },
      { path: "/orders", element: <Orders /> },
      { path: "/profile", element: <Profile /> },
      { path: "/services", element: <Services /> },
      { path: "/wallet", element: <WalletComponent /> },
      { path: "/time-slots", element: <TimeSlots /> },
    ],
  },
  { path: "/login", element: <Login /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
