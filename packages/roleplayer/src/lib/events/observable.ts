type Func<TEvent = unknown> = (event: TEvent) => void;

export default class Observable<TEvent = unknown> {
  private observers = new Set<Func<TEvent>>();

  subscribe(func: Func<TEvent>) {
    this.observers.add(func);
    return () => this.unsubscribe(func);
  }

  unsubscribe(func: Func<TEvent>) {
    this.observers.delete(func);
  }

  notify(event: TEvent) {
    for (const observer of this.observers) {
      observer(event);
    }
  }
}
