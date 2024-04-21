import { describe, expect, expectTypeOf, it } from 'vitest'

import * as DI from '../src/diabolo'
import type { UnionToIntersection } from '../src/diabolo/types/union-to-intersection'

describe('service injection', () => {
  it('should work', async () => {
    // Arrange
    interface AdderService extends DI.Service<'Adder', {
      add: (a: number, b: number) => number
    }> { }

    const adderService = DI.createService<AdderService>('Adder')

    const adderServiceImpl = DI.lazyCreateServiceImpl<AdderService>(
      () => ({
        add: (a: number, b: number) => a + b,
      }),
    )

    const mainFunction = DI.createFunction(function* () {
      const adder = yield * DI.requireService(adderService)
      return adder.add(1, 2)
    })

    // Act
    const result = DI.provide(mainFunction, {
      // eslint-disable-next-line ts/naming-convention
      Adder: adderServiceImpl,
    })()

    // Assert
    expect(result).toBe(3)
  })

  it('should be stateful', () => {
    // Arrange
    interface CounterService extends DI.Service<'Counter', {
      increment: () => void
      state: number
    }> { }

    const stateService = DI.createService<CounterService>('Counter')

    const counterServiceImpl = DI.lazyCreateServiceImpl<CounterService>(() => {
      let state = 0
      return {
        increment() {
          state++
        },
        get state() { return state },
      }
    })

    const function1 = DI.createFunction(function* () {
      const counter = yield * DI.requireService(stateService)
      counter.increment()
    })

    const function2 = DI.createFunction(function* () {
      const counter = yield * DI.requireService(stateService)
      counter.increment()
    })

    const function3 = DI.createFunction(function* () {
      const counter = yield * DI.requireService(stateService)
      return counter.state
    })

    const mainFunction = DI.createFunction(function* () {
      yield * function1()
      yield * function2()
      const state = yield * function3()
      return state
    })

    // Act
    const mainFunctionProvided = DI.provide(mainFunction, {
      // eslint-disable-next-line ts/naming-convention
      Counter: counterServiceImpl,
    })
    const result = mainFunctionProvided()

    // Assert
    expect(result).toBe(2)
    expectTypeOf(mainFunctionProvided).toMatchTypeOf<() => number>()
  })

  it('should work with async functions', async () => {
    // Arrange
    interface AdderService extends DI.Service<'Adder', {
      add: (a: number, b: number) => number
    }> { }

    const adderService = DI.createService<AdderService>('Adder')

    const adderServiceImpl = DI.lazyCreateServiceImpl<AdderService>(
      () => ({
        add: (a: number, b: number) => a + b,
      }),
    )

    const mainFunction = DI.createFunction(async function* () {
      const adder = yield * DI.requireService(adderService)
      return adder.add(1, 2)
    })

    // Act
    const mainFunctionProvided = DI.provide(mainFunction, {
      // eslint-disable-next-line ts/naming-convention
      Adder: adderServiceImpl,
    })
    const result = await mainFunctionProvided()

    // Assert
    expect(result).toBe(3)
    expectTypeOf(mainFunctionProvided).toMatchTypeOf<() => Promise<number>>()
  })

  it('should work with async providers', async () => {
    // Arrange
    interface AdderService extends DI.Service<'Adder', {
      add: (a: number, b: number) => number
    }> { }

    const adderService = DI.createService<AdderService>('Adder')

    const adderServiceImpl = DI.lazyCreateServiceImpl<AdderService>(
      () => ({
        add: (a: number, b: number) => a + b,
      }),
    )

    const mainFunction = DI.createFunction(async function* () {
      const adder = yield * DI.requireService(adderService)
      return adder.add(1, 2)
    })

    // Act
    const mainFunctionProvided = DI.provide(mainFunction, Promise.resolve({
      // eslint-disable-next-line ts/naming-convention
      Adder: adderServiceImpl,
    }))
    const result = await mainFunctionProvided()

    // Assert
    expect(result).toBe(3)
    expectTypeOf(mainFunctionProvided).toMatchTypeOf<() => Promise<number>>()
  })

  it('should be a promise if we use async functions but we do not wait for them', async () => {
    // Arrange
    interface AdderService extends DI.Service<'Adder', {
      add: (a: number, b: number) => number
    }> { }

    const adderService = DI.createService<AdderService>('Adder')

    const adderServiceImpl = DI.lazyCreateServiceImpl<AdderService>(
      () => ({
        add: (a: number, b: number) => a + b,
      }),
    )

    const mainFunction = DI.createFunction(async function* () {
      const adder = yield * DI.requireService(adderService)
      return adder.add(1, 2)
    })

    // Act
    const result = DI.provide(mainFunction, {
      // eslint-disable-next-line ts/naming-convention
      Adder: adderServiceImpl,
    })()

    // Assert
    expect(result).toBeInstanceOf(Promise)
    expectTypeOf(result).toMatchTypeOf<Promise<number>>()
  })

  it('should contain all services in the dependencies object', () => {
    interface AdderService extends DI.Service<'Adder', {
      add: (a: number, b: number) => number
    }> { }

    interface MultiplierService extends DI.Service<'Multiplier', {
      multiply: (a: number, b: number) => number
    }> { }

    type Dependencies = Exclude<Parameters<typeof DI.provide<
      unknown,
      [],
      DI.Service<string, Record<string, unknown>>,
      Generator<AdderService | MultiplierService, number, unknown>
    >>[1], Promise<unknown>>

    expectTypeOf<Dependencies>().toEqualTypeOf<{
      // eslint-disable-next-line ts/naming-convention
      Adder: () => {
        add: (a: number, b: number) => number
      }
      // eslint-disable-next-line ts/naming-convention
      Multiplier: () => {
        multiply: (a: number, b: number) => number
      }
    }>({} as never)
  })
})
