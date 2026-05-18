import type { ReactNode } from "react";

interface ChartPanelProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function ChartPanel({ title, subtitle, children }: ChartPanelProps) {
  return (
    <section className="chart-panel">
      <div className="chart-heading">
        <h3>{title}</h3>
        <span>{subtitle}</span>
      </div>
      {children}
    </section>
  );
}
