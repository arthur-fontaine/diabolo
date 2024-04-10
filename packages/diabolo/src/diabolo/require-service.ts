import type { Service as DiaboloService, ServiceImpl } from './types/service'

type AnyService = DiaboloService<string, Record<string, unknown>>
type AnyServiceImpl = ServiceImpl<AnyService>

const serviceImplMap = new Map<AnyService, AnyServiceImpl>()

/**
 * Require a service.
 * @param {DiaboloService} service The service to require.
 * @returns {Generator<DiaboloService, ServiceImpl<DiaboloService>, unknown>} The service instance.
 * @yields The service.
 */
export function* requireService<
  Service extends DiaboloService<string, Record<string, unknown>>,
>(service: Service): Generator<Service, ServiceImpl<Service>, unknown> {
  if (serviceImplMap.has(service)) {
    return serviceImplMap.get(service) as ServiceImpl<Service>
  }

  const serviceRef = service.clone()
  yield serviceRef as Service

  const impl = serviceRef.value as ServiceImpl<Service>

  serviceImplMap.set(service, impl)

  return impl
}
