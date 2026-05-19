import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthScreen from "../components/auth/AuthScreen";
import { useTracking } from "../context/TrackingContext";
import type { LoginForm, RegisterForm } from "../interfaces/user";
import { stripPassword } from "../lib/appHelpers";

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    authUser,
    users,
    setUsers,
    setAuthUser,
    authMode,
    setAuthMode,
    authMessage,
    setAuthMessage,
    loginForm,
    setLoginForm,
    registerForm,
    setRegisterForm,
  } = useTracking();

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = loginForm.email.trim().toLowerCase();
    const user = users.find((item) => item.email.toLowerCase() === email);

    if (!user || user.password !== loginForm.password) {
      setAuthMessage("Correo o contraseÃ±a incorrectos.");
      return;
    }

    if (user.status !== "Activo") {
      setAuthMessage(`Tu usuario estÃ¡ ${user.status.toLowerCase()}. Contacta al administrador.`);
      return;
    }

    setAuthUser(stripPassword(user));
    setAuthMessage("");
    navigate("/orders", { replace: true });
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = registerForm.email.trim().toLowerCase();

    if (users.some((user) => user.email.toLowerCase() === email)) {
      setAuthMessage("Ya existe un usuario registrado con ese correo.");
      return;
    }

    const now = new Date().toISOString();
    const user = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: registerForm.name.trim(),
      email,
      password: registerForm.password,
      role: "Personal MIREX",
      institution: registerForm.institution.trim() || "MIREX",
      status: "Activo",
      createdAt: now,
    };

    setUsers((current) => [...current, user]);
    setAuthUser(stripPassword(user));
    setAuthMessage("");
    navigate("/orders", { replace: true });
  }

  if (authUser) {
    return <Navigate replace to="/orders" />;
  }

  return (
    <AuthScreen
      authMessage={authMessage}
      loginForm={loginForm}
      mode={authMode}
      registerForm={registerForm}
      onLogin={handleLogin}
      onLoginChange={(key: keyof LoginForm, value: string) =>
        setLoginForm((current) => ({ ...current, [key]: value }))
      }
      onModeChange={(mode) => {
        setAuthMode(mode);
        setAuthMessage("");
      }}
      onRegister={handleRegister}
      onRegisterChange={(key: keyof RegisterForm, value: string) =>
        setRegisterForm((current) => ({ ...current, [key]: value }))
      }
    />
  );
}
