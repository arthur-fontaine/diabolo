import type { Function as DistopiaFunction, FunctionArguments, FunctionDependencies, FunctionReturnValue } from './types/function'
import type { Service as DistopiaService } from './types/service'

export type RunFunctionReturn<
  Function extends DistopiaFunction<
    ReturnValue,
    Arguments,
    DistopiaService<string, Record<string, unknown>>
  >,
  ReturnValue = FunctionReturnValue<Function>,
  Arguments extends unknown[] = FunctionArguments<Function>,
> = Generator<
  FunctionDependencies<Function>,
  ReturnValue,
  unknown
>

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
) => RunFunctionReturn<Function, ReturnValue, Arguments> {
  return () => { }
}
