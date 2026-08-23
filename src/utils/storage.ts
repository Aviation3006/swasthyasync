// Universal storage helper with localStorage synchronization and subscription events

type Listener<T> = (data: T) => void;

export class StorageStore<T> {
  private key: string;
  private memoryData: T;
  private listeners: Set<Listener<T>> = new Set();

  constructor(key: string, initialData: T) {
    this.key = `swasthyasync_${key}`;
    const stored = localStorage.getItem(this.key);
    if (stored) {
      try {
        this.memoryData = JSON.parse(stored);
      } catch (e) {
        console.warn(`Error parsing localStorage for ${this.key}, using fallback`, e);
        this.memoryData = initialData;
      }
    } else {
      this.memoryData = initialData;
      this.persist();
    }
  }

  public get(): T {
    return this.memoryData;
  }

  public set(newData: T | ((prev: T) => T)): void {
    if (typeof newData === 'function') {
      this.memoryData = (newData as (prev: T) => T)(this.memoryData);
    } else {
      this.memoryData = newData;
    }
    this.persist();
    this.notify();
  }

  private persist(): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.memoryData));
    } catch (e) {
      console.warn(`Failed to persist to localStorage for ${this.key}`, e);
    }
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.memoryData);
      } catch (e) {
        console.error('Error in storage store listener', e);
      }
    });
  }

  public subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
