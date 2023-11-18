import WebComponent from "./web.component"

export const Effect: Effect = (onChange) => (target, name) =>{
  const privateKeyForBoundProp = `__boundProperty[[${name}]]`;


  Object.defineProperty(target, name, {
    get: function() {
      return this[privateKeyForBoundProp];
    },
    set: function(val)  {
      if (val !== this[privateKeyForBoundProp]) {
        this[privateKeyForBoundProp] = val;
        onChange.call(this);
      }
    },
    enumerable: true
  })

}

export type Effect = (onChange: Function) => <T extends WebComponent>(target: T, name: string ) => void;