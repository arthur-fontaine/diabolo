import type { Ref } from './ref'

export interface Service<
  ServiceName extends string,
  ServiceType extends Record<string, unknown>,
> extends Ref<ServiceType, ServiceName, 'service'> {
}

export type ServiceImpl<
  ServiceToInfer extends Service<string, Record<string, unknown>>,
> = ServiceToInfer['value']
