import factory from "./factory";
import { Service } from "./service";

export const Injectable: { (config: InjectionConfig): { <T extends typeof Service>(target: T): void }} =
  ({ injectionToken, isSingleton }) => target => {
    target.injectionToken = injectionToken;
    target.prototype.isSingleton = isSingleton;
    factory.addInjectable(injectionToken, target.factoryFn);
};

export interface InjectionConfig {
  injectionToken: string;
  isSingleton?: boolean;
}