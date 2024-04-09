import type { Function as DiaboloFunction } from './types/function'
import type { Service as DiaboloService } from './types/service'

type CreateFunctionCallback<
  ReturnValue,
  Arguments extends unknown[],
  Dependencies extends DiaboloService<string, Record<string, unknown>>,
> = (
  ...args: Arguments
) => Generator<Dependencies, ReturnValue, unknown>

/**
 * Create a function that requires and uses services.
 */
export function createFunction<
  ReturnValue,
  Arguments extends unknown[],
  Dependencies extends DiaboloService<string, Record<string, unknown>>,
>(
  function_: CreateFunctionCallback<ReturnValue, Arguments, Dependencies>,
): DiaboloFunction<ReturnValue, Arguments, Dependencies> {
  return Object.assign(function_, {
    _internalDoNotAssignItIsUsedForTypeInferenceArguments: undefined as never,
    _internalDoNotAssignItIsUsedForTypeInferenceDependencies:
      undefined as never,
    _internalDoNotAssignItIsUsedForTypeInferenceReturnValue: undefined as never,
  })
}
