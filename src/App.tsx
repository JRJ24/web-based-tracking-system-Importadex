import { useEffect, useMemo, useState, type FormEvent } from "react";
import { BarChart3, FileText, LayoutDashboard, LogOut, Settings, Upload } from "lucide-react";
import AuthScreen from "./components/auth/AuthScreen";
import MaintenanceView from "./components/maintenance/MaintenanceView";
import ConfirmAnnulModal from "./components/orders/ConfirmAnnulModal";
import NewOrderModal from "./components/orders/NewOrderModal";
import OrdersView from "./components/orders/OrdersView";
import ReportsView from "./components/reports/ReportsView";
import Badge from "./components/ui/Badge";
import { typeOptions } from "./data/mockData";
import type { CatalogDrafts, CatalogKind, Catalogs } from "./interfaces/catalog";
import type { AppUser, AuthUser, LoginForm, RegisterForm } from "./interfaces/user";
import type { KpiFilterId, Order, OrderFilters, OrderForm, OrderSortKey, SortConfig } from "./interfaces/order";
import type { ReportFilters } from "./interfaces/report";
import {
  appInitialOrders,
  appReportRows,
  applyKpiFilter,
  applyManualFilters,
  applySearchFilter,
  average,
  buildMonthlySeries,
  defaultCatalogs,
  defaultNewOrderForm,
  defaultUsers,
  emptyFilters,
  emptyReportFilters,
  getKpiCounts,
  getLocalDateTimeValue,
  getUnique,
  groupRows,
  mergeCatalogs,
  orderToForm,
  readStorage,
  reportRowMatchesPriority,
  reportRowMatchesStatus,
  sortOrders,
  storageKeys,
  stripPassword,
  sum,
  writeStorage,
} from "./lib/appHelpers";

type ActiveView = "orders" | "reports" | "maintenance";
type AuthMode = "login" | "register";
type EditableUserKey = "role" | "status";

