import { describe, expectTypeOf, it } from 'vitest'

import * as DI from '../src/diabolo'
import type { GeneratorOrAsyncGenerator } from '../src/diabolo/types/generator-or-async-generator'

// eslint-disable-next-line ts/no-explicit-any
type GetDependencies<T extends (...args: any[]) => GeneratorOrAsyncGenerator> =
  T extends (...args: infer A) => GeneratorOrAsyncGenerator<infer D>
    ? D
    : never

describe('type WithServices', () => {
  it('should work when a service is required and used', () => {
    interface AdderService extends DI.Service<'Adder', {
      add: (a: number, b: number) => number
    }> { }
    const adderService = DI.createService<AdderService>('Adder')

    interface MultiplierService extends DI.Service<'Multiplier', {
      multiply:
      DI.WithServices<'sync', (a: number, b: number) => number, AdderService>
    }> { }

    const multiply = DI.createFunction(function* (a: number, b: number) {
      const adder = yield * DI.requireService(adderService)
      let result = 0
      for (let i = 0; i < a; i++) {
        result = adder.add(result, b)
      }
      return result
    })

    expectTypeOf(multiply).toMatchTypeOf<
      ReturnType<
        Parameters<typeof DI.lazyCreateServiceImpl<MultiplierService>>[0]
      >['multiply']
    >()
  })

  it('should work when a service is required but not used', () => {
    interface AdderService extends DI.Service<'Adder', {
      add: (a: number, b: number) => number
    }> { }

    interface MultiplierService extends DI.Service<'Multiplier', {
      multiply:
      DI.WithServices<'sync', (a: number, b: number) => number, AdderService>
    }> { }

    const multiply = DI.createFunction(function* (a: number, b: number) {
      return a * b
    })

    expectTypeOf(multiply).toMatchTypeOf<
      ReturnType<
        Parameters<typeof DI.lazyCreateServiceImpl<MultiplierService>>[0]
      >['multiply']
    >()
  })

  it('should pass down service', () => {
    interface AdderService extends DI.Service<'Adder', {
      add: (a: number, b: number) => number
    }> { }

    interface MultiplierService extends DI.Service<'Multiplier', {
      multiply:
      DI.WithServices<'sync', (a: number, b: number) => number, AdderService>
    }> { }
    const multiplierService = DI.createService<MultiplierService>('Multiplier')

    const mainFunction = DI.createFunction(function* () {
      const multiplier = yield * DI.requireService(multiplierService)
      return yield * multiplier.multiply(2, 3)
    })

    expectTypeOf({} as GetDependencies<typeof mainFunction>)
      .exclude<MultiplierService>()
      .toEqualTypeOf<AdderService>()
  })

  it('should pass down multiple services', () => {
    interface AdderService extends DI.Service<'Adder', {
      add: (a: number, b: number) => number
    }> { }

    interface LoggerService extends DI.Service<'Logger', {
      log: (message: string) => void
    }> { }

    interface MultiplierService extends DI.Service<'Multiplier', {
      multiply:
      DI.WithServices<'sync', (a: number, b: number) => number, AdderService | LoggerService>
    }> { }
    const multiplierService = DI.createService<MultiplierService>('Multiplier')

    const mainFunction = DI.createFunction(function* () {
      const multiplier = yield * DI.requireService(multiplierService)
      return yield * multiplier.multiply(2, 3)
    })

    expectTypeOf({} as GetDependencies<typeof mainFunction>)
      .exclude<MultiplierService>()
      .toEqualTypeOf<AdderService | LoggerService>()
  })

  it('should not work when a service is used but not required', () => {
    interface AdderService extends DI.Service<'Adder', {
      add: (a: number, b: number) => number
    }> { }
    const adderService = DI.createService<AdderService>('Adder')

    interface MultiplierService extends DI.Service<'Multiplier', {
      multiply:
      DI.WithServices<'sync', (a: number, b: number) => number, never>
    }> { }

    const multiply = DI.createFunction(function* (a: number, b: number) {
      const adder = yield * DI.requireService(adderService)
      let result = 0
      for (let i = 0; i < a; i++) {
        result = adder.add(result, b)
      }
      return result
    })

    expectTypeOf(multiply)
      .not
      .toMatchTypeOf<
      ReturnType<
        Parameters<
            typeof DI.lazyCreateServiceImpl<MultiplierService>
        >[0]
      >['multiply']
    >()
  })
})
