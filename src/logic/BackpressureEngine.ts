import { BoundedQueue } from './Queue';
import { applyStrategy } from './strategies';
import { TypedEmitter } from './EventEmitter';
import type {
  EngineConfig,
  EngineSnapshot,
  LogListener,
  MutableParam,
  Priority,
  QueueEvent,
  Strategy,
  TickListener,
} from './types';

const TICK_MS = 200; 

export class BackpressureEngine {
  private queue: BoundedQueue<QueueEvent>;
  private producerRate: number;
  private consumerRate: number;
  private strategy: Strategy;

  private time = 0;
  private processed = 0;
  private dropped = 0;
  private blockedTicks = 0;
  private peak = 0;
  private producerBlocked = false;
  private running = false;

  private prodAcc = 0;
  private consAcc = 0;

  private intervalId: ReturnType<typeof setInterval> | null = null;

  private readonly tickEmitter = new TypedEmitter<[EngineSnapshot]>();
  private readonly logEmitter = new TypedEmitter<Parameters<LogListener>>();

  constructor(config: EngineConfig) {
    this.queue = new BoundedQueue<QueueEvent>(config.capacity);
    this.producerRate = config.producerRate;
    this.consumerRate = config.consumerRate;
    this.strategy = config.strategy;
  }

  //  API pública 

  onTick(listener: TickListener): () => void {
    return this.tickEmitter.subscribe(listener);
  }

  onLog(listener: LogListener): () => void {
    return this.logEmitter.subscribe(listener);
  }

  setParam(key: MutableParam, value: number | Strategy): void {
    switch (key) {
      case 'capacity':
        this.queue.setCapacity(value as number);
        break;
      case 'producerRate':
        this.producerRate = value as number;
        break;
      case 'consumerRate':
        this.consumerRate = value as number;
        break;
      case 'strategy':
        this.strategy = value as Strategy;
        break;
    }
  }

  start(): void {
    if (this.intervalId !== null) return;
    this.running = true;
    this.intervalId = setInterval(() => this.tick(), TICK_MS);
  }

  pause(): void {
    this.running = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(config: EngineConfig): void {
    this.pause();
    this.queue = new BoundedQueue<QueueEvent>(config.capacity);
    this.producerRate = config.producerRate;
    this.consumerRate = config.consumerRate;
    this.strategy = config.strategy;
    this.time = 0;
    this.processed = 0;
    this.dropped = 0;
    this.blockedTicks = 0;
    this.peak = 0;
    this.producerBlocked = false;
    this.prodAcc = 0;
    this.consAcc = 0;
    this.tickEmitter.emit(this.getSnapshot());
  }

  getSnapshot(): EngineSnapshot {
    return {
      capacity: this.queue.getCapacity(),
      queueLength: this.queue.length,
      queue: this.queue.peekAll(),
      time: this.time,
      processed: this.processed,
      dropped: this.dropped,
      blockedTicks: this.blockedTicks,
      peak: this.peak,
      producerBlocked: this.producerBlocked,
      producerRate: this.producerRate,
      consumerRate: this.consumerRate,
      strategy: this.strategy,
      running: this.running,
    };
  }


  private randomPriority(): Priority {
    return Math.random() < 0.15 ? 'high' : 'normal';
  }

  private produce(count: number): void {
    for (let i = 0; i < count; i++) {
      const event: QueueEvent = { priority: this.randomPriority() };

      if (!this.queue.isFull()) {
        this.queue.enqueue(event);
        this.producerBlocked = false;
        continue;
      }

      this.producerBlocked = true;
      const result = applyStrategy(this.strategy, this.queue, event, (type, msg) =>
        this.logEmitter.emit(type, msg, this.time)
      );

      if (result.blocked) {
        this.blockedTicks++;
        return; 
      }
      if (result.dropped) {
        this.dropped++;
      }
    }
  }

  private consume(count: number): void {
    for (let i = 0; i < count; i++) {
      if (this.queue.isEmpty()) return;
      this.queue.dequeue();
      this.processed++;
    }
  }

  private tick(): void {
    const dt = TICK_MS / 1000;

    this.prodAcc += this.producerRate * dt;
    const prodEvents = Math.floor(this.prodAcc);
    this.prodAcc -= prodEvents;

    this.consAcc += this.consumerRate * dt;
    const consEvents = Math.floor(this.consAcc);
    this.consAcc -= consEvents;

    if (prodEvents > 0) this.produce(prodEvents);
    if (consEvents > 0) this.consume(consEvents);

    if (!this.queue.isFull()) this.producerBlocked = false;

    this.peak = Math.max(this.peak, this.queue.length);
    this.time += dt;

    this.tickEmitter.emit(this.getSnapshot());
  }
}