/**
 * Base class for all injectables
 */
export class Service {
  static injectionToken: string;
  static factoryFn: { (): any; };
  isSingleton: boolean;
}
