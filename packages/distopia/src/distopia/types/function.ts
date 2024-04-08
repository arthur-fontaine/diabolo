import type { Service as DistopiaService } from './service'

export interface Function<
  ReturnValue,
  Arguments extends unknown[],
  Dependencies extends DistopiaService<string, Record<string, unknown>>,
> {
  _internalDoNotAssignItIsUsedForTypeInferenceArguments: Arguments
  _internalDoNotAssignItIsUsedForTypeInferenceDependencies: Dependencies
  _internalDoNotAssignItIsUsedForTypeInferenceReturnValue: ReturnValue
}

export type FunctionDependencies<
  FunctionToInfer extends Function<
    unknown,
    unknown[],
    DistopiaService<string, Record<string, unknown>>
  >,
> = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceDependencies']

export type FunctionReturnValue<
  FunctionToInfer extends Function<
    unknown,
    unknown[],
    DistopiaService<string, Record<string, unknown>>
  >,
> = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceReturnValue']

export type FunctionArguments<
  FunctionToInfer extends Function<
    unknown,
    unknown[],
    DistopiaService<string, Record<string, unknown>>
  >,
> = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceArguments']
