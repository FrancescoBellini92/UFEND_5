export default class Observable<TRequest, TResponse = TRequest> {

  private _pipedFunctions: PipedFunction[] = [];
  private _subscribers: Subscriber<TResponse>[] = [];
  private _clones: Observable<TRequest, TResponse>[] = [];

  constructor(private _dataSource: { (input: TRequest): Promise<TResponse> }) {}

  subscribe(subscriber: Subscriber<TResponse>): { unsubscribe: { (): void } } {
    this._subscribers.push(subscriber);
    return { unsubscribe: () => this._unsubscribe(subscriber)()};
  }

  next(params: TRequest): void {
    this._update(params);
    this._clones.forEach(async (child) => child._update(params));
  }

  pipe(...functions:  PipedFunction[]): Observable<TRequest, TResponse> {
    const clone = this._makeClone(); // use a clone so that piped functions are not shared
    clone._pipedFunctions = clone._pipedFunctions.concat(functions);
    return clone;
  }

  private _unsubscribe(subscriber: Subscriber<TResponse>): { (): void } {
    return () => {this._subscribers = this._subscribers.filter(sub => sub !== subscriber)};
  }

  private async _update(params: TRequest) {
    const composedPipedOps = this._compose(...this._pipedFunctions);
    const result: TResponse = composedPipedOps(await this._dataSource(params));
    this._subscribers.forEach(subscriber => subscriber(result));
  }

  private _compose: ComposeFunction<TResponse> = (...functions) => input =>
    functions.reduce((accumulator, f) => f(accumulator), input);

  private _makeClone(): Observable<TRequest, TResponse> {
    const clone = new Observable<TRequest, TResponse>(this._dataSource);
    clone._pipedFunctions = this._pipedFunctions; // share piped functions
    this._clones.push(clone);
    return clone;
  }
}

export type PipedFunction = {(item: any): any};

export type Subscriber<TResponse> = {(item: TResponse): any};

export type ComposeFunction<TResponse> = {(...functions: { (item: any): any }[]): { (input: any): TResponse }};
