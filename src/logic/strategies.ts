

import { BoundedQueue } from './Queue';
import type { LogType, Priority, QueueEvent, Strategy } from './types';

export interface StrategyResult {
  blocked: boolean;
  dropped: boolean;
}

type LogFn = (type: LogType, msg: string) => void;

export function applyStrategy(
  strategy: Strategy,
  queue: BoundedQueue<QueueEvent>,
  incoming: QueueEvent,
  log: LogFn
): StrategyResult {
  switch (strategy) {
    case 'block': {
      log('block', 'Productor bloqueado — cola llena');
      return { blocked: true, dropped: false };
    }

    case 'drop_new': {
      log('drop', 'Evento nuevo descartado (cola llena)');
      return { blocked: false, dropped: true };
    }

    case 'drop_old': {
      queue.dequeue();
      queue.enqueue(incoming);
      log('drop', 'Evento viejo descartado para dar espacio');
      return { blocked: false, dropped: true };
    }

    case 'priority': {
      const isNormal = (e: QueueEvent): boolean => e.priority === ('normal' as Priority);
      const removed = queue.replaceFirstMatching(isNormal, incoming);
      if (removed) {
        log('drop', 'Evento normal reemplazado (se preservan sospechosos)');
      } else {
        log('drop', 'Cola saturada de eventos críticos — se descarta nuevo');
      }
      return { blocked: false, dropped: true };
    }
  }
}