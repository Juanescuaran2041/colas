export class TypedEmitter<Args extends unknown []> {
    private listeners: Array<(...args: Args) => void> = [];

    subscribe(listener: (...args: Args) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  emit(...args: Args): void{
    for (const listener of this.listeners){
        listener(...args)
    }
  }

  clean(): void {
    this.listeners = [];
  }

}