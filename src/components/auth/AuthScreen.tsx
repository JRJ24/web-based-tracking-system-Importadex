import { Database, LockKeyhole, UserPlus, Users } from "lucide-react";
import type { FormEvent } from "react";
import type { LoginForm, RegisterForm } from "../../interfaces/user";
import TextField from "../ui/TextField";

type AuthMode = "login" | "register";

interface AuthScreenProps {
  authMessage: string;
  loginForm: LoginForm;
  mode: AuthMode;
  registerForm: RegisterForm;
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
  onLoginChange: (key: keyof LoginForm, value: string) => void;
  onModeChange: (mode: AuthMode) => void;
  onRegister: (event: FormEvent<HTMLFormElement>) => void;
  onRegisterChange: (key: keyof RegisterForm, value: string) => void;
}

export default function AuthScreen({
  authMessage,
  loginForm,
  mode,
  registerForm,
  onLogin,
  onLoginChange,
  onModeChange,
  onRegister,
  onRegisterChange,
}: AuthScreenProps) {
  const demoAccounts = [
    {
      label: "Administrador",
      email: "admin@mirex.local",
      password: "Admin2026!",
    },
    {
      label: "Operaciones",
      email: "operacionesmirex@importadex.do",
      password: "Mirex2026!",
    },
    {
      label: "MIREX",
      email: "mirex.demo@mirex.gob.do",
      password: "Mirex2026!",
    },
  ];

  return (
    <main className="auth-shell">
      <section className="auth-hero">
        <div className="brand-lockup">
          <div className="brand-mark">MI</div>
          <div>
            <strong>MIREX Tracking</strong>
            <span>Importadex / Flypack</span>
          </div>
        </div>
        <div>
          <span className="eyebrow">Acceso seguro de prototipo</span>
          <h1>Centro de trazabilidad para solicitudes oficiales</h1>
          <p>
            Inicia sesión para consultar órdenes, actualizar estados, revisar reportes y mantener usuarios o catálogos maestros.
          </p>
        </div>
        <div className="auth-feature-grid">
          <div>
            <LockKeyhole size={20} />
            <strong>Sesión controlada</strong>
            <span>Usuarios con rol operativo o administrativo.</span>
          </div>
          <div>
            <Users size={20} />
            <strong>Registro interno</strong>
            <span>Nuevos usuarios quedan disponibles para gestión.</span>
          </div>
          <div>
            <Database size={20} />
            <strong>Mantenimientos</strong>
            <span>Países, estados y oficinas editables.</span>
          </div>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => onModeChange("login")}>
            <LockKeyhole size={16} />
            Iniciar sesión
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => onModeChange("register")}>
            <UserPlus size={16} />
            Registro
          </button>
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={onLogin}>
            <h2>Inicio de sesión</h2>
            <TextField
              label="Correo"
              type="email"
              value={loginForm.email}
              required
              placeholder="usuario@mirex.gob.do"
              onChange={(value) => onLoginChange("email", value)}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={loginForm.password}
              required
              placeholder="Contraseña"
              onChange={(value) => onLoginChange("password", value)}
            />
            {authMessage ? <p className="auth-message">{authMessage}</p> : null}
            <button className="primary-action full" type="submit">
              <LockKeyhole size={18} />
              Entrar
            </button>
            <div className="demo-accounts">
              <span>Accesos demo</span>
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    onLoginChange("email", account.email);
                    onLoginChange("password", account.password);
                  }}
                >
                  {account.label}
                </button>
              ))}
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={onRegister}>
            <h2>Registro de usuario</h2>
            <TextField
              label="Nombre completo"
              value={registerForm.name}
              required
              placeholder="Nombre y apellido"
              onChange={(value) => onRegisterChange("name", value)}
            />
            <TextField
              label="Correo institucional"
              type="email"
              value={registerForm.email}
              required
              placeholder="usuario@mirex.gob.do"
              onChange={(value) => onRegisterChange("email", value)}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={registerForm.password}
              required
              placeholder="Mínimo 8 caracteres"
              onChange={(value) => onRegisterChange("password", value)}
            />
            <TextField
              label="Institución / área"
              value={registerForm.institution}
              required
              placeholder="MIREX, Importadex, Flypack..."
              onChange={(value) => onRegisterChange("institution", value)}
            />
            {authMessage ? <p className="auth-message">{authMessage}</p> : null}
            <button className="primary-action full" type="submit">
              <UserPlus size={18} />
              Crear usuario
            </button>
            <p className="auth-note">
              El rol inicial es Personal MIREX. Un administrador puede cambiarlo en Mantenimiento.
            </p>
          </form>
        )}
      </section>
    </main>
  );
}
