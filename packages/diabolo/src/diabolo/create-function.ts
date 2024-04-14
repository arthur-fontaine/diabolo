import type { GeneratorOrAsyncGenerator } from './types/generator-or-async-generator'
import type { Service as DiaboloService } from './types/service'

/**
 * Create a function that requires and uses services.
 * @param {GeneratorOrAsyncGenerator} generator The function to create that can use services.
 * @returns {Function} The function that requires and uses services.
 */
export function createFunction<
  ReturnValue,
  Arguments extends unknown[],
  Dependencies extends DiaboloService<string, Record<string, unknown>>,
  GeneratorR extends GeneratorOrAsyncGenerator<
    Dependencies,
    ReturnValue
  > = GeneratorOrAsyncGenerator<
    Dependencies,
    ReturnValue
  >,
>(
  generator: (...args: Arguments) => GeneratorR,
): (...args: Arguments) => GeneratorR extends AsyncGenerator
    ? Extract<ReturnType<typeof generator>, AsyncGenerator>
    : Extract<ReturnType<typeof generator>, Generator> {
  return generator as never
}
