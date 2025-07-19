import WebComponent from "./web.component"

export const Effect: Effect = (params: { onChange(): void }) => (target, name) => {
  const privateKeyForBoundProp = `__boundProperty[[${name}]]`;
  let previousValue;

  Object.defineProperty(target, name, {
    get: function() {
      return this[privateKeyForBoundProp];
    },
    set: function(val)  {
      if (isDifferent(val, previousValue)) {
        previousValue = JSON.parse(JSON.stringify(val));
        this[privateKeyForBoundProp] = val;
        params?.onChange.call(this);

        if (this instanceof WebComponent) {
          this.notifyBoundProperties({
            [name]: this[privateKeyForBoundProp]
          })
        }
      }
    },
    enumerable: true,
    configurable: false,
  })
}

const isDifferent = (newVal, currentVal) => {
  const isNotObject =   typeof newVal !== 'object';

  if (isNotObject) {
    return  newVal !== currentVal
   }

   if (newVal === null || currentVal === null) {
      return newVal !== currentVal
   }

    const ret = JSON.stringify(newVal) !== JSON.stringify(currentVal)
    return ret;
  };
export interface EffectParams {
  onChange: Function;
}
export type Effect =    (params?: EffectParams) => <T extends WebComponent |  (new (...args: any[]) => object)>(target: T, name: string ) => void;
