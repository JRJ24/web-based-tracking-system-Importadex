import { Ban, FileText, History, Link as LinkIcon, MapPin, PackageSearch, Pencil, ShieldCheck, UserRound } from "lucide-react";
import { priorityMeta, statusMeta } from "../../data/mockData";
import type { Order } from "../../interfaces/order";
import { formatDate } from "../../lib/appHelpers";
import Badge from "../ui/Badge";
import SelectField from "../ui/SelectField";
import TextField from "../ui/TextField";
import DhlTracking from "./DhlTracking";
import InfoLine from "./InfoLine";
import Timeline from "./Timeline";

interface OrderDetailProps {
  lookupMessage: string;
  newComment: string;
  order: Order;
  statusOptions: string[];
  userCanAnnulOrders: boolean;
  userCanEditOrders: boolean;
  trackingDraft: string;
  trackingSaveMessage: string;
  onAddComment: () => void;
  onAnnulOrder: () => void;
  onEditOrder: () => void;
  onSaveTracking: () => void;
  onSetNewComment: (value: string) => void;
  onSetTrackingDraft: (value: string) => void;
  onSimulateLookup: () => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}

export default function OrderDetail({
  lookupMessage,
  newComment,
  order,
  statusOptions,
  userCanAnnulOrders,
  userCanEditOrders,
  trackingDraft,
  trackingSaveMessage,
  onAddComment,
  onAnnulOrder,
  onEditOrder,
  onSaveTracking,
  onSetNewComment,
  onSetTrackingDraft,
  onSimulateLookup,
  onUpdateStatus,
}: OrderDetailProps) {
  const progress = statusMeta[order.status]?.progress || 0;
  const dhlUrl = order.tracking
    ? `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${order.tracking}`
    : "https://www.dhl.com/global-en/home/tracking.html";

  return (
    <aside className="detail-panel" aria-label="Detalle de orden">
      <div className="detail-header">
        <div>
          <span className="eyebrow">Vista detalle</span>
          <h2>{order.id}</h2>
        </div>
        <Badge tone={statusMeta[order.status]?.tone || "muted"}>{order.status}</Badge>
      </div>

      <div className="progress-block">
        <div className="progress-label">
          <span>Progreso operativo</span>
          <strong>{progress}%</strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="detail-actions">
        <div className="order-admin-actions">
          {userCanEditOrders ? (
            <button className="secondary-action" onClick={onEditOrder}>
              <Pencil size={16} />
              Editar orden
            </button>
          ) : null}
          {userCanAnnulOrders ? (
            <button
              className="danger-action"
              disabled={order.status === "Cancelado"}
              onClick={onAnnulOrder}
            >
              <Ban size={16} />
              Anular orden
            </button>
          ) : null}
        </div>
        <SelectField
          label="Estado actual"
          value={order.status}
          options={statusOptions}
          onChange={(value) => onUpdateStatus(order.id, value)}
          disabled={!userCanEditOrders}
        />
        <TextField
          label="Guía DHL / tracking"
          value={trackingDraft}
          placeholder="JD014600..."
          onChange={onSetTrackingDraft}
          disabled={!userCanEditOrders}
        />
        <button className="primary-action full" disabled={!userCanEditOrders} onClick={onSaveTracking}>
          <ShieldCheck size={18} />
          Guardar tracking
        </button>
        {trackingSaveMessage ? <p className="save-message">{trackingSaveMessage}</p> : null}
        {!userCanEditOrders ? (
          <p className="permission-note">Solo Administrador u Operaciones pueden editar esta orden.</p>
        ) : null}
      </div>

      <div className="detail-section">
        <h3>
          <FileText size={18} />
          Información general
        </h3>
        <dl className="detail-list">
          <div>
            <dt>Tipo</dt>
            <dd>{order.type}</dd>
          </div>
          <div>
            <dt>Fecha de creación</dt>
            <dd>{formatDate(order.createdAt)}</dd>
          </div>
          <div>
            <dt>Fecha de envío</dt>
            <dd>{formatDate(order.shipDate)}</dd>
          </div>
          <div>
            <dt>Prioridad</dt>
            <dd>
              <Badge tone={priorityMeta[order.priority].tone}>{order.priority}</Badge>
            </dd>
          </div>
          <div>
            <dt>Cantidad de paquetes</dt>
            <dd>{order.packages}</dd>
          </div>
          <div>
            <dt>Peso</dt>
            <dd>{order.weight}</dd>
          </div>
          <div>
            <dt>Contenido declarado</dt>
            <dd>{order.content}</dd>
          </div>
          <div>
            <dt>Código de seguridad</dt>
            <dd>{order.securityCode}</dd>
          </div>
        </dl>
      </div>

      <div className="detail-section">
        <h3>
          <UserRound size={18} />
          Partes y direcciones
        </h3>
        <div className="info-stack">
          <InfoLine icon={UserRound} label="Consignatario" value={order.consignor} />
          <InfoLine icon={UserRound} label="Destinatario" value={order.recipient} />
          <InfoLine icon={MapPin} label="Destino" value={`${order.country} · ${order.office}`} />
          <InfoLine icon={MapPin} label="Dirección destino" value={order.destinationAddress} />
          <InfoLine icon={PackageSearch} label="Dirección recogida" value={order.pickupAddress} />
          <InfoLine icon={LinkIcon} label="Evidencia paquete sellado" value={order.evidenceUrl} />
          <InfoLine icon={UserRound} label="Responsable asignado" value={order.responsible} />
        </div>
      </div>

      <DhlTracking
        dhlUrl={dhlUrl}
        lookupMessage={lookupMessage}
        order={order}
        userCanEditOrders={userCanEditOrders}
        onSimulateLookup={onSimulateLookup}
      />

      <Timeline history={order.history} />

      <div className="detail-section">
        <h3>
          <History size={18} />
          Comentarios internos
        </h3>
        <div className="comments-list">
          {order.comments.length ? (
            order.comments.map((comment, index) => (
              <article key={`${comment.date}-${index}`} className="comment-item">
                <strong>{comment.author}</strong>
                <span>{formatDate(comment.date)}</span>
                <p>{comment.text}</p>
              </article>
            ))
          ) : (
            <p className="empty-note">No hay comentarios todavía.</p>
          )}
        </div>
        <div className="comment-box">
          <textarea
            value={newComment}
            placeholder="Agregar comentario o aclaración..."
            onChange={(event) => onSetNewComment(event.target.value)}
          />
          <button className="primary-action" onClick={onAddComment}>
            <FileText size={18} />
            Agregar
          </button>
        </div>
      </div>
    </aside>
  );
}
