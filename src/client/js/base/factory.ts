import { Ctor, ValidInjectionToken, ValidProvider } from "./injectable";

/**
 * Singleton that provides and mantains instances of required dependencies
 */
class Factory {

  static instance: Factory;

  providers = new Map<ValidInjectionToken, DependencyDescriptor>();
  singletons = new WeakMap<Ctor, any>();
  primitiveSingletons = new Map<string, any>();

  constructor() {
    if (Factory.instance) {
      throw new Error('Factory is a singleton and cannot be instantiaced twice')
    }
  }

  static instantiate(): Factory {
    if (!this.instance) {
      this.instance = new Factory();
    }
    return this.instance
  }

  addInjectable(injectionToken: ValidInjectionToken | string, provider: ValidProvider, isSingleton = false) {
    this.providers.set(injectionToken, {
      provider,
      isSingleton
    });
  }

  make<T>(injectionToken: ValidInjectionToken): T {
    const {provider, isSingleton} = this.providers.get(injectionToken);
    let instance;
    if (isSingleton) {


      const getInstance = (token) => isPrimitive(injectionToken) ? this.primitiveSingletons.get(token) : this.singletons.get(token);
      instance = getInstance(injectionToken) ?? provider();

      const saveInstance = (instance: any) => isPrimitive(injectionToken) ? this.primitiveSingletons.set(injectionToken, instance) : this.singletons.set(injectionToken, instance);
      saveInstance(instance)
    } else {
      instance = provider();
    }

    return instance;
  }
};

function isPrimitive(token: ValidInjectionToken): token is string  {
  return typeof token === 'string';
}

interface DependencyDescriptor {
  provider: ValidProvider,
  isSingleton: boolean
}

export default Factory.instantiate();