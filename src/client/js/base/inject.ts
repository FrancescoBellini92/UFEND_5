import factory from "./factory";

/**
 * Injects dependencies into the decorated class instance
 */
export const Inject: InjectDecorator = (...dependencies) => target => {
    dependencies.forEach(
      ({nameAsDependency, injectionToken}) =>
      Object.defineProperty(target.prototype, nameAsDependency, {value: factory.make(injectionToken), enumerable: true, configurable: false})
  );
}

export type InjectDecorator = {(...dependencies: DependencyDescriptor[]): { (target: any): void }};

interface DependencyDescriptor {
  injectionToken: string;
  nameAsDependency: string;
}
