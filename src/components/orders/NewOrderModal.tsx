import { FileText, X } from "lucide-react";
import type { FormEvent } from "react";
import { priorityOptions, responsibleOptions, typeOptions } from "../../data/mockData";
import type { OrderForm } from "../../interfaces/order";
import SelectField from "../ui/SelectField";
import TextField from "../ui/TextField";

interface NewOrderModalProps {
  countryOptions: string[];
  description?: string;
  form: OrderForm;
  officeOptions: string[];
  statusOptions: string[];
  submitLabel?: string;
  title?: string;
  onChange: (key: keyof OrderForm, value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function NewOrderModal({
  countryOptions,
  description = "Registra la solicitud y deja lista la trazabilidad inicial para operaciones.",
  form,
  officeOptions,
  statusOptions,
  submitLabel = "Crear orden",
  title = "Nueva orden MIREX",
  onChange,
  onClose,
  onSubmit,
}: NewOrderModalProps) {
  return (
    <div className="modal-backdrop">
      <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="new-order-title">
        <header className="modal-header">
          <div>
            <span className="eyebrow">Captura operativa</span>
            <h2 id="new-order-title">{title}</h2>
            <p>{description}</p>
          </div>
          <button className="icon-button" type="button" title="Cerrar" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <form className="modal-form" onSubmit={onSubmit}>
          <div className="modal-body">
            <datalist id="destination-suggestions">
              {countryOptions.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
            <datalist id="office-suggestions">
              {officeOptions.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>

            <div className="form-section">
              <h3>Solicitud</h3>
              <div className="form-grid">
                <SelectField
                  label="Tipo de solicitud"
                  value={form.type}
                  options={typeOptions}
                  onChange={(value) => onChange("type", value)}
                />
                <TextField
                  label="Fecha de envío"
                  type="datetime-local"
                  value={form.shipDate}
                  required
                  onChange={(value) => onChange("shipDate", value)}
                />
                <SelectField
                  label="Prioridad"
                  value={form.priority}
                  options={priorityOptions}
                  onChange={(value) => onChange("priority", value)}
                />
                <SelectField
                  label="Estado inicial"
                  value={form.status}
                  options={statusOptions}
                  onChange={(value) => onChange("status", value)}
                />
                <SelectField
                  label="Responsable"
                  value={form.responsible}
                  options={responsibleOptions}
                  onChange={(value) => onChange("responsible", value)}
                />
                <TextField
                  label="Código de seguridad"
                  value={form.securityCode}
                  placeholder="240794"
                  onChange={(value) => onChange("securityCode", value)}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Partes y destino</h3>
              <div className="form-grid two-columns">
                <TextField
                  label="Consignatario"
                  value={form.consignor}
                  required
                  placeholder="Nombre, cargo y dependencia"
                  onChange={(value) => onChange("consignor", value)}
                />
                <TextField
                  label="Destinatario"
                  value={form.recipient}
                  required
                  placeholder="Nombre, cargo y oficina"
                  onChange={(value) => onChange("recipient", value)}
                />
                <label className="field">
                  <span>País / destino</span>
                  <input
                    required
                    list="destination-suggestions"
                    value={form.country}
                    placeholder="Guadalupe"
                    onChange={(event) => onChange("country", event.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Embajada / consulado / oficina</span>
                  <input
                    required
                    list="office-suggestions"
                    value={form.office}
                    placeholder="Consulado General en Guadalupe"
                    onChange={(event) => onChange("office", event.target.value)}
                  />
                </label>
                <label className="field span-2">
                  <span>Dirección completa de destino</span>
                  <textarea
                    required
                    value={form.destinationAddress}
                    placeholder="Dirección física, ciudad, código postal y país"
                    onChange={(event) => onChange("destinationAddress", event.target.value)}
                  />
                </label>
                <label className="field span-2">
                  <span>Dirección de recogida</span>
                  <textarea
                    required
                    value={form.pickupAddress}
                    onChange={(event) => onChange("pickupAddress", event.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Paquete y evidencia</h3>
              <div className="form-grid">
                <TextField
                  label="Cantidad de paquetes"
                  value={form.packages}
                  required
                  placeholder="1 paquete"
                  onChange={(value) => onChange("packages", value)}
                />
                <TextField
                  label="Peso aproximado"
                  value={form.weight}
                  placeholder="0.60 libras"
                  onChange={(value) => onChange("weight", value)}
                />
                <TextField
                  label="Tracking DHL"
                  value={form.tracking}
                  placeholder="JD014600..."
                  onChange={(value) => onChange("tracking", value)}
                />
                <TextField
                  label="Evidencia / Google Drive"
                  value={form.evidenceUrl}
                  placeholder="https://drive.google.com/..."
                  onChange={(value) => onChange("evidenceUrl", value)}
                />
                <label className="field span-2">
                  <span>Contenido declarado</span>
                  <textarea
                    required
                    value={form.content}
                    placeholder="Documentos oficiales, libretas de pasaporte, expedientes..."
                    onChange={(event) => onChange("content", event.target.value)}
                  />
                </label>
                <label className="field span-2">
                  <span>Comentario interno inicial</span>
                  <textarea
                    value={form.internalComment}
                    placeholder="Validaciones, observaciones de recogida o instrucciones especiales"
                    onChange={(event) => onChange("internalComment", event.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>

          <footer className="modal-footer">
            <button className="ghost-button" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="primary-action" type="submit">
              <FileText size={18} />
              {submitLabel}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
