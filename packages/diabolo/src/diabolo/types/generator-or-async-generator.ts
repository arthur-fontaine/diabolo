export type GeneratorOrAsyncGenerator<
  T = unknown,
  // eslint-disable-next-line ts/no-explicit-any
  TReturn = any,
  TNext = unknown,
> =
  | AsyncGenerator<T, TReturn, TNext>
  | Generator<T, TReturn, TNext>
