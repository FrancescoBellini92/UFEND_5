import factory from "./factory";

export const Inject: {(...dependencies: DependencyDescriptor[]): { (target: any): void }} =
  (...dependencies) => target => {
    dependencies.forEach(
      ({nameAsDependency, injectionToken}) =>
      target.prototype[nameAsDependency] = factory.make(injectionToken)
  );
}

interface DependencyDescriptor {
  injectionToken: string;
  nameAsDependency: string;
}
