import { ChevronRight, Clock3, Filter, Search, X } from "lucide-react";
import { priorityMeta, priorityOptions, responsibleOptions, typeOptions } from "../../data/mockData";
import type { KpiCounts, KpiFilterId, Order, OrderFilters, OrderSortKey, SortConfig } from "../../interfaces/order";
import { formatDate, kpiFilterDefinitions, sortColumnLabels } from "../../lib/appHelpers";
import Badge from "../ui/Badge";
import IconStat from "../ui/IconStat";
import SelectField from "../ui/SelectField";
import TextField from "../ui/TextField";
import OrderDetail from "./OrderDetail";
import SortableHeader from "./SortableHeader";

interface OrdersViewProps {
  activeKpiFilter: KpiFilterId | null;
  baseOrdersCount: number;
  countries: string[];
  filters: OrderFilters;
  filteredOrders: Order[];
  metrics: KpiCounts;
  query: string;
  selectedOrder: Order;
  sortConfig: SortConfig;
  statusOptions: string[];
  userCanAnnulOrders: boolean;
  userCanEditOrders: boolean;
  trackingDraft: string;
  trackingSaveMessage: string;
  lookupMessage: string;
  newComment: string;
  onAddComment: () => void;
  onAnnulOrder: () => void;
  onClearKpiFilter: () => void;
  onEditOrder: () => void;
  onQueryChange: (value: string) => void;
  onResetFilters: () => void;
  onSaveTracking: () => void;
  onSelectOrder: (order: Order) => void;
  onSetNewComment: (value: string) => void;
  onSetTrackingDraft: (value: string) => void;
  onSimulateLookup: () => void;
  onSortChange: (sortKey: OrderSortKey) => void;
  onToggleKpiFilter: (filterId: KpiFilterId) => void;
  onUpdateFilter: (key: keyof OrderFilters, value: string) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}

