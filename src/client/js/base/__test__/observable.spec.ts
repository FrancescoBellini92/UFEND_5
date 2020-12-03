import Observable from '../observable';

describe('Observable', () => {
  let valueObs$: Observable<string, number>;
  let referenceObs$: Observable<Object, Object>;
  let mockInput: string;
  let mockOutput: number;
  const mockSubFn = jest.fn(number => number);

  beforeEach(() => {
    mockInput = '1';
    mockOutput = +mockInput;

    valueObs$ = new Observable<string, number>(async(input: string) => +input);
    referenceObs$ = new Observable<Object, Object>(async(input: Object) => input);
  });

  it('emits', () => {
    valueObs$.subscribe(number => expect(number).toEqual(mockOutput));
    valueObs$.subscribe(number => expect(number).toEqual(mockOutput));
    valueObs$.next(mockInput);
  });

  it('pipes functions', () => {
    valueObs$.pipe(input => ++input).subscribe(number => expect(number).toEqual(++mockOutput));
    valueObs$.pipe(
      input => input + 4,
      input => input * 2
    ).subscribe(number => expect(number).toEqual(10));
    valueObs$.next(mockInput);
  });

  it('passes objects by reference', () => {
    const mockObject = { foo: 'bar' };
    referenceObs$.subscribe(obj => expect(obj).toBe(mockObject));
    referenceObs$.next(mockObject);
  });

  it('removes subscribers', () => {
    const promise = new Promise<void>(resolve => {
      const sub = valueObs$.subscribe(number => {
        mockSubFn(number);
        sub.unsubscribe();
        resolve();
      });
    });

    promise.then(() => {
      expect(mockSubFn).toBeCalledTimes(1);
    });

    valueObs$.next(mockInput);
    valueObs$.next(mockInput);
  });
});
