import { Service } from "./service";

class Factory {

  providers: DependencyProviders = {};

  instances = {};

  constructor() {}

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

export default new Factory();