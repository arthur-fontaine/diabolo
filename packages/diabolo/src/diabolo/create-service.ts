import type { Service as DiaboloService } from '../diabolo'

/**
 * Create a service.
 * @param {string} name The name of the service.
 * @returns {DiaboloService} The service.
 */
export function createService<
  Service extends DiaboloService<string, Record<string, unknown>>,
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
