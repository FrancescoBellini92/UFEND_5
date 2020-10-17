export default class Factory {

  providers = {};// TOKEN: FACTORY FN

  instances = {};

  constructor() {}

  addInjectable = (token, factoryFn) => this.providers[token] = factoryFn;

  make = token => {
    const factoryFn = this.providers[token];
    let instance = factoryFn();
    const previousInstance = this.instances[token];
    if (instance.isSigleton && previousInstance) {
      instance = previousInstance;
    }
    return instance;
  }

};
