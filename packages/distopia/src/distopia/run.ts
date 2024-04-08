import type { RunFunctionReturn } from './run-function'
import type { Function as DistopiaFunction, FunctionArguments, FunctionDependencies, FunctionReturnValue } from './types/function'
import type { Service as DistopiaService, ServiceImpl } from './types/service'

type FunctionDependenciesAsObject<
  FunctionToInfer extends DistopiaFunction<
    unknown,
    unknown[],
    DistopiaService<string, Record<string, unknown>>
  >,
> = {
  [K in FunctionDependencies<FunctionToInfer>['name']]: () => Extract<
    FunctionDependencies<FunctionToInfer>,
    { serviceName: K }
  >
}

/**
 * Run a function.
 */
export async function run<
  Generator extends RunFunctionReturn<Function, ReturnValue, Arguments>,
  Function extends DistopiaFunction<
    ReturnValue,
    Arguments,
    DistopiaService<string, Record<string, unknown>>
  >,
  ReturnValue = FunctionReturnValue<Function>,
  Arguments extends unknown[] = FunctionArguments<Function>,
>(
  generator: Generator,
  dependencies: FunctionDependenciesAsObject<Function>,
) {
  for await (const dependencyRequested of generator) {
    const serviceName: keyof FunctionDependenciesAsObject<Function>
      = dependencyRequested.name
    const dependency = dependencies[serviceName]()

    dependencyRequested.value = dependency.value!
  }

  return generator.return()
}
