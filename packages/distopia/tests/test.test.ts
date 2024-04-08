import { describe, expect, it } from 'vitest'

import * as DI from '../src/distopia'

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
    const result = DI.run(mainFunction(), {
      // eslint-disable-next-line ts/naming-convention
      Adder: adderServiceImpl,
    })

    // Assert
    expect(result).toBe(3)
  })
})
