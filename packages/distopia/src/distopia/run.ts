import type { Service as DistopiaService, ServiceImpl } from './types/service'

/**
 * Run a function.
 */
export function run<
  G extends Generator<
    Dependencies,
    ReturnValue
  >,
  ReturnValue = G extends Generator<unknown, infer ReturnValue>
    ? ReturnValue
    : never,
  Dependencies extends DistopiaService<
    string,
    Record<string, unknown>
  > = G extends Generator<infer Dependencies, unknown>
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
): ReturnValue {
  let result
  while (true) {
    const { done, value } = generator.next()
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
