import { AlertTriangle, FileText, PackageCheck, PackageSearch, Plane, type LucideIcon } from "lucide-react";
import {
  initialOrders,
  reportRows as baseReportRows,
  statusOptions as defaultStatusOptions,
} from "../data/mockData";
import { csvCatalogs, csvOrders, csvReportRows } from "../data/csvData";
import type { Catalogs } from "../interfaces/catalog";
import type { AppUser, AuthUser } from "../interfaces/user";
import type { KpiCounts, KpiFilterId, Order, OrderFilters, OrderForm, OrderSortKey, SortConfig } from "../interfaces/order";
import type { GroupedReportRow, MonthlySeriesItem, ReportFilters, ReportRow } from "../interfaces/report";

export const appInitialOrders: Order[] = [...csvOrders, ...initialOrders];
export const appReportRows: ReportRow[] = [...csvReportRows, ...baseReportRows];

export const typeColors: Record<string, string> = {
  Exportación: "#d71920",
  Importación: "#007a78",
  "Local/Nacional": "#3f5f8f",
};

export const chartPalette = ["#d71920", "#007a78", "#f2b705", "#5b6c9f", "#6f8f54", "#a05d3f"];

export const closedStatuses: string[] = ["Entregado", "Cancelado"];
export const inTransitStatuses = ["Recogido por DHL", "En tránsito", "En aduana", "En ruta de entrega"];
export const operationalStatusOrder = [
  "Nueva solicitud",
  "En revisión",
  "Pendiente de guía DHL",
  "Guía DHL generada",
  "Recogido por DHL",
  "En tránsito",
  "En aduana",
  "En ruta de entrega",
  "Entregado",
  "Incidencia",
  "Cancelado",
];
export const prioritySortRank: Record<string, number> = {
  Urgente: 1,
  Alta: 2,
  Normal: 3,
};
export const statusSortRank: Record<string, number> = Object.fromEntries(
  operationalStatusOrder.map((status, index) => [status, index + 1]),
);
export const textCollator = new Intl.Collator("es", { numeric: true, sensitivity: "base" });

export const kpiFilterDefinitions: Array<{
  id: KpiFilterId;
  metricKey: keyof KpiCounts;
  label: string;
  tone: string;
  icon: LucideIcon;
}> = [
  {
    id: "open",
    metricKey: "open",
    label: "Solicitudes abiertas",
    tone: "neutral",
    icon: PackageSearch,
  },
  {
    id: "urgent",
    metricKey: "urgent",
    label: "Urgentes",
    tone: "warning",
    icon: AlertTriangle,
  },
  {
    id: "pendingDhl",
    metricKey: "pendingDhl",
    label: "Pendientes guía DHL",
    tone: "gold",
    icon: FileText,
  },
  {
    id: "inTransit",
    metricKey: "inTransit",
    label: "En tránsito",
    tone: "teal",
    icon: Plane,
  },
  {
    id: "delivered",
    metricKey: "delivered",
    label: "Entregadas",
    tone: "success",
    icon: PackageCheck,
  },
  {
    id: "incidents",
    metricKey: "incidents",
    label: "Incidencias",
    tone: "danger",
    icon: AlertTriangle,
  },
];

export const sortColumnLabels: Record<OrderSortKey, string> = {
  id: "Número de orden",
  createdAt: "Creación",
  type: "Tipo",
  country: "País / destino",
  office: "Embajada / oficina",
  priority: "Prioridad",
  status: "Estado",
  tracking: "Tracking DHL",
  responsible: "Responsable",
  updatedAt: "Última actualización",
};

export const emptyFilters: OrderFilters = {
  type: "Todos",
  status: "Todos",
  priority: "Todos",
  country: "Todos",
  responsible: "Todos",
  from: "",
  to: "",
  securityCode: "",
  tracking: "",
};

export const emptyReportFilters: ReportFilters = {
  from: "",
  to: "",
  month: "Todos",
  year: "Todos",
  type: "Todos",
  country: "Todos",
  office: "Todos",
  status: "Todos",
  priority: "Todos",
  responsible: "Todos",
  tracking: "",
  deliveredOnly: false,
  incidentsOnly: false,
};

export const roleOptions = [
  "Personal MIREX",
  "Operaciones Importadex / Flypack",
  "Administrador",
];

export const userStatusOptions = ["Activo", "Pendiente", "Suspendido"];

export const storageKeys = {
  users: "mirex-tracking-users",
  session: "mirex-tracking-session",
  catalogs: "mirex-tracking-catalogs",
  orders: "mirex-tracking-orders",
};

