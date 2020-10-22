import { Service } from "../base/service";

class Factory {

  providers: DependencyProviders = {};

  instances = {};

  constructor() {}

  addInjectable(injectionToken: string, factoryFn:  {(): Service}) {
    this.providers[injectionToken] = factoryFn;
  }

  make(injectionToken: string): Service {
    const factoryFn = this.providers[injectionToken];
    let instance = factoryFn();
    const previousInstance = this.instances[injectionToken];
    if (instance.isSingleton && previousInstance) {
      instance = previousInstance;
    }
    return instance;
  }
};

interface DependencyProviders {
  [injectionToken: string]: {(): Service}
}

export default new Factory();