import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login";
// import ProtectedRoute from "@/routes/ProtectedRoute";
import Layout from "../layout/Layout";
import Homepage from "../pages/Homepage";
import ChangePassword from "../pages/ChangePassword";
import Orders from "../pages/Orders";
import Profile from "../pages/Profile";
import Services from "../pages/Services";
import Wallet from "../pages/Wallet";
import TimeSlots from "../pages/TimeSlots";

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
      { path: "/wallet", element: <Wallet /> },
      { path: "/time-slots", element: <TimeSlots /> },
    ],
  },
  { path: "/login", element: <Login /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
