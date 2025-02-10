import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { userStore } from "./ApiStore/userStore";
import { useThemeStore } from "./ApiStore/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const GID =
    "76789521870-10hd2q6ccd19rsjgh6b3e2459jh256m0.apps.googleusercontent.com";

  const { setuser, checkAuth, isCheckingAuth, onlineUsers } = userStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // console.log(onlineUsers);

  if (isCheckingAuth && !setuser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      {/* Common in all Pages Navbar */}
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={setuser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={
            !setuser ? (
              <GoogleOAuthProvider clientId={GID}>
                <SignupPage />
              </GoogleOAuthProvider>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !setuser ? (
              <GoogleOAuthProvider clientId={GID}>
                <LoginPage />
              </GoogleOAuthProvider>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/setting" element={<SettingPage />} />
        <Route
          path="/profile"
          element={setuser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