export const defaultNewOrderForm: OrderForm = {
  type: "Exportación",
  shipDate: "",
  consignor: "",
  recipient: "",
  country: "",
  office: "",
  destinationAddress: "",
  pickupAddress:
    "Ministerio de Relaciones Exteriores, Av. Independencia #752, Estancia San Gerónimo, Santo Domingo, República Dominicana",
  priority: "Normal",
  packages: "1 paquete",
  weight: "",
  content: "",
  securityCode: "",
  evidenceUrl: "",
  tracking: "",
  responsible: "Operaciones MIREX",
  status: "Nueva solicitud",
  internalComment: "",
};

export const destinationSuggestions = [
  "Guadalupe",
  "Estados Unidos",
  "España",
  "Francia",
  "Panamá",
  "Colombia",
  "México",
  "Chile",
  "Argentina",
  "Italia",
  "Alemania",
  "República Dominicana",
];

export const officeSuggestions = [
  "Embajada Dominicana en España",
  "Consulado General en Nueva York",
  "Consulado General en Guadalupe",
  "Embajada Dominicana en Francia",
  "Embajada Dominicana en Panamá",
  "Consulado General en Miami",
  "Embajada Dominicana en Colombia",
  "Embajada Dominicana en México",
  "Oficina Regional MIREX Santiago",
];

export const defaultUsers: AppUser[] = [
  {
    id: "USR-001",
    name: "Administrador Demo",
    email: "admin@mirex.local",
    password: "Admin2026!",
    role: "Administrador",
    institution: "Importadex / Flypack",
    status: "Activo",
    createdAt: "2026-05-08T08:00:00",
  },
  {
    id: "USR-002",
    name: "Operaciones MIREX",
    email: "operacionesmirex@importadex.do",
    password: "Mirex2026!",
    role: "Operaciones Importadex / Flypack",
    institution: "Importadex / Flypack",
    status: "Activo",
    createdAt: "2026-05-08T08:05:00",
  },
  {
    id: "USR-003",
    name: "Usuario MIREX Demo",
    email: "mirex.demo@mirex.gob.do",
    password: "Mirex2026!",
    role: "Personal MIREX",
    institution: "MIREX",
    status: "Activo",
    createdAt: "2026-05-08T08:10:00",
  },
];

export const defaultCatalogs: Catalogs = {
  countries: Array.from(new Set([...destinationSuggestions, ...csvCatalogs.countries])).sort(),
  offices: Array.from(new Set([...officeSuggestions, ...csvCatalogs.offices])).sort(),
  statuses: Array.from(new Set([...defaultStatusOptions, ...csvCatalogs.statuses])).sort(),
};

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Frontend prototype: localStorage may be unavailable in private contexts.
  }
}

export function stripPassword(user: AppUser | null): AuthUser | null {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export function mergeCatalogs(catalogs: Partial<Catalogs> | null | undefined): Catalogs {
  return {
    countries: Array.from(new Set([...(catalogs?.countries || []), ...defaultCatalogs.countries])).sort(),
    offices: Array.from(new Set([...(catalogs?.offices || []), ...defaultCatalogs.offices])).sort(),
    statuses: Array.from(new Set([...(catalogs?.statuses || []), ...defaultCatalogs.statuses])).sort(),
  };
}

export function getLocalDateTimeValue(date = new Date()): string {
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return adjusted.toISOString().slice(0, 16);
}

export function orderToForm(order: Order): OrderForm {
  return {
    type: order.type || "Exportación",
    shipDate: getLocalDateTimeValue(new Date(order.shipDate || order.createdAt || Date.now())),
    consignor: order.consignor || "",
    recipient: order.recipient || "",
    country: order.country || "",
    office: order.office || "",
    destinationAddress: order.destinationAddress || "",
    pickupAddress: order.pickupAddress || defaultNewOrderForm.pickupAddress,
    priority: order.priority || "Normal",
    packages: order.packages || "1 paquete",
    weight: order.weight || "",
    content: order.content || "",
    securityCode: order.securityCode || "",
    evidenceUrl: order.evidenceUrl === "Pendiente de evidencia" ? "" : order.evidenceUrl || "",
    tracking: order.tracking || "",
    responsible: order.responsible || "Operaciones MIREX",
    status: order.status || "Nueva solicitud",
    internalComment: "",
  };
}

export function formatDate(value?: string, options: { dateOnly?: boolean } = {}): string {
  if (!value || value === "Por definir" || value === "Pendiente de resolución") return value || "No disponible";
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: options.dateOnly ? "medium" : "medium",
    timeStyle: options.dateOnly ? undefined : "short",
  }).format(new Date(value));
}

