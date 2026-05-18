import { Plus, X, type LucideIcon } from "lucide-react";
import Badge from "../ui/Badge";
import TextField from "../ui/TextField";

interface CatalogManagerProps {
  icon: LucideIcon;
  items: string[];
  label: string;
  pluralLabel: string;
  value: string;
  onAdd: () => void;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

export default function CatalogManager({ icon: Icon, items, label, pluralLabel, value, onAdd, onChange, onRemove }: CatalogManagerProps) {
  return (
    <article className="catalog-panel">
      <div className="catalog-heading">
        <div>
          <Icon size={18} />
          <h3>{pluralLabel}</h3>
        </div>
        <Badge tone="blue-soft">{items.length}</Badge>
      </div>
      <div className="catalog-add">
        <TextField
          label={`Agregar ${label}`}
          value={value}
          placeholder={label}
          onChange={onChange}
        />
        <button className="secondary-action" onClick={onAdd}>
          <Plus size={16} />
          Agregar
        </button>
      </div>
      <div className="catalog-list">
        {items.map((item) => (
          <span key={item} className="catalog-chip">
            {item}
            <button type="button" onClick={() => onRemove(item)} aria-label={`Eliminar ${item}`}>
              <X size={13} />
            </button>
          </span>
        ))}
      </div>
    </article>
  );
}
