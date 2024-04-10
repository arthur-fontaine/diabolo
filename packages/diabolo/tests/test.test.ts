import { describe, expect, it } from 'vitest'

import * as DI from '../src/diabolo'

describe('service injection', () => {
  it('should work', () => {
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
    const result = DI.provide(mainFunction, {
      // eslint-disable-next-line ts/naming-convention
      Counter: counterServiceImpl,
    })()

    // Assert
    return expect(result).toBe(2)
  })
})
