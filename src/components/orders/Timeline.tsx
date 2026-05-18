import { History } from "lucide-react";
import type { OrderHistoryItem } from "../../interfaces/order";
import { formatDate } from "../../lib/appHelpers";

interface TimelineProps {
  history: OrderHistoryItem[];
}

export default function Timeline({ history }: TimelineProps) {
  return (
    <div className="detail-section">
      <h3>
        <History size={18} />
        Línea de tiempo del envío
      </h3>
      <ol className="timeline">
        {history.map((event, index) => (
          <li key={`${event.date}-${index}`}>
            <span className="timeline-dot" />
            <div>
              <strong>{event.status}</strong>
              <p>{formatDate(event.date)} · {event.source}</p>
              {event.note ? <em>{event.note}</em> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