function App() {
  const [users, setUsers] = useState<AppUser[]>(() => readStorage(storageKeys.users, defaultUsers));
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => readStorage<AuthUser | null>(storageKeys.session, null));
  const [catalogs, setCatalogs] = useState<Catalogs>(() =>
    mergeCatalogs(readStorage<Partial<Catalogs>>(storageKeys.catalogs, defaultCatalogs)),
  );
  const [orders, setOrders] = useState<Order[]>(() => readStorage(storageKeys.orders, appInitialOrders));
  const [selectedOrderId, setSelectedOrderId] = useState(() => orders[0]?.id || appInitialOrders[0].id);
  const [activeView, setActiveView] = useState<ActiveView>("orders");
  const [filters, setFilters] = useState<OrderFilters>(emptyFilters);
  const [activeKpiFilter, setActiveKpiFilter] = useState<KpiFilterId | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "asc" });
  const [reportFilters, setReportFilters] = useState<ReportFilters>(emptyReportFilters);
  const [query, setQuery] = useState("");
  const [newComment, setNewComment] = useState("");
  const [trackingDraft, setTrackingDraft] = useState(() => orders[0]?.tracking || "");
  const [trackingSaveMessage, setTrackingSaveMessage] = useState("");
  const [lookupMessage, setLookupMessage] = useState("");
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState<OrderForm>(() => ({
    ...defaultNewOrderForm,
    shipDate: getLocalDateTimeValue(),
  }));
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [editOrderForm, setEditOrderForm] = useState<OrderForm>(defaultNewOrderForm);
  const [orderPendingAnnul, setOrderPendingAnnul] = useState<Order | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authMessage, setAuthMessage] = useState("");
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "admin@mirex.local",
    password: "Admin2026!",
  });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    institution: "MIREX",
  });
  const [newCatalogItems, setNewCatalogItems] = useState<CatalogDrafts>({
    countries: "",
    offices: "",
    statuses: "",
  });

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) || orders[0] || appInitialOrders[0];
  const role = authUser?.role || "Personal MIREX";
  const statusOptions = catalogs.statuses;
  const countryCatalog = catalogs.countries;
  const officeCatalog = catalogs.offices;
  const userCanMaintain = role === "Administrador";
  const userCanEditOrders = ["Administrador", "Operaciones Importadex / Flypack"].includes(role);
  const userCanAnnulOrders = role === "Administrador";

  const countries = useMemo(
    () => [
      "Todos",
      ...Array.from(new Set([...countryCatalog, ...orders.map((order) => order.country)])).filter(Boolean).sort(),
    ],
    [countryCatalog, orders],
  );
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

  useEffect(() => {
    writeStorage(storageKeys.users, users);
  }, [users]);

  useEffect(() => {
    writeStorage(storageKeys.catalogs, catalogs);
  }, [catalogs]);

  useEffect(() => {
    writeStorage(storageKeys.orders, orders);
  }, [orders]);

  useEffect(() => {
    if (authUser) {
      writeStorage(storageKeys.session, authUser);
    } else {
      try {
        window.localStorage.removeItem(storageKeys.session);
      } catch {
        // Frontend prototype: localStorage may be unavailable in private contexts.
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (activeView === "maintenance" && !userCanMaintain) {
      setActiveView("orders");
    }
  }, [activeView, userCanMaintain]);

  const manuallyFilteredOrders = useMemo(
    () => applyManualFilters(applySearchFilter(orders, query), filters),
    [filters, orders, query],
  );

  const metrics = useMemo(() => getKpiCounts(manuallyFilteredOrders), [manuallyFilteredOrders]);

  const filteredOrders = useMemo(
    () => sortOrders(applyKpiFilter(manuallyFilteredOrders, activeKpiFilter), sortConfig),
    [activeKpiFilter, manuallyFilteredOrders, sortConfig],
  );

  useEffect(() => {
    if (activeView !== "orders" || !filteredOrders.length) return;
    if (filteredOrders.some((order) => order.id === selectedOrderId)) return;

    setSelectedOrderId(filteredOrders[0].id);
    setTrackingDraft(filteredOrders[0].tracking || "");
    setTrackingSaveMessage("");
    setLookupMessage("");
  }, [activeView, filteredOrders, selectedOrderId]);

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
      ["Importación", "Exportación"]
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
    const pending = sum(filteredReports, "pending");
    const incidents = sum(filteredReports, "incidents");
    return {
      total,
      imports: sum(
        filteredReports.filter((row) => row.type === "Importación"),
        "requests",
      ),
      exports: sum(
        filteredReports.filter((row) => row.type === "Exportación"),
        "requests",
      ),
      topCountry: topCountry?.name || "Sin datos",
      topOffice: topOffice?.name || "Sin datos",
      delivered,
      pending,
      incidents,
      avg: `${average(filteredReports, "avgDeliveryDays").toFixed(1)} días`,
      compliance: total ? `${Math.round((delivered / total) * 100)}%` : "0%",
    };
  }, [filteredReports]);

  function updateFilter(key: keyof OrderFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetOrderFilters() {
    setFilters(emptyFilters);
    setQuery("");
    setActiveKpiFilter(null);
  }

  function toggleKpiFilter(filterId: KpiFilterId) {
    setActiveKpiFilter((current) => (current === filterId ? null : filterId));
  }

  function updateSort(sortKey: OrderSortKey) {
    setSortConfig((current) => {
      if (current.key === sortKey) {
        return {
          key: sortKey,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }

      return { key: sortKey, direction: "asc" };
    });
  }

  function updateReportFilter(key: keyof ReportFilters, value: string | boolean) {
    setReportFilters((current) => ({ ...current, [key]: value }));
  }

  function selectOrder(order: Order) {
    setSelectedOrderId(order.id);
    setTrackingDraft(order.tracking);
    setTrackingSaveMessage("");
    setLookupMessage("");
  }

  function updateOrderStatus(orderId: string, status: string) {
    if (!userCanEditOrders) return;
    const now = new Date().toISOString();
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              updatedAt: now,
              history: [
                ...order.history,
                {
                  date: now,
                  status,
                  source: "Usuario prototipo",
                  note: "Estado actualizado manualmente desde el dashboard.",
                },
              ],
            }
          : order,
      ),
    );
  }

  function saveTracking() {
    if (!userCanEditOrders) return;
    const normalizedTracking = trackingDraft.trim();

    if (!normalizedTracking) {
      setTrackingSaveMessage("Ingresa un número de tracking antes de guardarlo.");
      return;
    }

    if ((selectedOrder.tracking || "").trim() === normalizedTracking) {
      setTrackingSaveMessage(`El tracking ${normalizedTracking} ya está guardado en esta orden.`);
      return;
    }

    const now = new Date().toISOString();
    const selectedOrderForTracking = selectedOrder.id;
    // DHL API / base de datos interna: en producción este guardado debe persistirse en backend.
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== selectedOrderForTracking) return order;

        const previousTracking = order.tracking?.trim();
        const shouldPromoteStatus =
          !previousTracking &&
          ["Nueva solicitud", "En revisión", "Pendiente de guía DHL"].includes(order.status);
        const nextStatus = shouldPromoteStatus ? "Guía DHL generada" : order.status;

        return {
          ...order,
          tracking: normalizedTracking,
          updatedAt: now,
          status: nextStatus,
          trackingInfo: {
            ...order.trackingInfo,
            currentStatus:
              order.trackingInfo.currentStatus === "Sin guía generada" || shouldPromoteStatus
                ? "Guía DHL generada"
                : order.trackingInfo.currentStatus,
            lastLocation:
              order.trackingInfo.currentStatus === "Sin guía generada"
                ? "Operaciones Importadex / Flypack"
                : order.trackingInfo.lastLocation,
            events: [
              {
                date: now,
                location: "Operaciones Importadex / Flypack",
                status: previousTracking ? "Tracking DHL actualizado" : "Guía DHL registrada",
              },
              ...order.trackingInfo.events,
            ],
          },
          history: [
            ...order.history,
            {
              date: now,
              status: previousTracking ? "Tracking DHL actualizado" : "Guía DHL agregada",
              source: role,
              note: previousTracking
                ? `Tracking ${previousTracking} reemplazado por ${normalizedTracking}.`
                : `Tracking DHL ${normalizedTracking} agregado a la orden.`,
            },
          ],
        };
      }),
    );
    setTrackingDraft(normalizedTracking);
    setTrackingSaveMessage(`Tracking ${normalizedTracking} guardado en la orden ${selectedOrder.id}.`);
    setLookupMessage("");
  }

  function addComment() {
    if (!newComment.trim()) return;
    const now = new Date().toISOString();
    setOrders((current) =>
      current.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              updatedAt: now,
              comments: [
                ...order.comments,
                {
                  author: role,
                  text: newComment.trim(),
                  date: now,
                },
              ],
              history: [
                ...order.history,
                {
                  date: now,
                  status: "Comentario interno agregado",
                  source: role,
                  note: newComment.trim(),
                },
              ],
            }
          : order,
      ),
    );
    setNewComment("");
  }

  function simulateDhlLookup() {
    if (!userCanEditOrders) {
      setLookupMessage("Solo Administrador u Operaciones pueden consultar/actualizar tracking.");
      return;
    }
    // Integracion futura DHL API: reemplazar esta simulacion por consulta al endpoint de tracking DHL.
    const now = new Date().toISOString();
    const knownTracking = trackingDraft || selectedOrder.tracking;
    if (!knownTracking) {
      setLookupMessage("Agrega un número de guía para consultar el estado.");
      return;
    }

    setOrders((current) =>
      current.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              tracking: knownTracking,
              updatedAt: now,
              trackingInfo: {
                currentStatus:
                  order.status === "Entregado" ? "Entregado" : "Actualizado desde DHL simulado",
                lastLocation:
                  order.status === "Entregado" ? order.country : "Centro DHL regional",
                eta:
                  order.status === "Entregado"
                    ? order.trackingInfo.eta
                    : "2026-05-10",
                events: [
                  {
                    date: now,
                    location:
                      order.status === "Entregado" ? order.country : "Centro DHL regional",
                    status: "Consulta manual ejecutada desde el prototipo",
                  },
                  ...order.trackingInfo.events,
                ],
              },
            }
          : order,
      ),
    );
    setLookupMessage(`Consulta simulada completada para ${knownTracking}.`);
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = loginForm.email.trim().toLowerCase();
    const user = users.find((item) => item.email.toLowerCase() === email);

    if (!user || user.password !== loginForm.password) {
      setAuthMessage("Correo o contraseña incorrectos.");
      return;
    }

    if (user.status !== "Activo") {
      setAuthMessage(`Tu usuario está ${user.status.toLowerCase()}. Contacta al administrador.`);
      return;
    }

    setAuthUser(stripPassword(user));
    setAuthMessage("");
    setActiveView("orders");
  }

  function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = registerForm.email.trim().toLowerCase();

    if (users.some((user) => user.email.toLowerCase() === email)) {
      setAuthMessage("Ya existe un usuario registrado con ese correo.");
      return;
    }

    const now = new Date().toISOString();
    const user = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: registerForm.name.trim(),
      email,
      password: registerForm.password,
      role: "Personal MIREX",
      institution: registerForm.institution.trim() || "MIREX",
      status: "Activo",
      createdAt: now,
    };

    setUsers((current) => [...current, user]);
    setAuthUser(stripPassword(user));
    setAuthMessage("");
    setActiveView("orders");
  }

  function logout() {
    setAuthUser(null);
    setAuthMode("login");
    setAuthMessage("");
  }

  function updateUser(userId: string, key: EditableUserKey, value: string) {
    setUsers((current) =>
      current.map((user) => (user.id === userId ? { ...user, [key]: value } : user)),
    );
    if (authUser?.id === userId) {
      setAuthUser((current) => (current ? { ...current, [key]: value } : current));
    }
  }

  function removeUser(userId: string) {
    setUsers((current) => current.filter((user) => user.id !== userId));
  }

  function addCatalogItem(kind: CatalogKind) {
    const value = newCatalogItems[kind].trim();
    if (!value) return;

    setCatalogs((current) => {
      if (current[kind].some((item) => item.toLowerCase() === value.toLowerCase())) {
        return current;
      }
      return {
        ...current,
        [kind]: [...current[kind], value].sort(),
      };
    });
    setNewCatalogItems((current) => ({ ...current, [kind]: "" }));
  }

  function removeCatalogItem(kind: CatalogKind, value: string) {
    setCatalogs((current) => ({
      ...current,
      [kind]: current[kind].filter((item) => item !== value),
    }));
  }

  function updateCatalogDraft(kind: CatalogKind, value: string) {
    setNewCatalogItems((current) => ({ ...current, [kind]: value }));
  }

  function openNewOrderModal() {
    setNewOrderForm({
      ...defaultNewOrderForm,
      shipDate: getLocalDateTimeValue(),
    });
    setIsNewOrderOpen(true);
  }

  function updateNewOrderForm(key: keyof OrderForm, value: string) {
    setNewOrderForm((current) => ({ ...current, [key]: value }));
  }

  function openEditOrderModal() {
    if (!userCanEditOrders || !selectedOrder) return;
    setEditOrderForm(orderToForm(selectedOrder));
    setIsEditOrderOpen(true);
  }

  function updateEditOrderForm(key: keyof OrderForm, value: string) {
    setEditOrderForm((current) => ({ ...current, [key]: value }));
  }

  function saveOrderEdits(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userCanEditOrders) return;

    const now = new Date().toISOString();
    const shipDate = editOrderForm.shipDate
      ? new Date(editOrderForm.shipDate).toISOString()
      : selectedOrder.shipDate;
    const updatedStatus = editOrderForm.status;
    const updatedTracking = editOrderForm.tracking.trim();
    const editNote = editOrderForm.internalComment.trim();

    setOrders((current) =>
      current.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              securityCode: editOrderForm.securityCode.trim() || "Pendiente",
              type: editOrderForm.type,
              country: editOrderForm.country.trim(),
              office: editOrderForm.office.trim(),
              consignor: editOrderForm.consignor.trim(),
              recipient: editOrderForm.recipient.trim(),
              shipDate,
              priority: editOrderForm.priority,
              status: updatedStatus,
              tracking: updatedTracking,
              responsible: editOrderForm.responsible,
              updatedAt: now,
              destinationAddress: editOrderForm.destinationAddress.trim(),
              pickupAddress: editOrderForm.pickupAddress.trim(),
              packages: editOrderForm.packages.trim(),
              weight: editOrderForm.weight.trim() || "Por definir",
              content: editOrderForm.content.trim(),
              evidenceUrl: editOrderForm.evidenceUrl.trim() || "Pendiente de evidencia",
              comments: editNote
                ? [
                    ...order.comments,
                    {
                      author: role,
                      text: editNote,
                      date: now,
                    },
                  ]
                : order.comments,
              history: [
                ...order.history,
                {
                  date: now,
                  status: "Orden editada",
                  source: role,
                  note: editNote || "Datos generales actualizados desde el modal de edición.",
                },
              ],
              trackingInfo: {
                ...order.trackingInfo,
                currentStatus: updatedTracking ? updatedStatus : "Sin guía generada",
                lastLocation: editOrderForm.country.trim() || order.trackingInfo.lastLocation,
              },
            }
          : order,
      ),
    );
    setTrackingDraft(updatedTracking);
    setLookupMessage("");
    setIsEditOrderOpen(false);
  }

  function requestAnnulSelectedOrder() {
    if (!userCanAnnulOrders || !selectedOrder || selectedOrder.status === "Cancelado") return;
    setOrderPendingAnnul(selectedOrder);
  }

  function confirmAnnulOrder() {
    if (!userCanAnnulOrders || !orderPendingAnnul) return;

    const now = new Date().toISOString();
    setOrders((current) =>
      current.map((order) =>
        order.id === orderPendingAnnul.id
          ? {
              ...order,
              status: "Cancelado",
              updatedAt: now,
              comments: [
                ...order.comments,
                {
                  author: role,
                  text: "Orden anulada por el administrador. El registro se conserva para auditoría.",
                  date: now,
                },
              ],
              history: [
                ...order.history,
                {
                  date: now,
                  status: "Cancelado",
                  source: role,
                  note: "Orden anulada. No fue eliminada del sistema.",
                },
              ],
              trackingInfo: {
                ...order.trackingInfo,
                currentStatus: "Cancelado",
              },
            }
          : order,
      ),
    );
    setLookupMessage("");
    setOrderPendingAnnul(null);
  }

  function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = new Date().toISOString();
    const currentYear = new Date().getFullYear();
    const nextNumber =
      Math.max(
        0,
        ...orders.map((order) => Number(order.id.match(/(\d+)$/)?.[1] || 0)),
      ) + 1;
    const id = `MIREX-${currentYear}-${String(nextNumber).padStart(4, "0")}`;
    const status = newOrderForm.tracking && newOrderForm.status === "Nueva solicitud"
      ? "Guía DHL generada"
      : newOrderForm.status;
    const shipDate = newOrderForm.shipDate
      ? new Date(newOrderForm.shipDate).toISOString()
      : now;

    const createdOrder = {
      id,
      securityCode: newOrderForm.securityCode.trim() || "Pendiente",
      type: newOrderForm.type,
      country: newOrderForm.country.trim(),
      office: newOrderForm.office.trim(),
      consignor: newOrderForm.consignor.trim(),
      recipient: newOrderForm.recipient.trim(),
      createdAt: now,
      shipDate,
      priority: newOrderForm.priority,
      status,
      tracking: newOrderForm.tracking.trim(),
      responsible: newOrderForm.responsible,
      updatedAt: now,
      destinationAddress: newOrderForm.destinationAddress.trim(),
      pickupAddress: newOrderForm.pickupAddress.trim(),
      packages: newOrderForm.packages.trim(),
      weight: newOrderForm.weight.trim() || "Por definir",
      content: newOrderForm.content.trim(),
      evidenceUrl: newOrderForm.evidenceUrl.trim() || "Pendiente de evidencia",
      comments: newOrderForm.internalComment.trim()
        ? [
            {
              author: role,
              text: newOrderForm.internalComment.trim(),
              date: now,
            },
          ]
        : [],
      history: [
        {
          date: now,
          status: "Solicitud creada",
          source: "Captura manual",
          note: "Orden creada desde el prototipo centralizado.",
        },
        {
          date: now,
          status: "Tarea generada en Asana",
          source: "Asana API preparada",
          note: "En producción se crearía o sincronizaría la tarea operativa.",
        },
        {
          date: now,
          status,
          source: role,
          note: "Estado inicial registrado desde Nueva orden.",
        },
      ],
      trackingInfo: {
        currentStatus: newOrderForm.tracking.trim()
          ? "Guía DHL generada"
          : status === "Pendiente de guía DHL"
            ? "Sin guía generada"
            : status,
        lastLocation: newOrderForm.pickupAddress.trim() || "MIREX Santo Domingo",
        eta: "Por definir",
        events: newOrderForm.tracking.trim()
          ? [
              {
                date: now,
                location: "Santo Domingo",
                status: "Información del envío recibida",
              },
            ]
          : [],
      },
    };

    setOrders((current) => [createdOrder, ...current]);
    setSelectedOrderId(id);
    setTrackingDraft(createdOrder.tracking);
    setLookupMessage("");
    setQuery("");
    setFilters(emptyFilters);
    setActiveView("orders");
    setIsNewOrderOpen(false);
  }

  if (!authUser) {
    return (
      <AuthScreen
        authMessage={authMessage}
        loginForm={loginForm}
        mode={authMode}
        registerForm={registerForm}
        onLogin={handleLogin}
        onLoginChange={(key, value) =>
          setLoginForm((current) => ({ ...current, [key]: value }))
        }
        onModeChange={(mode) => {
          setAuthMode(mode);
          setAuthMessage("");
        }}
        onRegister={handleRegister}
        onRegisterChange={(key, value) =>
          setRegisterForm((current) => ({ ...current, [key]: value }))
        }
      />
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">MI</div>
          <div>
            <strong>MIREX Tracking</strong>
            <span>Importadex / Flypack</span>
          </div>
        </div>

        <nav className="side-nav" aria-label="Navegación principal">
          <button
            className={activeView === "orders" ? "active" : ""}
            onClick={() => setActiveView("orders")}
          >
            <LayoutDashboard size={18} />
            Órdenes
          </button>
          <button
            className={activeView === "reports" ? "active" : ""}
            onClick={() => setActiveView("reports")}
          >
            <BarChart3 size={18} />
            Reportes
          </button>
          {userCanMaintain ? (
            <button
              className={activeView === "maintenance" ? "active" : ""}
              onClick={() => setActiveView("maintenance")}
            >
              <Settings size={18} />
              Mantenimiento
            </button>
          ) : null}
        </nav>

        <div className="role-panel">
          <span>Sesión activa</span>
          <strong>{authUser.name}</strong>
          <Badge tone={role === "Administrador" ? "indigo" : role === "Operaciones Importadex / Flypack" ? "teal" : "blue"}>
            {role}
          </Badge>
          <p>
            Acceso controlado por usuario para consultar, comentar, actualizar estados y mantener catálogos.
          </p>
          <button className="ghost-button full" onClick={logout}>
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Sistema centralizado de trazabilidad</span>
            <h1>Seguimiento operativo MIREX</h1>
          </div>
          <div className="top-actions">
            <button className="icon-button" title="Subir evidencia">
              <Upload size={18} />
            </button>
            <button className="primary-action" onClick={openNewOrderModal}>
              <FileText size={18} />
              Nueva orden
            </button>
          </div>
        </header>

        {activeView === "orders" ? (
          <OrdersView
            activeKpiFilter={activeKpiFilter}
            baseOrdersCount={manuallyFilteredOrders.length}
            countries={countries}
            filters={filters}
            filteredOrders={filteredOrders}
            metrics={metrics}
            query={query}
            selectedOrder={selectedOrder}
            sortConfig={sortConfig}
            userCanAnnulOrders={userCanAnnulOrders}
            userCanEditOrders={userCanEditOrders}
            trackingDraft={trackingDraft}
            trackingSaveMessage={trackingSaveMessage}
            lookupMessage={lookupMessage}
            newComment={newComment}
            onAddComment={addComment}
            onAnnulOrder={requestAnnulSelectedOrder}
            onClearKpiFilter={() => setActiveKpiFilter(null)}
            onEditOrder={openEditOrderModal}
            onQueryChange={setQuery}
            onResetFilters={resetOrderFilters}
            onSaveTracking={saveTracking}
            onSelectOrder={selectOrder}
            onSetNewComment={setNewComment}
            onSetTrackingDraft={setTrackingDraft}
            onSimulateLookup={simulateDhlLookup}
            onSortChange={updateSort}
            onToggleKpiFilter={toggleKpiFilter}
            onUpdateFilter={updateFilter}
            onUpdateStatus={updateOrderStatus}
            statusOptions={statusOptions}
          />
        ) : activeView === "reports" ? (
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
        ) : (
          <MaintenanceView
            catalogs={catalogs}
            currentUser={authUser}
            newCatalogItems={newCatalogItems}
            users={users}
            onAddCatalogItem={addCatalogItem}
            onCatalogDraftChange={updateCatalogDraft}
            onRemoveCatalogItem={removeCatalogItem}
            onRemoveUser={removeUser}
            onUpdateUser={updateUser}
          />
        )}
      </main>

      {isNewOrderOpen ? (
        <NewOrderModal
          form={newOrderForm}
          officeOptions={officeCatalog}
          statusOptions={statusOptions}
          countryOptions={countryCatalog}
          onChange={updateNewOrderForm}
          onClose={() => setIsNewOrderOpen(false)}
          onSubmit={createOrder}
        />
      ) : null}
      {isEditOrderOpen ? (
        <NewOrderModal
          countryOptions={countryCatalog}
          description="Actualiza los datos de la orden. Los cambios quedarán registrados en el historial."
          form={editOrderForm}
          officeOptions={officeCatalog}
          statusOptions={statusOptions}
          submitLabel="Guardar cambios"
          title={`Editar orden ${selectedOrder.id}`}
          onChange={updateEditOrderForm}
          onClose={() => setIsEditOrderOpen(false)}
          onSubmit={saveOrderEdits}
        />
      ) : null}
      {orderPendingAnnul ? (
        <ConfirmAnnulModal
          order={orderPendingAnnul}
          onCancel={() => setOrderPendingAnnul(null)}
          onConfirm={confirmAnnulOrder}
        />
      ) : null}
    </div>
  );
}



export default App;

// Integraciones futuras:
// Google Forms/Gmail: ingerir nuevas solicitudes y adjuntos desde el formulario/correo.
// Asana API: leer y sincronizar tareas existentes asignadas a operacionesmirex@importadex.do.
// DHL API: consultar tracking, eventos y prueba de entrega automaticamente.
// Google Drive: guardar evidencia del paquete sellado y documentos adjuntos.
// Base de datos interna: persistir ordenes, auditoria, roles y reportes historicos.
