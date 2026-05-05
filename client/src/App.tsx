import { useState } from "react";
import { useAppSelector } from "./app/hooks";
import { useSocket } from "./hooks/useSocket";
import ChatPage from "./screens/ChatPage";
import LoginPage from "./screens/LoginPage";
import RegisterPage from "./screens/RegisterPage";
import ToastContainer from "./components/ui/Toast";

type AuthView = "login" | "register";

export default function App() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [authView, setAuthView] = useState<AuthView>("login");

  useSocket();

  if (!isAuthenticated) {
    return (
      <>
        {authView === "login" ? (
          <LoginPage onSwitchToRegister={() => setAuthView("register")} />
        ) : (
          <RegisterPage onSwitchToLogin={() => setAuthView("login")} />
        )}
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <ChatPage />
      <ToastContainer />
    </>
  );
}
