import type { Function as DistopiaFunction, FunctionArguments, FunctionDependencies, FunctionReturnValue } from './types/function'
import type { Service as DistopiaService } from './types/service'

/**
 * Run a function.
 */
export function runFunction<
  Function extends DistopiaFunction<
    ReturnValue,
    Arguments,
    DistopiaService<string, Record<string, unknown>>
  >,
  ReturnValue = FunctionReturnValue<Function>,
  Arguments extends unknown[] = FunctionArguments<Function>,
>(function_: Function): (
  ...args: Arguments
) => Generator<
  FunctionDependencies<Function>,
  ReturnValue,
  unknown
> {
  return () => { }
}
