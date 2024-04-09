import type { Service as DiaboloService, ServiceImpl } from './types/service'

/**
 * Run a function.
 */
export function provide<
  // eslint-disable-next-line ts/no-explicit-any
  G extends (...args: any[]) => Generator<
    Dependencies,
    ReturnValue
  >,
  ReturnValue = G extends (
    // eslint-disable-next-line ts/no-explicit-any
    ...args: any[]
  ) => Generator<unknown, infer ReturnValue>
    ? ReturnValue
    : never,
  Dependencies extends DiaboloService<
    string,
    Record<string, unknown>
  // eslint-disable-next-line ts/no-explicit-any
  > = G extends (...args: any[]) => Generator<infer Dependencies, unknown>
    ? Dependencies
    : never,
>(
  generator: G,
  dependencies: {
    [ServiceName in Dependencies['name']]: () => ServiceImpl<Extract<
      Dependencies,
      { name: ServiceName }
    >>
  },
): (...args: Parameters<G>) => ReturnValue {
  return function runGenerator(
    ...args: Parameters<typeof generator>
  ): ReturnValue {
    const generatorInstance = generator(...args)

    let result
    while (true) {
      const { done, value } = generatorInstance.next()
      if (done) {
        result = value as ReturnValue
        break
      }

      const dependencyRequested = value
      const serviceName: keyof typeof dependencies
        = dependencyRequested.name
      const dependency = dependencies[serviceName]()

      value.value = dependency
    }

    return result
  }
}
