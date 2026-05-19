import { useEffect, useMemo, type FormEvent } from "react";
import ConfirmAnnulModal from "../components/orders/ConfirmAnnulModal";
import NewOrderModal from "../components/orders/NewOrderModal";
import OrdersView from "../components/orders/OrdersView";
import { useTracking } from "../context/TrackingContext";
import type { KpiFilterId, Order, OrderFilters, OrderForm, OrderSortKey } from "../interfaces/order";
import {
  applyKpiFilter,
  applyManualFilters,
  applySearchFilter,
  emptyFilters,
  getKpiCounts,
  orderToForm,
  sortOrders,
} from "../lib/appHelpers";

export default function OrdersPage() {
  const {
    activeKpiFilter,
    countryCatalog,
    editOrderForm,
    filters,
    isEditOrderOpen,
    isNewOrderOpen,
    lookupMessage,
    newComment,
    newOrderForm,
    officeCatalog,
    orderPendingAnnul,
    orders,
    query,
    role,
    selectedOrder,
    selectedOrderId,
    setActiveKpiFilter,
    setEditOrderForm,
    setFilters,
    setIsEditOrderOpen,
    setIsNewOrderOpen,
    setLookupMessage,
    setNewComment,
    setNewOrderForm,
    setOrderPendingAnnul,
    setOrders,
    setQuery,
    setSelectedOrderId,
    setSortConfig,
    setTrackingDraft,
    setTrackingSaveMessage,
    sortConfig,
    statusOptions,
    trackingDraft,
    trackingSaveMessage,
    userCanAnnulOrders,
    userCanEditOrders,
  } = useTracking();

  const countries = useMemo(
    () => [
      "Todos",
      ...Array.from(new Set([...countryCatalog, ...orders.map((order) => order.country)])).filter(Boolean).sort(),
    ],
    [countryCatalog, orders],
  );

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
    if (!filteredOrders.length) return;
    if (filteredOrders.some((order) => order.id === selectedOrderId)) return;

    setSelectedOrderId(filteredOrders[0].id);
    setTrackingDraft(filteredOrders[0].tracking || "");
    setTrackingSaveMessage("");
    setLookupMessage("");
  }, [filteredOrders, selectedOrderId, setLookupMessage, setSelectedOrderId, setTrackingDraft, setTrackingSaveMessage]);

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
      setTrackingSaveMessage("Ingresa un nÃºmero de tracking antes de guardarlo.");
      return;
    }

    if ((selectedOrder.tracking || "").trim() === normalizedTracking) {
      setTrackingSaveMessage(`El tracking ${normalizedTracking} ya estÃ¡ guardado en esta orden.`);
      return;
    }

    const now = new Date().toISOString();
    const selectedOrderForTracking = selectedOrder.id;
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== selectedOrderForTracking) return order;

        const previousTracking = order.tracking?.trim();
        const shouldPromoteStatus =
          !previousTracking &&
          ["Nueva solicitud", "En revisiÃ³n", "Pendiente de guÃ­a DHL"].includes(order.status);
        const nextStatus = shouldPromoteStatus ? "GuÃ­a DHL generada" : order.status;

        return {
          ...order,
          tracking: normalizedTracking,
          updatedAt: now,
          status: nextStatus,
          trackingInfo: {
            ...order.trackingInfo,
            currentStatus:
              order.trackingInfo.currentStatus === "Sin guÃ­a generada" || shouldPromoteStatus
                ? "GuÃ­a DHL generada"
                : order.trackingInfo.currentStatus,
            lastLocation:
              order.trackingInfo.currentStatus === "Sin guÃ­a generada"
                ? "Operaciones Importadex / Flypack"
                : order.trackingInfo.lastLocation,
            events: [
              {
                date: now,
                location: "Operaciones Importadex / Flypack",
                status: previousTracking ? "Tracking DHL actualizado" : "GuÃ­a DHL registrada",
              },
              ...order.trackingInfo.events,
            ],
          },
          history: [
            ...order.history,
            {
              date: now,
              status: previousTracking ? "Tracking DHL actualizado" : "GuÃ­a DHL agregada",
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

    const now = new Date().toISOString();
    const knownTracking = trackingDraft || selectedOrder.tracking;
    if (!knownTracking) {
      setLookupMessage("Agrega un nÃºmero de guÃ­a para consultar el estado.");
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

  function updateNewOrderForm(key: keyof OrderForm, value: string) {
    setNewOrderForm((current) => ({ ...current, [key]: value }));
  }

  function openEditOrderModal() {
    if (!userCanEditOrders) return;
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
                  note: editNote || "Datos generales actualizados desde el modal de ediciÃ³n.",
                },
              ],
              trackingInfo: {
                ...order.trackingInfo,
                currentStatus: updatedTracking ? updatedStatus : "Sin guÃ­a generada",
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
    if (!userCanAnnulOrders || selectedOrder.status === "Cancelado") return;
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
                  text: "Orden anulada por el administrador. El registro se conserva para auditorÃ­a.",
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
      ? "GuÃ­a DHL generada"
      : newOrderForm.status;
    const shipDate = newOrderForm.shipDate
      ? new Date(newOrderForm.shipDate).toISOString()
      : now;

    const createdOrder: Order = {
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
          note: "En producciÃ³n se crearÃ­a o sincronizarÃ­a la tarea operativa.",
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
          ? "GuÃ­a DHL generada"
          : status === "Pendiente de guÃ­a DHL"
            ? "Sin guÃ­a generada"
            : status,
        lastLocation: newOrderForm.pickupAddress.trim() || "MIREX Santo Domingo",
        eta: "Por definir",
        events: newOrderForm.tracking.trim()
          ? [
              {
                date: now,
                location: "Santo Domingo",
                status: "InformaciÃ³n del envÃ­o recibida",
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
    setIsNewOrderOpen(false);
  }

  return (
    <>
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
          description="Actualiza los datos de la orden. Los cambios quedarÃ¡n registrados en el historial."
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
    </>
  );
}
