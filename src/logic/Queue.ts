export class BoundedQueue<T> {
  private items: T[] = [];
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get length(): number {
    return this.items.length;
  }

  getCapacity(): number {
    return this.capacity;
  }

  setCapacity(newCapacity: number): void {
    this.capacity = newCapacity;
  }

  isFull(): boolean {
    return this.items.length >= this.capacity;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  enqueue(item: T): boolean {
    if (this.isFull()) return false;
    this.items.push(item);
    return true;
  }

  enqueueForced(item: T): T | undefined {
    let evicted: T | undefined;
    if (this.isFull()) {
      evicted = this.items.shift();
    }
    this.items.push(item);
    return evicted;
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peekAll(): ReadonlyArray<T> {
    return this.items;
  }

  replaceFirstMatching(predicate: (item: T) => boolean, replacement: T): T | undefined {
    const idx = this.items.findIndex(predicate);
    if (idx === -1) return undefined;
    const [removed] = this.items.splice(idx, 1);
    this.items.push(replacement);
    return removed;
  }
}