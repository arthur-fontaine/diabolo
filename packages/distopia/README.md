# Distopia

## Example

### `distopia`

```ts
import * as DI from 'distopia'

interface AdderService extends DI.Service<'Adder', {
  add: (a: number, b: number) => number
}> { }

const adderService = DI.createService<AdderService>('Adder')

const adderServiceImpl = DI.lazyCreateServiceImpl<AdderService>(() => ({
  add: (a: number, b: number) => a + b,
}))

const mainFunction = DI.createFunction(function* () {
  const adder = yield* DI.requireService(adderService)
  return adder.add(1, 2)
})

const result = DI.run(mainFunction(), {
  Adder: adderServiceImpl,
})

// result === 3
```

### `distopia/aliased`

```ts
import * as DI from 'distopia/aliased'

interface AdderService extends DI.Srv<'Adder', {
  add: (a: number, b: number) => number
}> { }

const adderService = DI.srv<AdderService>('Adder')

const adderServiceImpl = DI.impl<AdderService>(() => ({
  add: (a: number, b: number) => a + b,
}))

const mainFunction = DI.fn(function* () {
  const adder = yield* DI.req(adderService)
  return adder.add(1, 2)
})

const result = DI.run(mainFunction(), {
  Adder: adderServiceImpl,
})

// result === 3
```
