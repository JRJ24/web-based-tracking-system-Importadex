import { useMemo } from "react";
import ReportsView from "../components/reports/ReportsView";
import { typeOptions } from "../data/mockData";
import { useTracking } from "../context/TrackingContext";
import type { ReportFilters } from "../interfaces/report";
import {
  appReportRows,
  average,
  buildMonthlySeries,
  emptyReportFilters,
  getUnique,
  groupRows,
  reportRowMatchesPriority,
  reportRowMatchesStatus,
  sum,
} from "../lib/appHelpers";

export default function ReportsPage() {
  const {
    countryCatalog,
    officeCatalog,
    reportFilters,
    setReportFilters,
    statusOptions,
  } = useTracking();

  const offices = useMemo(
    () => [
      "Todos",
      ...Array.from(new Set([...officeCatalog, ...appReportRows.map((row) => row.office)])).filter(Boolean).sort(),
    ],
    [officeCatalog],
  );

  const reportCountries = useMemo(
    () => [
      "Todos",
      ...Array.from(new Set([...countryCatalog, ...appReportRows.map((row) => row.country)])).filter(Boolean).sort(),
    ],
    [countryCatalog],
  );

  const reportYears = useMemo(() => getUnique(appReportRows, "year"), []);
  const reportMonths = useMemo(
    () => ["Todos", ...Array.from(new Set(appReportRows.map((row) => row.monthKey))).sort()],
    [],
  );

  const filteredReports = useMemo(() => {
    return appReportRows.filter((row) => {
      return (
        (reportFilters.year === "Todos" || row.year === reportFilters.year) &&
        (reportFilters.month === "Todos" || row.monthKey === reportFilters.month) &&
        (reportFilters.type === "Todos" || row.type === reportFilters.type) &&
        (reportFilters.country === "Todos" || row.country === reportFilters.country) &&
        (reportFilters.office === "Todos" || row.office === reportFilters.office) &&
        reportRowMatchesStatus(row, reportFilters.status) &&
        reportRowMatchesPriority(row, reportFilters.priority) &&
        (reportFilters.responsible === "Todos" || row.responsible === reportFilters.responsible) &&
        (!reportFilters.from || row.lastUpdate >= reportFilters.from) &&
        (!reportFilters.to || row.lastUpdate <= reportFilters.to) &&
        (!reportFilters.deliveredOnly || row.delivered > 0) &&
        (!reportFilters.incidentsOnly || row.incidents > 0) &&
        (!reportFilters.tracking || String(row.dhlGenerated).includes(reportFilters.tracking))
      );
    });
  }, [reportFilters]);

  const monthlySeries = useMemo(() => buildMonthlySeries(filteredReports), [filteredReports]);
  const countryVolume = useMemo(() => groupRows(filteredReports, "country", 8), [filteredReports]);
  const officeVolume = useMemo(() => groupRows(filteredReports, "office", 8), [filteredReports]);

  const typeDistribution = useMemo(
    () =>
      typeOptions
        .map((type) => ({
          name: type,
          value: sum(
            filteredReports.filter((row) => row.type === type),
            "requests",
          ),
        }))
        .filter((item) => item.value > 0),
    [filteredReports],
  );

  const deliveryByType = useMemo(
    () =>
      ["ImportaciÃ³n", "ExportaciÃ³n"]
        .map((type) => {
          const rows = filteredReports.filter((row) => row.type === type);
          return {
            name: type,
            promedio: Number(average(rows, "avgDeliveryDays").toFixed(1)),
          };
        })
        .filter((item) => item.promedio > 0),
    [filteredReports],
  );

  const statusDistribution = useMemo(
    () => [
      { name: "Entregadas", value: sum(filteredReports, "delivered"), color: "#27845b" },
      { name: "Pendientes", value: sum(filteredReports, "pending"), color: "#f2b705" },
      { name: "Incidencias", value: sum(filteredReports, "incidents"), color: "#d71920" },
    ],
    [filteredReports],
  );

  const reportKpis = useMemo(() => {
    const topCountry = groupRows(filteredReports, "country", 1)[0];
    const topOffice = groupRows(filteredReports, "office", 1)[0];
    const total = sum(filteredReports, "requests");
    const delivered = sum(filteredReports, "delivered");

    return {
      total,
      imports: sum(
        filteredReports.filter((row) => row.type === "ImportaciÃ³n"),
        "requests",
      ),
      exports: sum(
        filteredReports.filter((row) => row.type === "ExportaciÃ³n"),
        "requests",
      ),
      topCountry: topCountry?.name || "Sin datos",
      topOffice: topOffice?.name || "Sin datos",
      delivered,
      pending: sum(filteredReports, "pending"),
      incidents: sum(filteredReports, "incidents"),
      avg: `${average(filteredReports, "avgDeliveryDays").toFixed(1)} dÃ­as`,
      compliance: total ? `${Math.round((delivered / total) * 100)}%` : "0%",
    };
  }, [filteredReports]);

  function updateReportFilter(key: keyof ReportFilters, value: string | boolean) {
    setReportFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <ReportsView
      countryVolume={countryVolume}
      filteredReports={filteredReports}
      monthlySeries={monthlySeries}
      officeVolume={officeVolume}
      offices={offices}
      reportCountries={reportCountries}
      reportFilters={reportFilters}
      reportKpis={reportKpis}
      reportMonths={reportMonths}
      reportYears={reportYears}
      statusDistribution={statusDistribution}
      deliveryByType={deliveryByType}
      typeDistribution={typeDistribution}
      onReset={() => setReportFilters(emptyReportFilters)}
      onUpdateFilter={updateReportFilter}
      statusOptions={statusOptions}
    />
  );
}