export default function OrdersView({
  activeKpiFilter,
  baseOrdersCount,
  countries,
  filters,
  filteredOrders,
  metrics,
  query,
  selectedOrder,
  sortConfig,
  statusOptions,
  userCanAnnulOrders,
  userCanEditOrders,
  trackingDraft,
  trackingSaveMessage,
  lookupMessage,
  newComment,
  onAddComment,
  onAnnulOrder,
  onClearKpiFilter,
  onEditOrder,
  onQueryChange,
  onResetFilters,
  onSaveTracking,
  onSelectOrder,
  onSetNewComment,
  onSetTrackingDraft,
  onSimulateLookup,
  onSortChange,
  onToggleKpiFilter,
  onUpdateFilter,
  onUpdateStatus,
}: OrdersViewProps) {
  const activeKpi = kpiFilterDefinitions.find((filter) => filter.id === activeKpiFilter);
  const activeSortLabel = sortConfig.key ? sortColumnLabels[sortConfig.key] : "";

  return (
    <>
      <section className="stats-grid">
        {kpiFilterDefinitions.map((filter) => (
          <IconStat
            key={filter.id}
            icon={filter.icon}
            isActive={activeKpiFilter === filter.id}
            label={filter.label}
            onClick={() => onToggleKpiFilter(filter.id)}
            tone={filter.tone}
            value={metrics[filter.metricKey]}
          />
        ))}
        <IconStat icon={Clock3} label="Tiempo promedio" value={metrics.avgDelivery} detail="últimos 30 días" tone="neutral" />
      </section>

      <section className="work-area">
        <div className="orders-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Operación diaria</span>
              <h2>Panel principal de órdenes</h2>
            </div>
            <button className="ghost-button" onClick={onResetFilters}>
              <Filter size={16} />
              Limpiar filtros
            </button>
          </div>

          <div className="orders-toolbar" aria-live="polite">
            <p>
              Mostrando <strong>{filteredOrders.length}</strong> de <strong>{baseOrdersCount}</strong> órdenes
              {activeKpi ? ` · Filtro rápido: ${activeKpi.label}` : ""}
              {activeSortLabel ? ` · Orden: ${activeSortLabel} ${sortConfig.direction === "asc" ? "ascendente" : "descendente"}` : ""}
            </p>
            {activeKpi ? (
              <button className="active-filter-chip" type="button" onClick={onClearKpiFilter}>
                Filtro activo: {activeKpi.label}
                <X size={14} />
              </button>
            ) : null}
          </div>

          <div className="search-row">
            <label className="search-field">
              <Search size={18} />
              <input
                value={query}
                placeholder="Buscar por orden, seguridad, destino, tracking, responsable..."
                onChange={(event) => onQueryChange(event.target.value)}
              />
            </label>
          </div>

          <div className="filters-grid">
            <SelectField
              label="Tipo"
              value={filters.type}
              options={["Todos", ...typeOptions]}
              onChange={(value) => onUpdateFilter("type", value)}
            />
            <SelectField
              label="Estado"
              value={filters.status}
              options={["Todos", ...statusOptions]}
              onChange={(value) => onUpdateFilter("status", value)}
            />
            <SelectField
              label="Prioridad"
              value={filters.priority}
              options={["Todos", ...priorityOptions]}
              onChange={(value) => onUpdateFilter("priority", value)}
            />
            <SelectField
              label="País destino"
              value={filters.country}
              options={countries}
              onChange={(value) => onUpdateFilter("country", value)}
            />
            <SelectField
              label="Responsable"
              value={filters.responsible}
              options={["Todos", ...responsibleOptions]}
              onChange={(value) => onUpdateFilter("responsible", value)}
            />
            <TextField
              label="Desde"
              type="date"
              value={filters.from}
              onChange={(value) => onUpdateFilter("from", value)}
            />
            <TextField
              label="Hasta"
              type="date"
              value={filters.to}
              onChange={(value) => onUpdateFilter("to", value)}
            />
            <TextField
              label="Código seguridad"
              value={filters.securityCode}
              placeholder="240794"
              onChange={(value) => onUpdateFilter("securityCode", value)}
            />
            <TextField
              label="Tracking DHL"
              value={filters.tracking}
              placeholder="JD0146..."
              onChange={(value) => onUpdateFilter("tracking", value)}
            />
          </div>

          <div className="table-shell">
            <table className="orders-table">
              <thead>
                <tr>
                  <SortableHeader columnKey="id" label="Número de orden" sortConfig={sortConfig} onSortChange={onSortChange} />
                  <th>Código</th>
                  <SortableHeader columnKey="type" label="Tipo" sortConfig={sortConfig} onSortChange={onSortChange} />
                  <SortableHeader columnKey="country" label="País / destino" sortConfig={sortConfig} onSortChange={onSortChange} />
                  <SortableHeader columnKey="office" label="Embajada / oficina" sortConfig={sortConfig} onSortChange={onSortChange} />
                  <th>Consignatario</th>
                  <th>Destinatario</th>
                  <SortableHeader columnKey="createdAt" label="Creación" sortConfig={sortConfig} onSortChange={onSortChange} />
                  <SortableHeader columnKey="priority" label="Prioridad" sortConfig={sortConfig} onSortChange={onSortChange} />
                  <SortableHeader columnKey="status" label="Estado" sortConfig={sortConfig} onSortChange={onSortChange} />
                  <SortableHeader columnKey="tracking" label="Tracking DHL" sortConfig={sortConfig} onSortChange={onSortChange} />
                  <SortableHeader columnKey="responsible" label="Responsable" sortConfig={sortConfig} onSortChange={onSortChange} />
                  <SortableHeader columnKey="updatedAt" label="Última actualización" sortConfig={sortConfig} onSortChange={onSortChange} />
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={selectedOrder.id === order.id ? "selected-row" : ""}
                    onClick={() => onSelectOrder(order)}
                  >
                    <td>
                      <button className="order-link" onClick={() => onSelectOrder(order)}>
                        {order.id}
                        <ChevronRight size={15} />
                      </button>
                    </td>
                    <td>{order.securityCode || "-"}</td>
                    <td>
                      <Badge tone={order.type === "Exportación" ? "danger-soft" : order.type === "Importación" ? "teal-soft" : "blue-soft"}>
                        {order.type}
                      </Badge>
                    </td>
                    <td>
                      <strong>{order.country}</strong>
                    </td>
                    <td>{order.office}</td>
                    <td>{order.consignor}</td>
                    <td>{order.recipient}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <Badge tone={priorityMeta[order.priority].tone}>{order.priority}</Badge>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(event) => onUpdateStatus(order.id, event.target.value)}
                        onClick={(event) => event.stopPropagation()}
                        disabled={!userCanEditOrders}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{order.tracking || "Pendiente"}</td>
                    <td>{order.responsible}</td>
                    <td>{formatDate(order.updatedAt)}</td>
                  </tr>
                ))}
                {!filteredOrders.length ? (
                  <tr>
                    <td className="empty-table-cell" colSpan={13}>
                      No hay órdenes que coincidan con la búsqueda y filtros actuales.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <OrderDetail
          lookupMessage={lookupMessage}
          newComment={newComment}
          order={selectedOrder}
          statusOptions={statusOptions}
          userCanAnnulOrders={userCanAnnulOrders}
          userCanEditOrders={userCanEditOrders}
          trackingDraft={trackingDraft}
          trackingSaveMessage={trackingSaveMessage}
          onAddComment={onAddComment}
          onAnnulOrder={onAnnulOrder}
          onEditOrder={onEditOrder}
          onSaveTracking={onSaveTracking}
          onSetNewComment={onSetNewComment}
          onSetTrackingDraft={onSetTrackingDraft}
          onSimulateLookup={onSimulateLookup}
          onUpdateStatus={onUpdateStatus}
        />
      </section>
    </>
  );
}
