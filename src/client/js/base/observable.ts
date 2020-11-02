export default class Observable<TRequest, TResponse> {

  private _functions: { (item: any): any }[] = []; // functions to be composed before subscription
  private _subscribers: { (item: TResponse): any }[] = [];
  private _children: Observable<TRequest, TResponse>[] = []; // observables create a tree structure

  constructor(private _dataSource: { (input: TRequest): Promise<TResponse>}) {}

  subscribe(subscriber: { (item: TResponse): any }) {
    this._subscribers.push(subscriber);
  }

  next(params: TRequest) {
    this._update(params);
    this._children.forEach(async (child) => child._update(params));
  }

  pipe(...functions:  { (item: TResponse): TResponse }[]) {
    const child = this._makeChild();
    child._functions = child._functions.concat(functions); // give new pipe functions to clone and return it
    return child;
  }

  private async _update(params: TRequest) {
    const composedPipedOps = this._compose(...this._functions);
    const result: TResponse = composedPipedOps(await this._dataSource(params));
    if (result) {
      this._subscribers.forEach(subscriber => subscriber(result));
    }
  }

  private _compose: { (...functions: { (item: any): any }[]): { (input: any): TResponse } } = (...functions) => input =>
    functions.reduce((accumulator, f) => f(accumulator), input);

  private _makeChild() {
    const child = new Observable<TRequest, TResponse>(this._dataSource); // make a new instance
    this._children.push(child); // track it as child instance
    child._functions = this._functions; // share piped functions
    return child;
  }
}