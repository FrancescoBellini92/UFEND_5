export default class Observable<TRequest, TResponse> {
  // defines base class

  private _functions: { (item: TResponse): TResponse }[] = []; // functions to be composed before subscription
  private _subscribers: { (item: TResponse): any }[] = [];
  private _children: Observable<TRequest, TResponse>[] = []; // observables create a tree structure of father-children

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
    child._functions.concat(functions); // give new pipe functions to clone and return it
    return child;
  }

  async _update(params: TRequest) {
    let result = await this._dataSource(params);
    const composedPipedOps = this._compose(...this._functions);
    result = composedPipedOps(result);
    if (result) {
      this._subscribers.forEach((subscriber) => subscriber(result));
    }
  }

  private _compose = (...functions) => (input) =>
    functions.reduce((accumulator, f) => f(accumulator), input);

  private _makeChild() {
    const child = new Observable<TRequest, TResponse>(this._dataSource); // make a new instance
    this._children.push(child); // track it as child instance
    child._functions = this._functions; // share piped functions
    return child;
  }
}

// const source = () => new Promise(resolve => resolve([1,2,3]));

// const obs = new Observable(source).pipe(data => data.map(item => item * 2), data => data.filter(item => item % 2 === 0));

// obs.pipe(data => data.map(item => item + 1 )).subscribe(result => console.log(result, '1'));
// obs.pipe(result => result.join()).subscribe(result => console.log(result, '2'));

// obs.next();
