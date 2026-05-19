import { BarChart3, FileText, LayoutDashboard, LogOut, Settings, Upload } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Badge from "../components/ui/Badge";
import { useTracking } from "../context/TrackingContext";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, role, userCanMaintain, openNewOrderModal, logout } = useTracking();

  function goTo(path: string) {
    navigate(path);
  }

  function handleNewOrder() {
    openNewOrderModal();
    navigate("/orders");
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">MI</div>
          <div>
            <strong>MIREX Tracking</strong>
            <span>Importadex / Flypack</span>
          </div>
        </div>

        <nav className="side-nav" aria-label="NavegaciÃ³n principal">
          <button className={location.pathname === "/orders" ? "active" : ""} onClick={() => goTo("/orders")}>
            <LayoutDashboard size={18} />
            Ã“rdenes
          </button>
          <button className={location.pathname === "/reports" ? "active" : ""} onClick={() => goTo("/reports")}>
            <BarChart3 size={18} />
            Reportes
          </button>
          {userCanMaintain ? (
            <button
              className={location.pathname === "/maintenance" ? "active" : ""}
              onClick={() => goTo("/maintenance")}
            >
              <Settings size={18} />
              Mantenimiento
            </button>
          ) : null}
        </nav>

        <div className="role-panel">
          <span>SesiÃ³n activa</span>
          <strong>{authUser?.name}</strong>
          <Badge tone={role === "Administrador" ? "indigo" : role === "Operaciones Importadex / Flypack" ? "teal" : "blue"}>
            {role}
          </Badge>
          <p>
            Acceso controlado por usuario para consultar, comentar, actualizar estados y mantener catÃ¡logos.
          </p>
          <button className="ghost-button full" onClick={handleLogout}>
            <LogOut size={16} />
            Cerrar sesiÃ³n
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Sistema centralizado de trazabilidad</span>
            <h1>Seguimiento operativo MIREX</h1>
          </div>
          <div className="top-actions">
            <button className="icon-button" title="Subir evidencia">
              <Upload size={18} />
            </button>
            <button className="primary-action" onClick={handleNewOrder}>
              <FileText size={18} />
              Nueva orden
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
