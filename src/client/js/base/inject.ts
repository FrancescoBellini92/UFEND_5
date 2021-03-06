import factory from "./factory";

/**
 * Injects dependencies into the decorated class instance
 */
export const Inject: InjectDecorator = (...dependencies) => target => {
    dependencies.forEach(
      ({nameAsDependency, injectionToken}) =>
      target.prototype[nameAsDependency] = factory.make(injectionToken)
  );
}

export type InjectDecorator = {(...dependencies: DependencyDescriptor[]): { (target: any): void }};

interface DependencyDescriptor {
  injectionToken: string;
  nameAsDependency: string;
}
