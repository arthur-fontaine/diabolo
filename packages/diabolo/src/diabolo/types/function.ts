import type { Service as DiaboloService } from './service'

export interface Function<
  ReturnValue,
  Arguments extends unknown[],
  Dependencies extends DiaboloService<string, Record<string, unknown>>,
> {
  (...args: Arguments): Generator<Dependencies, ReturnValue>
  _internalDoNotAssignItIsUsedForTypeInferenceArguments: Arguments
  _internalDoNotAssignItIsUsedForTypeInferenceDependencies: Dependencies
  _internalDoNotAssignItIsUsedForTypeInferenceReturnValue: ReturnValue
}

export type FunctionDependencies<
  FunctionToInfer extends Function<
    ReturnValue,
    Arguments,
    Dependencies
  >,
  ReturnValue = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceReturnValue'],
  Arguments extends unknown[] = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceArguments'],
  Dependencies extends DiaboloService<string, Record<string, unknown>> = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceDependencies'],
> = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceDependencies']

export type FunctionReturnValue<
  FunctionToInfer extends Function<
    ReturnValue,
    Arguments,
    Dependencies
  >,
  ReturnValue = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceReturnValue'],
  Arguments extends unknown[] = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceArguments'],
  Dependencies extends DiaboloService<string, Record<string, unknown>> = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceDependencies'],
> = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceReturnValue']

export type FunctionArguments<
  FunctionToInfer extends Function<
    ReturnValue,
    Arguments,
    Dependencies
  >,
  ReturnValue = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceReturnValue'],
  Arguments extends unknown[] = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceArguments'],
  Dependencies extends DiaboloService<string, Record<string, unknown>> = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceDependencies'],
> = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceArguments']
