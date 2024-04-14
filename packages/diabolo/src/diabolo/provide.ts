import type { GeneratorOrAsyncGenerator } from './types/generator-or-async-generator'
import type { Service as DiaboloService, ServiceImpl } from './types/service'

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
  dependencies: {
    [ServiceName in Dependencies['name']]: () => ServiceImpl<Extract<
      Dependencies,
      { name: ServiceName }
    >>
  },
): (...args: Arguments) => GeneratorR extends GeneratorOrAsyncGenerator<
    infer _,
    infer R
  > ?
    GeneratorR extends AsyncGenerator
      ? Promise<R>
      : R
    : never {
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
    const serviceName: keyof typeof dependencies = dependencyRequested.name
    const dependency = dependencies[serviceName]()

    return dependency
  }
}

// function isAsyncGenerator(
//   generator: GeneratorOrAsyncGenerator,
// ): generator is AsyncGenerator {
//   return generator.constructor.name === 'AsyncGenerator'
// }

// eslint-disable-next-line ts/no-explicit-any
function isAsyncGenerator(value: any): value is AsyncGenerator {
  const asyncGeneratorConstructor
    = async function* () { yield undefined }.constructor

  return value.constructor.constructor === asyncGeneratorConstructor
}
