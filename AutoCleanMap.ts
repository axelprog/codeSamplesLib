interface AutoCleanItem<T> {
  data: T;
  ttl: number;
}

export class AutoCleanMap<K, V> {
  private storage: Map<K, AutoCleanItem<V>>;
  private ttl: number;
  private clearInterval: NodeJS.Timeout;

  constructor(ttl = 60) {
    this.ttl = ttl;
    this.storage = new Map<K, AutoCleanItem<V>>();
    this.clearInterval = setInterval(() => {
      this.autoCleanStep();
    }, 1000);
  }

  readonly [Symbol.toStringTag] = 'AutoCleanMap';

  set(key: K, value: V, expirationTime?: number): this {
    const entry: AutoCleanItem<V> = { data: value, ttl: expirationTime ?? this.ttl };
    this.storage.set(key, entry);
    return this;
  }

  get(key: K): V | undefined {
    const entry = this.storage.get(key);
    if (entry) {
      entry.ttl = this.ttl;
      return entry.data;
    } else {
      return undefined;
    }
  }

  has(key: K): boolean {
    const entry = this.storage.get(key);
    if (entry) {
      entry.ttl = this.ttl;
      return true;
    } else {
      return false;
    }
  }

  delete(key: K): boolean {
    return this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  private autoCleanStep(): void {
    for (const [key, value] of this.storage) {
      value.ttl--;

      if (value.ttl <= 0) {
        delete (value as Partial<AutoCleanItem<V>>)?.data; // Hack over typescript error ts2790
        this.storage.delete(key);
      }
    }
  }
}
