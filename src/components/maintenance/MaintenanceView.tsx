import { Database, Globe2, MapPin, ShieldCheck, Users } from "lucide-react";
import type { CatalogDrafts, CatalogKind, Catalogs } from "../../interfaces/catalog";
import type { AppUser, AuthUser } from "../../interfaces/user";
import { formatDate, roleOptions, userStatusOptions } from "../../lib/appHelpers";
import Badge from "../ui/Badge";
import IconStat from "../ui/IconStat";
import CatalogManager from "./CatalogManager";

interface MaintenanceViewProps {
  catalogs: Catalogs;
  currentUser: AuthUser;
  newCatalogItems: CatalogDrafts;
  users: AppUser[];
  onAddCatalogItem: (kind: CatalogKind) => void;
  onCatalogDraftChange: (kind: CatalogKind, value: string) => void;
  onRemoveCatalogItem: (kind: CatalogKind, value: string) => void;
  onRemoveUser: (userId: string) => void;
  onUpdateUser: (userId: string, key: "role" | "status", value: string) => void;
}

export default function MaintenanceView({
  catalogs,
  currentUser,
  newCatalogItems,
  users,
  onAddCatalogItem,
  onCatalogDraftChange,
  onRemoveCatalogItem,
  onRemoveUser,
  onUpdateUser,
}: MaintenanceViewProps) {
  return (
    <section className="maintenance-view">
      <div className="report-hero">
        <div>
          <span className="eyebrow">Módulo administrativo</span>
          <h2>Mantenimiento del sistema</h2>
          <p>
            Gestiona usuarios registrados, roles, estados de acceso y catálogos usados por órdenes y reportes.
          </p>
        </div>
        <Badge tone="indigo">Solo administrador</Badge>
      </div>

      <section className="maintenance-grid">
        <IconStat icon={Users} label="Usuarios registrados" value={users.length} tone="neutral" />
        <IconStat icon={ShieldCheck} label="Usuarios activos" value={users.filter((user) => user.status === "Activo").length} tone="success" />
        <IconStat icon={Globe2} label="Países destino" value={catalogs.countries.length} tone="teal" />
        <IconStat icon={Database} label="Estados operativos" value={catalogs.statuses.length} tone="gold" />
      </section>

      <section className="maintenance-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Seguridad y roles</span>
            <h2>Usuarios registrados</h2>
          </div>
        </div>
        <div className="table-shell">
          <table className="orders-table users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Institución</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Creación</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.name}</strong>
                    <span className="muted-cell">{user.id}</span>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.institution}</td>
                  <td>
                    <select
                      className="status-select"
                      value={user.role}
                      onChange={(event) => onUpdateUser(user.id, "role", event.target.value)}
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={user.status}
                      onChange={(event) => onUpdateUser(user.id, "status", event.target.value)}
                      disabled={user.id === currentUser.id}
                    >
                      {userStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <button
                      className="ghost-button"
                      disabled={user.id === currentUser.id}
                      onClick={() => onRemoveUser(user.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="catalog-grid">
        <CatalogManager
          icon={Globe2}
          items={catalogs.countries}
          label="País destino"
          pluralLabel="Países destino"
          value={newCatalogItems.countries}
          onAdd={() => onAddCatalogItem("countries")}
          onChange={(value) => onCatalogDraftChange("countries", value)}
          onRemove={(value) => onRemoveCatalogItem("countries", value)}
        />
        <CatalogManager
          icon={ShieldCheck}
          items={catalogs.statuses}
          label="Estado operativo"
          pluralLabel="Estados"
          value={newCatalogItems.statuses}
          onAdd={() => onAddCatalogItem("statuses")}
          onChange={(value) => onCatalogDraftChange("statuses", value)}
          onRemove={(value) => onRemoveCatalogItem("statuses", value)}
        />
        <CatalogManager
          icon={MapPin}
          items={catalogs.offices}
          label="Embajada / Consulado"
          pluralLabel="Embajadas y consulados"
          value={newCatalogItems.offices}
          onAdd={() => onAddCatalogItem("offices")}
          onChange={(value) => onCatalogDraftChange("offices", value)}
          onRemove={(value) => onRemoveCatalogItem("offices", value)}
        />
      </section>
    </section>
  );
}