export function getUnique<T, K extends keyof T>(items: T[], key: K): string[] {
  return ["Todos", ...Array.from(new Set(items.map((item) => item[key]).filter(Boolean).map(String))).sort()];
}

export function sum<T, K extends keyof T>(items: T[], key: K): number {
  return items.reduce((total, item) => total + Number(item[key] || 0), 0);
}

export function average<T, K extends keyof T>(items: T[], key: K): number {
  if (!items.length) return 0;
  return items.reduce((total, item) => total + Number(item[key] || 0), 0) / items.length;
}

export function buildMonthlySeries(rows: ReportRow[]): MonthlySeriesItem[] {
  const monthOrder = Array.from(new Set(rows.map((row) => row.monthKey))).sort();
  return monthOrder
    .map((monthKey) => {
      const monthRows = rows.filter((row) => row.monthKey === monthKey);
      if (!monthRows.length) return null;
      return {
        month: monthRows[0].month.slice(0, 3),
        monthKey,
        total: sum(monthRows, "requests"),
        importaciones: sum(
          monthRows.filter((row) => row.type === "Importación"),
          "requests",
        ),
        exportaciones: sum(
          monthRows.filter((row) => row.type === "Exportación"),
          "requests",
        ),
        entregadas: sum(monthRows, "delivered"),
        pendientes: sum(monthRows, "pending"),
        urgentes: sum(monthRows, "urgent"),
        incidencias: sum(monthRows, "incidents"),
        guiasGeneradas: sum(monthRows, "dhlGenerated"),
        guiasPendientes: sum(monthRows, "dhlPending"),
      };
    })
    .filter((item): item is MonthlySeriesItem => Boolean(item));
}

export function reportRowMatchesStatus(row: ReportRow, status: string): boolean {
  if (status === "Todos") return true;
  if (status === "Entregado") return row.delivered > 0;
  if (status === "Incidencia") return row.incidents > 0;
  if (status === "Pendiente de guía DHL") return row.dhlPending > 0;
  if (status === "Guía DHL generada") return row.dhlGenerated > 0;
  if (["Nueva solicitud", "En revisión", "Recogido por DHL", "En tránsito", "En aduana", "En ruta de entrega"].includes(status)) {
    return row.pending > 0;
  }
  return status !== "Cancelado";
}

export function reportRowMatchesPriority(row: ReportRow, priority: string): boolean {
  if (priority === "Todos") return true;
  if (priority === "Urgente") return row.urgent > 0;
  if (priority === "Alta") return row.requests - row.urgent > 3;
  return row.requests - row.urgent > 0;
}

export function groupRows(rows: ReportRow[], key: keyof ReportRow, limit = 8): GroupedReportRow[] {
  const grouped = rows.reduce<Record<string, Omit<GroupedReportRow, "promedioEntrega">>>((acc, item) => {
    const label = String(item[key]);
    if (!acc[label]) {
      acc[label] = {
        name: label,
        solicitudes: 0,
        entregadas: 0,
        pendientes: 0,
        incidencias: 0,
        promedio: [],
      };
    }
    acc[label].solicitudes += item.requests;
    acc[label].entregadas += item.delivered;
    acc[label].pendientes += item.pending;
    acc[label].incidencias += item.incidents;
    acc[label].promedio.push(item.avgDeliveryDays);
    return acc;
  }, {});

  return Object.values(grouped)
    .map((item): GroupedReportRow => ({
      ...item,
      promedioEntrega:
        item.promedio.reduce((total, value) => total + value, 0) / item.promedio.length,
    }))
    .sort((a, b) => b.solicitudes - a.solicitudes)
    .slice(0, limit);
}

export function orderIsOpen(order: Order): boolean {
  return !closedStatuses.includes(order.status);
}

export function orderNeedsDhlGuide(order: Order): boolean {
  return order.status === "Pendiente de guía DHL" || !order.tracking?.trim();
}

export function orderIsInTransit(order: Order): boolean {
  return inTransitStatuses.includes(order.status);
}

