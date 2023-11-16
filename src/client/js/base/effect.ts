import WebComponent from "./web.component"

export const Effect: Effect = (onChange) => (target, name) =>{
  const privateElementProperty = `_${name}`;


  Object.defineProperty(target, name, {
    get: function() {
      if (Object.getOwnPropertyNames(this).find(n => n === privateElementProperty)) {
        Object.defineProperty(this, privateElementProperty, {writable: true, enumerable: true });
      }
      return this[privateElementProperty];
    },
    set: function(val)  {
      if (val !== this[privateElementProperty]) {
        this[privateElementProperty] = val;
        onChange.call(this);
      }
    }
  })

}

export type Effect = (onChange: Function) => <T extends WebComponent>(target: T, name: string ) => void;