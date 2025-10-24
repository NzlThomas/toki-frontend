import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";
import MessageWindow from "./components/MessageWindow/MessageWindow";

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
];

export default routes;
