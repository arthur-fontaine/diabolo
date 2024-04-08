# Distopia

## Example

```ts
import * as DI from 'distopia'

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

const result = DI.run(mainFunction(), {
  Adder: adderServiceImpl,
})

// result === 3
```
