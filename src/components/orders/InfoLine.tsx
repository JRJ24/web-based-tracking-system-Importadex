import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface InfoLineProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
}

export default function InfoLine({ icon: Icon, label, value }: InfoLineProps) {
  return (
    <div className="info-line">
      <Icon size={16} />
      <div>
        <span>{label}</span>
        <p>{value}</p>
      </div>
    </div>
  );
}
