import { AlertTriangle, CheckCircle2, Clock3, Download, FileText, Filter, Globe2, MapPin, Plane, ShieldCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { priorityOptions, responsibleOptions } from "../../data/mockData";
import type { ChartDatum, DeliveryByTypeDatum, GroupedReportRow, MonthlySeriesItem, ReportFilters, ReportKpis, ReportRow } from "../../interfaces/report";
import { chartPalette, formatDate, typeColors } from "../../lib/appHelpers";
import Badge from "../ui/Badge";
import CheckboxField from "../ui/CheckboxField";
import IconStat from "../ui/IconStat";
import SelectField from "../ui/SelectField";
import TextField from "../ui/TextField";
import BuildingIcon from "./BuildingIcon";
import ChartPanel from "./ChartPanel";

interface ReportsViewProps {
  countryVolume: GroupedReportRow[];
  statusOptions: string[];
  filteredReports: ReportRow[];
  monthlySeries: MonthlySeriesItem[];
  officeVolume: GroupedReportRow[];
  offices: string[];
  reportCountries: string[];
  reportFilters: ReportFilters;
  reportKpis: ReportKpis;
  reportMonths: string[];
  reportYears: string[];
  statusDistribution: ChartDatum[];
  deliveryByType: DeliveryByTypeDatum[];
  typeDistribution: ChartDatum[];
  onReset: () => void;
  onUpdateFilter: (key: keyof ReportFilters, value: string | boolean) => void;
}

export default function ReportsView({
  countryVolume,
  statusOptions,
  filteredReports,
  monthlySeries,
  officeVolume,
  offices,
  reportCountries,
  reportFilters,
  reportKpis,
  reportMonths,
  reportYears,
  statusDistribution,
  deliveryByType,
  typeDistribution,
  onReset,
  onUpdateFilter,
}: ReportsViewProps) {
  return (
    <>
      <section className="report-hero">
        <div>
          <span className="eyebrow">Analítica ejecutiva-operativa</span>
          <h2>Reportes mensuales MIREX</h2>
          <p>
            Volumen, desempeño de entrega, destinos con mayor actividad, incidencias y control de guías DHL.
          </p>
        </div>
        <button className="primary-action">
          <Download size={18} />
          Exportar tabla
        </button>
      </section>

      <section className="report-filters">
        <TextField label="Desde" type="date" value={reportFilters.from} onChange={(value) => onUpdateFilter("from", value)} />
        <TextField label="Hasta" type="date" value={reportFilters.to} onChange={(value) => onUpdateFilter("to", value)} />
        <SelectField label="Mes" value={reportFilters.month} options={reportMonths} onChange={(value) => onUpdateFilter("month", value)} />
        <SelectField label="Año" value={reportFilters.year} options={reportYears} onChange={(value) => onUpdateFilter("year", value)} />
        <SelectField label="Tipo" value={reportFilters.type} options={["Todos", "Importación", "Exportación"]} onChange={(value) => onUpdateFilter("type", value)} />
        <SelectField label="País" value={reportFilters.country} options={reportCountries} onChange={(value) => onUpdateFilter("country", value)} />
        <SelectField label="Embajada / Consulado" value={reportFilters.office} options={offices} onChange={(value) => onUpdateFilter("office", value)} />
        <SelectField label="Estado operativo" value={reportFilters.status} options={["Todos", ...statusOptions]} onChange={(value) => onUpdateFilter("status", value)} />
        <SelectField label="Prioridad" value={reportFilters.priority} options={["Todos", ...priorityOptions]} onChange={(value) => onUpdateFilter("priority", value)} />
        <SelectField label="Responsable" value={reportFilters.responsible} options={["Todos", ...responsibleOptions]} onChange={(value) => onUpdateFilter("responsible", value)} />
        <TextField label="Tracking DHL" value={reportFilters.tracking} placeholder="Generadas..." onChange={(value) => onUpdateFilter("tracking", value)} />
        <CheckboxField label="Solo entregadas" checked={reportFilters.deliveredOnly} onChange={(value) => onUpdateFilter("deliveredOnly", value)} />
        <CheckboxField label="Con incidencia" checked={reportFilters.incidentsOnly} onChange={(value) => onUpdateFilter("incidentsOnly", value)} />
        <button className="ghost-button filter-reset" onClick={onReset}>
          <Filter size={16} />
          Limpiar
        </button>
      </section>

      <section className="executive-grid">
        <IconStat icon={FileText} label="Total solicitudes del mes" value={reportKpis.total} tone="neutral" />
        <IconStat icon={Globe2} label="Importaciones" value={reportKpis.imports} tone="teal" />
        <IconStat icon={Plane} label="Exportaciones" value={reportKpis.exports} tone="danger" />
        <IconStat icon={MapPin} label="País mayor volumen" value={reportKpis.topCountry} tone="gold" />
        <IconStat icon={BuildingIcon} label="Oficina mayor volumen" value={reportKpis.topOffice} tone="neutral" />
        <IconStat icon={CheckCircle2} label="Entregadas" value={reportKpis.delivered} tone="success" />
        <IconStat icon={Clock3} label="Pendientes" value={reportKpis.pending} tone="warning" />
        <IconStat icon={AlertTriangle} label="Incidencias" value={reportKpis.incidents} tone="danger" />
        <IconStat icon={Clock3} label="Tiempo promedio" value={reportKpis.avg} tone="teal" />
        <IconStat icon={ShieldCheck} label="Cumplimiento" value={reportKpis.compliance} tone="success" />
      </section>

      <section className="charts-grid">
        <ChartPanel title="Solicitudes por mes" subtitle="Volumen total mensual">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3f5f8f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Importación vs exportación" subtitle="Evolución comparativa mensual">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="importaciones" stroke={typeColors.Importación} strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="exportaciones" stroke={typeColors.Exportación} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Distribución por tipo" subtitle="Importaciones, exportaciones y locales">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={typeDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={4}
              >
                {typeDistribution.map((item, index) => (
                  <Cell key={item.name} fill={typeColors[item.name] || chartPalette[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend-row">
            {typeDistribution.map((item) => (
              <span key={item.name}>
                <i style={{ backgroundColor: typeColors[item.name] }} />
                {item.name}: {item.value}
              </span>
            ))}
          </div>
        </ChartPanel>

        <ChartPanel title="Destinos con mayor volumen" subtitle="Ranking por país destino">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryVolume} layout="vertical" margin={{ left: 28 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={92} />
              <Tooltip />
              <Bar dataKey="solicitudes" fill="#007a78" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Embajadas y consulados" subtitle="Oficinas internacionales con mayor actividad">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={officeVolume} layout="vertical" margin={{ left: 64 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={144} />
              <Tooltip />
              <Bar dataKey="solicitudes" fill="#f2b705" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Incidencias por mes" subtitle="Alertas operativas mensuales">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidencias" fill="#b42318" radius={[4, 4, 0, 0]} />
              <Bar dataKey="urgentes" fill="#e0a100" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Entregadas vs pendientes" subtitle="Cierre operativo mensual">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="entregadas" stackId="delivery" fill="#27845b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendientes" stackId="delivery" fill="#f2b705" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Guías DHL" subtitle="Generadas vs pendientes de guía">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlySeries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="guiasGeneradas" fill="#3f5f8f" radius={[4, 4, 0, 0]} />
              <Bar dataKey="guiasPendientes" fill="#d71920" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Solicitudes por estado" subtitle="Entregadas, pendientes e incidencias">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={4}
              >
                {statusDistribution.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend-row">
            {statusDistribution.map((item) => (
              <span key={item.name}>
                <i style={{ backgroundColor: item.color }} />
                {item.name}: {item.value}
              </span>
            ))}
          </div>
        </ChartPanel>

        <ChartPanel title="Tiempo promedio por tipo" subtitle="Días promedio de entrega">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deliveryByType}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="promedio" fill="#007a78" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Tiempo promedio por país" subtitle="Destinos con mayor tiempo operativo">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryVolume} layout="vertical" margin={{ left: 28 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={92} />
              <Tooltip />
              <Bar dataKey="promedioEntrega" fill="#765aa8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="report-table-section">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Tabla exportable conceptualmente</span>
            <h2>Resumen por país / embajada / consulado</h2>
          </div>
          <Badge tone="blue-soft">{filteredReports.length} filas</Badge>
        </div>
        <div className="table-shell">
          <table className="orders-table report-table">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Tipo</th>
                <th>País destino</th>
                <th>Embajada / Consulado / Oficina</th>
                <th>Solicitudes</th>
                <th>Entregadas</th>
                <th>Pendientes</th>
                <th>Incidencia</th>
                <th>Tiempo promedio</th>
                <th>Guías DHL</th>
                <th>Última actualización</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((row) => (
                <tr key={`${row.monthKey}-${row.type}-${row.country}-${row.office}`}>
                  <td>{row.month} {row.year}</td>
                  <td>
                    <Badge tone={row.type === "Exportación" ? "danger-soft" : "teal-soft"}>{row.type}</Badge>
                  </td>
                  <td>{row.country}</td>
                  <td>{row.office}</td>
                  <td>{row.requests}</td>
                  <td>{row.delivered}</td>
                  <td>{row.pending}</td>
                  <td>
                    <Badge tone={row.incidents ? "danger" : "success"}>
                      {row.incidents}
                    </Badge>
                  </td>
                  <td>{row.avgDeliveryDays.toFixed(1)} días</td>
                  <td>{row.dhlGenerated} gen. / {row.dhlPending} pend.</td>
                  <td>{formatDate(row.lastUpdate, { dateOnly: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
