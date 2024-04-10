import type { Service as DiaboloService, ServiceImpl } from './types/service'

/**
 * Lazy create a service implementation.
 * @param {Function} impl A function that returns a service implementation.
 * @returns {Function} A function that returns a service implementation.
 */
export function lazyCreateServiceImpl<
  Service extends DiaboloService<string, Record<string, unknown>>,
>(
  impl: () => ServiceImpl<Service>,
): () => ServiceImpl<Service> {
  return impl
}
