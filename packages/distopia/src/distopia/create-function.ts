import type { Function as DistopiaFunction } from '../distopia/types/function'
import type { Service as DistopiaService, ServiceImpl } from '../distopia/types/service'

type CreateFunctionCallback<
  ReturnValue,
  Arguments extends unknown[],
  Dependencies extends DistopiaService<string, Record<string, unknown>>,
> = (
  ...args: Arguments
) => Generator<Dependencies, ReturnValue, unknown>

/**
 * Create a function that requires and uses services.
 */
export function createFunction<
  ReturnValue,
  Arguments extends unknown[],
  Dependencies extends DistopiaService<string, Record<string, unknown>>,
>(
  // eslint-disable-next-line unused-imports/no-unused-vars -- It will be used later.
  callback: CreateFunctionCallback<ReturnValue, Arguments, Dependencies>,
): DistopiaFunction<ReturnValue, Arguments, Dependencies> {
  return {} as unknown as DistopiaFunction<ReturnValue, Arguments, Dependencies>
}
