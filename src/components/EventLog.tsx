import type { LogEntry } from '../hooks/useBackpressureEngine';

interface EventLogProps {
  logs: LogEntry[];
}

function EventLog({ logs }: EventLogProps) {
  return (
    <div className="log-panel">
      <h2>Registro de eventos</h2>
      <ul className="log-list">
        {logs.length === 0 && <li className="log-empty">Sin eventos todavía</li>}
        {logs.map((entry) => (
          <li key={entry.id} className={`log-entry log-${entry.type}`}>
            <span className="log-time">{entry.time.toFixed(1)}s</span>
            <span className="log-message">{entry.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventLog;
