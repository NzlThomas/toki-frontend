import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />,
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
];

export default routes;
