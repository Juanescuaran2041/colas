import type { QueueEvent } from '../logic/types';

interface QueueSlotsProps {
  queue: ReadonlyArray<QueueEvent>;
  capacity: number;
  producerBlocked: boolean;
}

function QueueSlots({ queue, capacity, producerBlocked }: QueueSlotsProps) {
  const emptySlots = Math.max(capacity - queue.length, 0);

  return (
    <div className="queue-panel">
      <div className="queue-panel-header">
        <h2>Cola</h2>
        <span className="queue-count">
          {queue.length}/{capacity}
        </span>
      </div>

      <div className={`queue-slots${producerBlocked ? ' is-blocked' : ''}`}>
        {queue.map((event, index) => (
          <div
            key={index}
            className={`queue-slot is-filled priority-${event.priority}`}
            title={event.priority === 'high' ? 'Evento crítico' : 'Evento normal'}
          />
        ))}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <div key={`empty-${index}`} className="queue-slot" />
        ))}
      </div>

      {producerBlocked && <p className="queue-blocked-hint">Productor bloqueado — cola llena</p>}
    </div>
  );
}

export default QueueSlots;
