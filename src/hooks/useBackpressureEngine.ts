import { useEffect, useRef, useState } from 'react';
import { BackpressureEngine } from '../logic/BackpressureEngine';
import type {
  EngineConfig,
  EngineSnapshot,
  LogType,
  MutableParam,
  Strategy,
} from '../logic/types';

export interface LogEntry {
  id: number;
  type: LogType;
  message: string;
  time: number;
}

export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  capacity: 10,
  producerRate: 3,
  consumerRate: 2,
  strategy: 'block',
};

const MAX_LOG_ENTRIES = 50;

export function useBackpressureEngine(initialConfig: EngineConfig = DEFAULT_ENGINE_CONFIG) {
  const [engine] = useState(() => new BackpressureEngine(initialConfig));
  const [snapshot, setSnapshot] = useState<EngineSnapshot>(() => engine.getSnapshot());
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);

  useEffect(() => {
    const unsubscribeTick = engine.onTick((next) => setSnapshot(next));
    const unsubscribeLog = engine.onLog((type, message, time) => {
      logIdRef.current += 1;
      const entry: LogEntry = { id: logIdRef.current, type, message, time };
      setLogs((prev) => [entry, ...prev].slice(0, MAX_LOG_ENTRIES));
    });

    return () => {
      unsubscribeTick();
      unsubscribeLog();
      engine.pause();
    };
  }, [engine]);

  const start = (): void => engine.start();

  const pause = (): void => engine.pause();

  const reset = (config: EngineConfig = initialConfig): void => {
    logIdRef.current = 0;
    setLogs([]);
    engine.reset(config);
  };

  const setParam = (key: MutableParam, value: number | Strategy): void => {
    engine.setParam(key, value);
  };

  return { snapshot, logs, start, pause, reset, setParam };
}
