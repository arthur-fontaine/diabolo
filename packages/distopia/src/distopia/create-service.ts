import type { Service as DistopiaService } from '../distopia'

/**
 * Create a service.
 */
export function createService<
  Service extends DistopiaService<string, Record<string, unknown>>,
>(name: Service['_tag']): Service {
  return {
    _tag: name,
    _type: 'service',
  } as unknown as Service
}
