import factory from "../factory/factory";

export const Inject: {(...dependencies: DependencyDescriptor[]): { (target: any): void }} =
  (...dependencies) => target => { // target is ctor function
    dependencies.forEach(
      dependencyDescriptor => target.prototype[dependencyDescriptor.nameAsDependency] = factory.make(dependencyDescriptor.injectionToken)
  );
}

interface DependencyDescriptor {
  injectionToken: string;
  nameAsDependency: string;
}
