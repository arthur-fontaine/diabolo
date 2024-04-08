import type { Service as DistopiaService } from './service'

export interface Function<
  ReturnValue,
  Dependencies extends DistopiaService<string, Record<string, unknown>>,
> {
  _internalDoNotAssignItIsUsedForTypeInferenceDependencies: Dependencies
  _internalDoNotAssignItIsUsedForTypeInferenceReturnValue: ReturnValue
}

export type FunctionDependencies<
  FunctionToInfer extends Function<
    unknown,
    DistopiaService<string, Record<string, unknown>>
  >,
> = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceDependencies']

export type FunctionReturnValue<
  FunctionToInfer extends Function<
    unknown,
    DistopiaService<string, Record<string, unknown>>
  >,
> = FunctionToInfer['_internalDoNotAssignItIsUsedForTypeInferenceReturnValue']
