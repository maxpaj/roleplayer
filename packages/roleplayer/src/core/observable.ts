type Func<TEvent = unknown> = (event: TEvent) => void;

export default class Observable<TEvent = unknown> {
  private observers: Array<Func<TEvent>> = [];

  subscribe(func: Func<TEvent>) {
    this.observers.push(func);
  }

  unsubscribe(func: Func<TEvent>) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(event: TEvent) {
    this.observers.forEach((observer) => observer(event));
  }
}
