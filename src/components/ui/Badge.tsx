import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: string;
  className?: string;
}

export default function Badge({ children, tone = "muted", className = "" }: BadgeProps) {
  return <span className={`badge badge-${tone} ${className}`}>{children}</span>;
}
