export interface Service<
  ServiceName extends string,
  ServiceType extends Record<string, unknown>,
> {
  _internalDoNotAssignItIsUsedForTypeInferenceServiceType: ServiceType
  _tag: ServiceName
  _type: 'service'
}

export type ServiceImpl<
  ServiceToInfer extends Service<string, Record<string, unknown>>,
> = ServiceToInfer['_internalDoNotAssignItIsUsedForTypeInferenceServiceType']
