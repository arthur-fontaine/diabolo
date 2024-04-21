import type { GeneratorOrAsyncGenerator } from './types/generator-or-async-generator'
import type { Service as DiaboloService, ServiceImpl } from './types/service'
import type { UnionToIntersection } from './types/union-to-intersection'

type DependenciesObject<
  GeneratorR extends GeneratorOrAsyncGenerator,
> = UnionToIntersection<
  GeneratorR extends GeneratorOrAsyncGenerator<
    infer Dependencies,
    // eslint-disable-next-line ts/no-explicit-any
    any
  > ? Dependencies extends DiaboloService<string, Record<string, unknown>> ? {
    [ServiceName in Dependencies['name']]: () => ServiceImpl<Extract<
      Dependencies,
      { name: ServiceName }
    >>
  } : never : never
>

/**
 * Run a function.
 * @param {Generator} generator The function to run.
 * @param {object} dependencies The dependencies to provide.
 * @returns {Function} A function resulting from running the generator, with the dependencies provided.
 */
export function provide<
  ReturnValue,
  Arguments extends unknown[],
  Dependencies extends DiaboloService<string, Record<string, unknown>>,
  GeneratorR extends GeneratorOrAsyncGenerator<
    Dependencies,
    ReturnValue
  > = GeneratorOrAsyncGenerator<
    Dependencies,
    ReturnValue
  >,
>(
  generator: (...args: Arguments) => GeneratorR,
  dependencies:
    | DependenciesObject<GeneratorR>
    | Promise<DependenciesObject<GeneratorR>>,
): (...args: Arguments) => (
  GeneratorR extends GeneratorOrAsyncGenerator<
    infer _,
    infer R
  > ?
    GeneratorR extends AsyncGenerator
      ? Promise<R>
      : Dependencies extends Promise<unknown>
        ? Promise<R>
        : R
    : never
  ) {
  return (...args: Arguments) => {
    const generatorInstance = generator(...args)

    if (isAsyncGenerator(generatorInstance)) {
      return runForAsyncGenerator(generatorInstance as never) as never
    }

    return runForSyncGenerator(generatorInstance as never) as never
  }

  async function runForAsyncGenerator(
    generatorInstance: Extract<GeneratorR, AsyncGenerator>,
  ): Promise<ReturnValue> {
    while (true) {
      const { done, value } = await generatorInstance.next()
      if (done) {
        return value as ReturnValue
      }
      value.value = feedDependency(value)
    }
  }

  function runForSyncGenerator(
    generatorInstance: Extract<GeneratorR, Generator>,
  ): ReturnValue {
    while (true) {
      const { done, value } = generatorInstance.next()
      if (done) {
        return value as ReturnValue
      }
      value.value = feedDependency(value)
    }
  }

  function feedDependency(
    dependencyRequested: Dependencies,
  ) {
    if (dependencies instanceof Promise) {
      return feedDependencyAsync(dependencyRequested)
    }

    return feedDependencySync(dependencyRequested, dependencies)
  }

  function feedDependencySync(
    dependencyRequested: Dependencies,
    dependencies: DependenciesObject<GeneratorR>,
  ) {
    const serviceName = dependencyRequested.name as keyof typeof dependencies

    if (
      typeof dependencies !== 'object'
      || dependencies === null
      || !(serviceName in dependencies)
    ) {
      // Service not provided
      return
    }

    const lazyDependency = dependencies[serviceName]

    if (typeof lazyDependency !== 'function') {
      // Service provided is not a function
      return
    }

    const dependency = lazyDependency()

    return dependency
  }

  async function feedDependencyAsync(
    dependencyRequested: Dependencies,
  ) {
    return feedDependencySync(dependencyRequested, await dependencies)
  }
}

// eslint-disable-next-line ts/no-explicit-any
function isAsyncGenerator(value: any): value is AsyncGenerator {
  const asyncGeneratorConstructor
    = async function* () { yield undefined }.constructor

  return value.constructor.constructor === asyncGeneratorConstructor
}
