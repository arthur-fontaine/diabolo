import type { Function as DiaboloFunction } from './function'
import type { Service as DiaboloService } from './service'

export type WithServices<
  // eslint-disable-next-line ts/no-explicit-any
  UserFunction extends (...args: any[]) => any,
  Services extends DiaboloService<string, Record<string, unknown>>,
> = DiaboloFunction<
  ReturnType<UserFunction>,
  Parameters<UserFunction>,
  Services
>
