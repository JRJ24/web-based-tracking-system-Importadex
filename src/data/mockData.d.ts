import type { Order } from "../interfaces/order";
import type { ReportRow } from "../interfaces/report";

export const statusOptions: string[];
export const priorityOptions: string[];
export const typeOptions: string[];
export const responsibleOptions: string[];
export const statusMeta: Record<string, { tone: string; progress: number }>;
export const priorityMeta: Record<string, { tone: string }>;
export const initialOrders: Order[];
export const reportRows: ReportRow[];
