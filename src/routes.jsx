import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";
import MessageWindow from "./components/MessageWindow/MessageWindow";
import Dashboard from "./components/Dashboard/Dashboard";
import LandingPage from "./components/LandingPage/LandingPage";

const routes = [
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/conversations",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/messages/:id",
    element: (
      <ProtectedRoute>
        <MessageWindow />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/user/:id",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
];

export default routes;
