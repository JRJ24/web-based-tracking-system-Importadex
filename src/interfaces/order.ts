export interface OrderComment {
  author: string;
  text: string;
  date: string;
}

export interface OrderHistoryItem {
  date: string;
  status: string;
  source: string;
  note?: string;
}

export interface TrackingEvent {
  date: string;
  location: string;
  status: string;
}

export interface TrackingInfo {
  currentStatus: string;
  lastLocation: string;
  eta: string;
  events: TrackingEvent[];
}

export interface Order {
  id: string;
  securityCode: string;
  type: string;
  country: string;
  office: string;
  consignor: string;
  recipient: string;
  createdAt: string;
  shipDate: string;
  priority: string;
  status: string;
  tracking: string;
  responsible: string;
  updatedAt: string;
  destinationAddress: string;
  pickupAddress: string;
  packages: string;
  weight: string;
  content: string;
  evidenceUrl: string;
  comments: OrderComment[];
  history: OrderHistoryItem[];
  trackingInfo: TrackingInfo;
}

export interface OrderForm {
  type: string;
  shipDate: string;
  consignor: string;
  recipient: string;
  country: string;
  office: string;
  destinationAddress: string;
  pickupAddress: string;
  priority: string;
  packages: string;
  weight: string;
  content: string;
  securityCode: string;
  evidenceUrl: string;
  tracking: string;
  responsible: string;
  status: string;
  internalComment: string;
}

export interface OrderFilters {
  type: string;
  status: string;
  priority: string;
  country: string;
  responsible: string;
  from: string;
  to: string;
  securityCode: string;
  tracking: string;
}

export type OrderSortKey =
  | "id"
  | "createdAt"
  | "type"
  | "country"
  | "office"
  | "priority"
  | "status"
  | "tracking"
  | "responsible"
  | "updatedAt";

export interface SortConfig {
  key: OrderSortKey | null;
  direction: "asc" | "desc";
}

export type KpiFilterId = "open" | "urgent" | "pendingDhl" | "inTransit" | "delivered" | "incidents";

export interface KpiCounts {
  open: number;
  urgent: number;
  pendingDhl: number;
  inTransit: number;
  delivered: number;
  incidents: number;
  avgDelivery: string;
}
