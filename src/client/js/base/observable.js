export default class Observable { // defines base class 

    _functions = []; // functions to be composed before subscription
    _subscribers = [];
    _children = []; // observables create a tree structure of father-children

    constructor(_dataSource) {
        this._dataSource = _dataSource;
    }

    subscribe(subscriber) {
        this._subscribers.push(subscriber);
    }

    next(...params) {
        this._update(params);
        this._children.forEach(async(child) => child._update(params));
    }

    pipe(...functions) {
        const child = this._makeChild();
        child._functions.concat(functions); // give new pipe functions to clone and return it
        return child;
    }
    
    async _update(params) {
        let result = await this._dataSource(params);
        const composedPipedOps = this._compose(...this._functions);
        result = composedPipedOps(result);
        if (result) {
            this._subscribers.forEach(subscriber => subscriber(result));
        }
    }

    _compose = (...functions) => input => functions.reduce((accumulator, f) => f(accumulator), input);

    _makeChild() {
        const child = new Observable(this._dataSource); // make a new instance
        this._children.push(child); // track it as child instance
        child._functions = this._functions; // share piped functions 
        return child
    }

}

// const source = () => new Promise(resolve => resolve([1,2,3]));

// const obs = new Observable(source).pipe(data => data.map(item => item * 2), data => data.filter(item => item % 2 === 0));

// obs.pipe(data => data.map(item => item + 1 )).subscribe(result => console.log(result, '1'));
// obs.pipe(result => result.join()).subscribe(result => console.log(result, '2'));

// obs.next();