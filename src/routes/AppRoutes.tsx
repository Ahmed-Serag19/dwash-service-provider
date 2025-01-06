import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Login from "@/pages/Login/Login";
// import ProtectedRoute from "@/routes/ProtectedRoute";
// import ChangePassword from "@/pages/ChangePassword/ChangePassword";
import Layout from "../layout/Layout";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      //   <ProtectedRoute>
      <Layout />
      //   </ProtectedRoute>
    ),
    // children: [{ index: true, element: <Homepage /> }],
  },
  //   { path: "/login", element: <Login /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
