export interface Service<
  ServiceName extends string,
  ServiceType extends Record<string, unknown>,
> {
  _internalDoNotAssignItIsUsedForTypeInference: ServiceType
  _serviceType: ServiceType
  _tag: ServiceName
}

export type ServiceImpl<
  ServiceToInfer extends Service<string, Record<string, unknown>>,
> =
  ServiceToInfer extends Service<string, infer ServiceType>
    ? ServiceType
    : never
