import type { Service as DiaboloService } from './service'

export type WithServices<
  Type extends 'async' | 'sync',
  // eslint-disable-next-line ts/no-explicit-any
  UserFunction extends (...args: any[]) => any,
  Services extends DiaboloService<string, Record<string, unknown>>,
> = (
  ...args: Parameters<UserFunction>
) => Type extends 'async'
  ? AsyncGenerator<
    Services,
    ReturnType<UserFunction>
  >
  : Generator<
    Services,
    ReturnType<UserFunction>
  >
