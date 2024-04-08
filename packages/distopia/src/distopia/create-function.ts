import type { Function as DistopiaFunction } from '../distopia/types/function'
import type { Service as DistopiaService, ServiceImpl } from '../distopia/types/service'

type CreateFunctionCallback<
  ReturnValue,
  Dependencies extends DistopiaService<string, Record<string, unknown>>,
> = () => Generator<Dependencies, ReturnValue, unknown>

/**
 * Create a function that requires and uses services.
 */
export function createFunction<
  ReturnValue,
  Dependencies extends DistopiaService<string, Record<string, unknown>>,
>(
  // eslint-disable-next-line unused-imports/no-unused-vars -- It will be used later.
  callback: CreateFunctionCallback<ReturnValue, Dependencies>,
): DistopiaFunction<ReturnValue, Dependencies> {
  return {} as unknown as DistopiaFunction<ReturnValue, Dependencies>
}
