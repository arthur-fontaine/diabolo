import type { Service as DistopiaService } from './service'

export interface Function<
  ReturnValue,
  RequiredServices extends DistopiaService<string, Record<string, unknown>>,
> {
  _internalDoNotAssignItIsUsedForTypeInferenceRequiredServices: RequiredServices
  _internalDoNotAssignItIsUsedForTypeInferenceReturnValue: ReturnValue
}
