import type { Service as DistopiaService, ServiceImpl } from './types/service'

/**
 * Lazy create a service implementation.
 */
export function lazyCreateServiceImpl<
  Service extends DistopiaService<string, Record<string, unknown>>,
>(
  service: Service,
  impl: () => ServiceImpl<Service>,
): () => ServiceImpl<Service> {
  return impl
}
