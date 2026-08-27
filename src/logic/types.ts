export type Priority = 'normal' | 'high';

export interface QueueEvent {
  priority: Priority;
}

export type Strategy = 'block' | 'drop_new' | 'drop_old' | 'priority';

export type LogType = 'ok' | 'block' | 'drop';

export interface EngineConfig {
  capacity: number;
  producerRate: number;  
  consumerRate: number;   
  strategy: Strategy;
}

export interface EngineSnapshot{
    capacity: number
    queueLength: number;
    queue: ReadonlyArray<QueueEvent>;
    time: number;
    processed: number;
    dropped: number;
    blockedTicks: number;
    peak: number;
    producerBlocked: boolean;
    producerRate: number;
    consumerRate: number;
    strategy: Strategy;
    running: boolean;
}

export type TickListener = (snapshot: EngineSnapshot) => void
export type LogListener = (type: LogType, message: string, time: number) => void

export type MutableParam = keyof EngineConfig;
