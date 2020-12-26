import factory from "./factory";
import { Service } from "./service";

/**
 * Makes the decorated class injectable via @Inject
 */
export const Injectable: InjectableDecorator = ({ injectionToken, isSingleton }) => target => {
    target.injectionToken = injectionToken;
    target.prototype.isSingleton = isSingleton;
    factory.addInjectable(injectionToken, target.factoryFn);
};

export type InjectableDecorator = {(config: InjectionConfig): { <T extends typeof Service>(target: T): void }};

export interface InjectionConfig {
  injectionToken: string;
  isSingleton?: boolean;
}