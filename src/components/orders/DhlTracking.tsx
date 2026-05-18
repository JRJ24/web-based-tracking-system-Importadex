import { Calendar, Link as LinkIcon, MapPin, RefreshCw, Truck } from "lucide-react";
import type { Order } from "../../interfaces/order";
import { formatDate } from "../../lib/appHelpers";
import InfoLine from "./InfoLine";

interface DhlTrackingProps {
  dhlUrl: string;
  lookupMessage: string;
  order: Order;
  userCanEditOrders: boolean;
  onSimulateLookup: () => void;
}

export default function DhlTracking({
  dhlUrl,
  lookupMessage,
  order,
  userCanEditOrders,
  onSimulateLookup,
}: DhlTrackingProps) {
  return (
    <div className="detail-section dhl-section">
      <h3>
        <Truck size={18} />
        Seguimiento DHL
      </h3>
      <div className="dhl-banner">
        <div>
          <span>Tracking actual</span>
          <strong>{order.tracking || "Pendiente de guía"}</strong>
        </div>
        <a href={dhlUrl} target="_blank" rel="noreferrer" className="ghost-button">
          <LinkIcon size={16} />
          Abrir DHL
        </a>
      </div>
      <button className="secondary-action full" disabled={!userCanEditOrders} onClick={onSimulateLookup}>
        <RefreshCw size={16} />
        Consultar estatus
      </button>
      {lookupMessage ? <p className="lookup-message">{lookupMessage}</p> : null}
      <div className="tracking-grid">
        <InfoLine icon={Truck} label="Estado actual" value={order.trackingInfo.currentStatus} />
        <InfoLine icon={MapPin} label="Última ubicación" value={order.trackingInfo.lastLocation} />
        <InfoLine icon={Calendar} label="Entrega estimada" value={formatDate(order.trackingInfo.eta, { dateOnly: true })} />
      </div>
      <div className="mini-events">
        <span>Eventos del tracking</span>
        {order.trackingInfo.events.length ? (
          order.trackingInfo.events.map((event, index) => (
            <div key={`${event.date}-${index}`} className="mini-event">
              <strong>{event.status}</strong>
              <p>{event.location} · {formatDate(event.date)}</p>
            </div>
          ))
        ) : (
          <p className="empty-note">Sin eventos DHL registrados todavía.</p>
        )}
      </div>
      <p className="integration-note">
        Preparado para consultar automáticamente DHL API y sincronizar eventos de tracking.
      </p>
    </div>
  );
}
