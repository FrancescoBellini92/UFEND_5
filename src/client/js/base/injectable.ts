import factory from "./factory";

/**
 * Makes the decorated class injectable via @Inject
 */
export const Injectable: InjectableDecorator = ({ injectionToken, provider, isSingleton }) => target => {
  factory.addInjectable(
    injectionToken || target,
    provider || (() => new target()),
    isSingleton
  );
};

export type InjectableDecorator = <T extends Ctor>(config?: InjectionConfig) =>{ (target: T): void };

export interface InjectionConfig {
  injectionToken?: string;
  isSingleton?: boolean;
  provider?: ValidProvider
}

export type ValidInjectionToken = Ctor | string;
export type ValidProvider = {<T extends Ctor>(): T}
export type Ctor<T extends any = any> = new(...args: any) => T;
