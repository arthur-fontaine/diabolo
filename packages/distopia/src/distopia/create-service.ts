import type { Service as DistopiaService } from '../distopia'

/**
 * Create a service.
 */
export function createService<
  Service extends DistopiaService<string, Record<string, unknown>>,
>(name: Service['name']): Service {
  const _createService = () => {
    return {
      _type: 'service',
      clone: _createService,
      name,
    } as unknown as Service
  }

  return _createService()
}
