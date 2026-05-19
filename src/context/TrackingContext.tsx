import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { CatalogDrafts, Catalogs } from "../interfaces/catalog";
import type { AppUser, AuthUser, LoginForm, RegisterForm } from "../interfaces/user";
import type { KpiFilterId, Order, OrderFilters, OrderForm, SortConfig } from "../interfaces/order";
import type { ReportFilters } from "../interfaces/report";
import {
  appInitialOrders,
  defaultCatalogs,
  defaultNewOrderForm,
  defaultUsers,
  emptyFilters,
  emptyReportFilters,
  getLocalDateTimeValue,
  mergeCatalogs,
  readStorage,
  storageKeys,
  writeStorage,
} from "../lib/appHelpers";

type AuthMode = "login" | "register";

interface TrackingContextValue {
  users: AppUser[];
  setUsers: Dispatch<SetStateAction<AppUser[]>>;
  authUser: AuthUser | null;
  setAuthUser: Dispatch<SetStateAction<AuthUser | null>>;
  catalogs: Catalogs;
  setCatalogs: Dispatch<SetStateAction<Catalogs>>;
  orders: Order[];
  setOrders: Dispatch<SetStateAction<Order[]>>;
  selectedOrderId: string;
  setSelectedOrderId: Dispatch<SetStateAction<string>>;
  selectedOrder: Order;
  filters: OrderFilters;
  setFilters: Dispatch<SetStateAction<OrderFilters>>;
  activeKpiFilter: KpiFilterId | null;
  setActiveKpiFilter: Dispatch<SetStateAction<KpiFilterId | null>>;
  sortConfig: SortConfig;
  setSortConfig: Dispatch<SetStateAction<SortConfig>>;
  reportFilters: ReportFilters;
  setReportFilters: Dispatch<SetStateAction<ReportFilters>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  newComment: string;
  setNewComment: Dispatch<SetStateAction<string>>;
  trackingDraft: string;
  setTrackingDraft: Dispatch<SetStateAction<string>>;
  trackingSaveMessage: string;
  setTrackingSaveMessage: Dispatch<SetStateAction<string>>;
  lookupMessage: string;
  setLookupMessage: Dispatch<SetStateAction<string>>;
  isNewOrderOpen: boolean;
  setIsNewOrderOpen: Dispatch<SetStateAction<boolean>>;
  newOrderForm: OrderForm;
  setNewOrderForm: Dispatch<SetStateAction<OrderForm>>;
  isEditOrderOpen: boolean;
  setIsEditOrderOpen: Dispatch<SetStateAction<boolean>>;
  editOrderForm: OrderForm;
  setEditOrderForm: Dispatch<SetStateAction<OrderForm>>;
  orderPendingAnnul: Order | null;
  setOrderPendingAnnul: Dispatch<SetStateAction<Order | null>>;
  authMode: AuthMode;
  setAuthMode: Dispatch<SetStateAction<AuthMode>>;
  authMessage: string;
  setAuthMessage: Dispatch<SetStateAction<string>>;
  loginForm: LoginForm;
  setLoginForm: Dispatch<SetStateAction<LoginForm>>;
  registerForm: RegisterForm;
  setRegisterForm: Dispatch<SetStateAction<RegisterForm>>;
  newCatalogItems: CatalogDrafts;
  setNewCatalogItems: Dispatch<SetStateAction<CatalogDrafts>>;
  role: string;
  statusOptions: string[];
  countryCatalog: string[];
  officeCatalog: string[];
  userCanMaintain: boolean;
  userCanEditOrders: boolean;
  userCanAnnulOrders: boolean;
  openNewOrderModal: () => void;
  logout: () => void;
}

const TrackingContext = createContext<TrackingContextValue | null>(null);

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(() => readStorage(storageKeys.users, defaultUsers));
  const [authUser, setAuthUser] = useState<AuthUser | null>(() =>
    readStorage<AuthUser | null>(storageKeys.session, null),
  );
  const [catalogs, setCatalogs] = useState<Catalogs>(() =>
    mergeCatalogs(readStorage<Partial<Catalogs>>(storageKeys.catalogs, defaultCatalogs)),
  );
  const [orders, setOrders] = useState<Order[]>(() => readStorage(storageKeys.orders, appInitialOrders));
  const [selectedOrderId, setSelectedOrderId] = useState(() => orders[0]?.id || appInitialOrders[0].id);
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
      return;
    }

    try {
      window.localStorage.removeItem(storageKeys.session);
    } catch {
      // Frontend prototype: localStorage may be unavailable in private contexts.
    }
  }, [authUser]);

  function openNewOrderModal() {
    setNewOrderForm({
      ...defaultNewOrderForm,
      shipDate: getLocalDateTimeValue(),
    });
    setIsNewOrderOpen(true);
  }

  function logout() {
    setAuthUser(null);
    setAuthMode("login");
    setAuthMessage("");
  }

  return (
    <TrackingContext.Provider
      value={{
        users,
        setUsers,
        authUser,
        setAuthUser,
        catalogs,
        setCatalogs,
        orders,
        setOrders,
        selectedOrderId,
        setSelectedOrderId,
        selectedOrder,
        filters,
        setFilters,
        activeKpiFilter,
        setActiveKpiFilter,
        sortConfig,
        setSortConfig,
        reportFilters,
        setReportFilters,
        query,
        setQuery,
        newComment,
        setNewComment,
        trackingDraft,
        setTrackingDraft,
        trackingSaveMessage,
        setTrackingSaveMessage,
        lookupMessage,
        setLookupMessage,
        isNewOrderOpen,
        setIsNewOrderOpen,
        newOrderForm,
        setNewOrderForm,
        isEditOrderOpen,
        setIsEditOrderOpen,
        editOrderForm,
        setEditOrderForm,
        orderPendingAnnul,
        setOrderPendingAnnul,
        authMode,
        setAuthMode,
        authMessage,
        setAuthMessage,
        loginForm,
        setLoginForm,
        registerForm,
        setRegisterForm,
        newCatalogItems,
        setNewCatalogItems,
        role,
        statusOptions,
        countryCatalog,
        officeCatalog,
        userCanMaintain,
        userCanEditOrders,
        userCanAnnulOrders,
        openNewOrderModal,
        logout,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);

  if (!context) {
    throw new Error("useTracking must be used inside TrackingProvider");
  }

  return context;
}