export function getAverageDeliveryLabel(orders: Order[]): string {
  const deliveryDurations = orders
    .filter((order) => order.status === "Entregado")
    .map((order) => {
      const createdAt = Date.parse(order.createdAt);
      const updatedAt = Date.parse(order.updatedAt);
      if (!createdAt || !updatedAt || updatedAt < createdAt) return null;
      return (updatedAt - createdAt) / 86400000;
    })
    .filter((duration): duration is number => duration !== null);

  if (!deliveryDurations.length) return "0.0 días";

  const averageDays = deliveryDurations.reduce((total, duration) => total + duration, 0) / deliveryDurations.length;
  return `${averageDays.toFixed(1)} días`;
}

export function orderMatchesKpiFilter(order: Order, activeKpiFilter: KpiFilterId | null): boolean {
  if (!activeKpiFilter) return true;

  switch (activeKpiFilter) {
    case "open":
      return orderIsOpen(order);
    case "urgent":
      return order.priority === "Urgente";
    case "pendingDhl":
      return orderNeedsDhlGuide(order);
    case "inTransit":
      return orderIsInTransit(order);
    case "delivered":
      return order.status === "Entregado";
    case "incidents":
      return order.status === "Incidencia";
    default:
      return true;
  }
}

export function getKpiCounts(orders: Order[]): KpiCounts {
  return {
    open: orders.filter(orderIsOpen).length,
    urgent: orders.filter((order) => order.priority === "Urgente").length,
    pendingDhl: orders.filter(orderNeedsDhlGuide).length,
    inTransit: orders.filter(orderIsInTransit).length,
    delivered: orders.filter((order) => order.status === "Entregado").length,
    incidents: orders.filter((order) => order.status === "Incidencia").length,
    avgDelivery: getAverageDeliveryLabel(orders),
  };
}

export function applyKpiFilter(orders: Order[], activeKpiFilter: KpiFilterId | null): Order[] {
  return orders.filter((order) => orderMatchesKpiFilter(order, activeKpiFilter));
}

export function applySearchFilter(orders: Order[], query: string): Order[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return orders;

  return orders.filter((order) => {
    const searchable = [
      order.id,
      order.securityCode,
      order.type,
      order.country,
      order.office,
      order.consignor,
      order.recipient,
      order.status,
      order.tracking,
      order.responsible,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalizedQuery);
  });
}

export function applyManualFilters(orders: Order[], filters: OrderFilters): Order[] {
  return orders.filter((order) => {
    const created = order.createdAt.slice(0, 10);

    return (
      (filters.type === "Todos" || order.type === filters.type) &&
      (filters.status === "Todos" || order.status === filters.status) &&
      (filters.priority === "Todos" || order.priority === filters.priority) &&
      (filters.country === "Todos" || order.country === filters.country) &&
      (filters.responsible === "Todos" || order.responsible === filters.responsible) &&
      (!filters.from || created >= filters.from) &&
      (!filters.to || created <= filters.to) &&
      (!filters.securityCode ||
        String(order.securityCode || "").toLowerCase().includes(filters.securityCode.toLowerCase())) &&
      (!filters.tracking ||
        String(order.tracking || "").toLowerCase().includes(filters.tracking.toLowerCase()))
    );
  });
}

export function getOrderSortValue(order: Order, sortKey: OrderSortKey): number | string {
  switch (sortKey) {
    case "createdAt":
      return Date.parse(order.createdAt) || 0;
    case "updatedAt":
      return Date.parse(order.updatedAt) || 0;
    case "priority":
      return prioritySortRank[order.priority] || 99;
    case "status":
      return statusSortRank[order.status] || 99;
    case "id":
      return order.id;
    case "type":
      return order.type;
    case "country":
      return order.country;
    case "office":
      return order.office;
    case "tracking":
      return order.tracking || "";
    case "responsible":
      return order.responsible;
    default:
      return "";
  }
}

export function compareOrderValues(a: Order, b: Order, sortKey: OrderSortKey): number {
  const valueA = getOrderSortValue(a, sortKey);
  const valueB = getOrderSortValue(b, sortKey);

  if (typeof valueA === "number" && typeof valueB === "number") {
    return valueA - valueB;
  }

  return textCollator.compare(String(valueA), String(valueB));
}

export function sortOrders(orders: Order[], sortConfig: SortConfig): Order[] {
  if (!sortConfig.key) return orders;
  const sortKey = sortConfig.key;

  return [...orders].sort((a, b) => {
    const comparison = compareOrderValues(a, b, sortKey);
    if (comparison !== 0) {
      return sortConfig.direction === "asc" ? comparison : -comparison;
    }
    return textCollator.compare(a.id, b.id);
  });
}
