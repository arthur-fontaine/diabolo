import type { Function as DistopiaFunction, FunctionDependencies, FunctionReturnValue } from './types/function'
import type { Service as DistopiaService } from './types/service'

/**
 * Run a function.
 */
export function runFunction<
  Function extends DistopiaFunction<
    ReturnValue,
    DistopiaService<string, Record<string, unknown>>
  >,
  ReturnValue = FunctionReturnValue<Function>,
>(function_: Function): () => Generator<
  FunctionDependencies<Function>,
  ReturnValue,
  unknown
> {
  return () => { }
}
