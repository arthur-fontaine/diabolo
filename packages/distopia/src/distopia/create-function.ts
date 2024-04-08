import type { Function as DistopiaFunction } from '../distopia/types/function'
import type { Service as DistopiaService, ServiceImpl } from '../distopia/types/service'

type CreateFunctionCallback<
  ReturnValue,
  RequiredServices extends DistopiaService<string, Record<string, unknown>>,
> = () => Generator<RequiredServices, ReturnValue, unknown>

/**
 * Create a function that requires and uses services.
 */
export function createFunction<
  ReturnValue,
  RequiredServices extends DistopiaService<string, Record<string, unknown>>,
>(
  // eslint-disable-next-line unused-imports/no-unused-vars -- It will be used later.
  callback: CreateFunctionCallback<ReturnValue, RequiredServices>,
): DistopiaFunction<ReturnValue, RequiredServices> {
  return {} as unknown as DistopiaFunction<ReturnValue, RequiredServices>
}
