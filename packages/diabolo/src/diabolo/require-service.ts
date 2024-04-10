import type { Service as DiaboloService, ServiceImpl } from './types/service'

/**
 * Require a service.
 * @param {DiaboloService} service The service to require.
 * @returns {Generator<DiaboloService, ServiceImpl<DiaboloService>, unknown>} The service instance.
 * @yields The service.
 */
export function* requireService<
  Service extends DiaboloService<string, Record<string, unknown>>,
>(service: Service): Generator<Service, ServiceImpl<Service>, unknown> {
  const serviceRef = service.clone()
  yield serviceRef as Service
  return serviceRef.value as ServiceImpl<Service>
}
