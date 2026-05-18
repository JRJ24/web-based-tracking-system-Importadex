export interface ReportRow {
  month: string;
  monthKey: string;
  year: string;
  type: string;
  country: string;
  office: string;
  requests: number;
  delivered: number;
  pending: number;
  incidents: number;
  urgent: number;
  avgDeliveryDays: number;
  dhlGenerated: number;
  dhlPending: number;
  compliance: number;
  responsible: string;
  lastUpdate: string;
}

export interface ReportFilters {
  from: string;
  to: string;
  month: string;
  year: string;
  type: string;
  country: string;
  office: string;
  status: string;
  priority: string;
  responsible: string;
  tracking: string;
  deliveredOnly: boolean;
  incidentsOnly: boolean;
}

export interface MonthlySeriesItem {
  month: string;
  monthKey: string;
  total: number;
  importaciones: number;
  exportaciones: number;
  entregadas: number;
  pendientes: number;
  urgentes: number;
  incidencias: number;
  guiasGeneradas: number;
  guiasPendientes: number;
}

export interface GroupedReportRow {
  name: string;
  solicitudes: number;
  entregadas: number;
  pendientes: number;
  incidencias: number;
  promedio: number[];
  promedioEntrega: number;
}

export interface ReportKpis {
  total: number;
  imports: number;
  exports: number;
  topCountry: string;
  topOffice: string;
  delivered: number;
  pending: number;
  incidents: number;
  avg: string;
  compliance: string;
}

export interface ChartDatum {
  name: string;
  value: number;
  color?: string;
}

export interface DeliveryByTypeDatum {
  name: string;
  promedio: number;
}
