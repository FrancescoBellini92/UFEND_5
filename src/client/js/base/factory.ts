import { Service } from "./service";

/**
 * Singleton that provides and mantains instances of required dependencies
 */
class Factory {

  static instance: Factory;

  providers: DependencyProviders = {};

  instances = {};

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

  addInjectable(injectionToken: string, factoryFn:  {<T extends Service>(): T}) {
    this.providers[injectionToken] = factoryFn;
  }

  make<T extends Service>(injectionToken: string): T {
    const factoryFn = this.providers[injectionToken];
    let instance = factoryFn<T>();
    const previousInstance = this.instances[injectionToken];
    if (!previousInstance && instance.isSingleton) {
      this.instances[injectionToken] = instance;
    }
    return instance.isSingleton && previousInstance ? previousInstance : instance;
  }
};

interface DependencyProviders {
  [injectionToken: string]: {<T extends Service>(): T}
}

export default Factory.instantiate();