import type { Service as DistopiaService, ServiceImpl } from './types/service'

/**
 * Require a service.
 */
export function* requireService<
  Service extends DistopiaService<string, Record<string, unknown>>,
>(service: Service): Generator<Service, ServiceImpl<Service>, unknown> {
  const serviceRef = service.clone()
  yield serviceRef as Service
  return serviceRef.value as ServiceImpl<Service>
}
