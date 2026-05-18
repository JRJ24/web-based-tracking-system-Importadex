import type { OrderSortKey, SortConfig } from "../../interfaces/order";

interface SortableHeaderProps {
  columnKey: OrderSortKey;
  label: string;
  onSortChange: (sortKey: OrderSortKey) => void;
  sortConfig: SortConfig;
}

export default function SortableHeader({ columnKey, label, onSortChange, sortConfig }: SortableHeaderProps) {
  const isActive = sortConfig.key === columnKey;
  const directionLabel = isActive && sortConfig.direction === "asc" ? "ascendente" : "descendente";

  return (
    <th aria-sort={isActive ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"}>
      <button className={`sort-header${isActive ? " active" : ""}`} type="button" onClick={() => onSortChange(columnKey)}>
        <span>{label}</span>
        <strong aria-hidden="true">{isActive ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕"}</strong>
        <span className="sr-only">
          {isActive ? `Orden ${directionLabel}.` : "Ordenar columna."}
        </span>
      </button>
    </th>
  );
}
