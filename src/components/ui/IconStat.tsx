import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface IconStatProps {
  activeLabel?: string;
  detail?: ReactNode;
  icon: LucideIcon;
  isActive?: boolean;
  label: ReactNode;
  onClick?: () => void;
  tone?: string;
  value: ReactNode;
}

export default function IconStat({
  activeLabel = "Filtro activo",
  detail,
  icon: Icon,
  isActive = false,
  label,
  onClick,
  tone = "neutral",
  value,
}: IconStatProps) {
  const content = (
    <>
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {isActive ? <em>{activeLabel}</em> : null}
        {detail ? <span>{detail}</span> : null}
      </div>
    </>
  );

  const className = `stat-card stat-${tone}${onClick ? " stat-interactive" : ""}${isActive ? " is-active" : ""}`;

  if (onClick) {
    return (
      <button type="button" className={className} aria-pressed={isActive} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <section className={className}>
      {content}
    </section>
  );
}
