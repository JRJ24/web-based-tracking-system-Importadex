import { Ban } from "lucide-react";
import type { Order } from "../../interfaces/order";

interface ConfirmAnnulModalProps {
  order: Order;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmAnnulModal({ order, onCancel, onConfirm }: ConfirmAnnulModalProps) {
  return (
    <div className="modal-backdrop">
      <section className="confirm-panel" role="dialog" aria-modal="true" aria-labelledby="annul-title">
        <div className="confirm-icon">
          <Ban size={22} />
        </div>
        <div>
          <span className="eyebrow">Anulación administrativa</span>
          <h2 id="annul-title">Anular orden {order.id}</h2>
          <p>
            La orden cambiará a estado <strong>Cancelado</strong>, se conservará en el sistema y quedará
            registrada en el historial para auditoría.
          </p>
        </div>
        <footer className="confirm-actions">
          <button className="ghost-button" onClick={onCancel}>
            Cancelar
          </button>
          <button className="danger-action" onClick={onConfirm}>
            <Ban size={16} />
            Confirmar anulación
          </button>
        </footer>
      </section>
    </div>
  );
}
