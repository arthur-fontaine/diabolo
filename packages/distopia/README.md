<p align="center">
  <img
    src="./.github/assets/logo.png"
    width="200px"
    align="center"
    alt="Distopia logo" />
  <h1 align="center">Distopia</h1>
  <p align="center">
    <a href="https://distopia.js.org">https://distopia.js.org</a>
    <br/>
    Dependency injection for JavaScript.
    <br/>
    Simple, cross-platform, type-safe.
  </p>
</p>

## Getting started

### Installation

```bash
echo "@jsr:registry=https://npm.jsr.io" >> .npmrc
npm i distopia@npm:@jsr/arthur-fontaine__distopia
```

### What is dependency injection?

Dependency injection is a technique used to create loosely coupled
software components, enhancing the modularity, to make the software
easier to maintain and test.

A common use case for dependency injection is to create an API service.
In your application, you can implement the API service using a real
network request, and in your tests, you can implement the API service
using mock data.

That's where dependency injection comes in. However, using dependency
injection in the JavaScript ecosystem is not a common practice, despite
its benefits.

### What is Distopia?

Distopia is a library that provides a simple and type-safe way to
implement dependency injection in JavaScript. It is inspired by the
[Effect](https://effect.website/) library.

Let's see an example:

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
  const adder = yield * DI.requireService(adderService)
  return adder.add(1, 2)
})

const result = DI.run(mainFunction(), {
  Adder: adderServiceImpl,
})

// result === 3
```

### Motivation

I am a big fan of the Effect library. However, it is very complex. Even
the most experienced developers can have a hard time understanding the
whole library. The concept I found most interesting in Effect is the
dependency injection part. So I decided to create a simpler library
(strongly inspired by Effect) that only focuses on dependency injection.

## Creating services

A service is a type that represents a *something* that can be injected.
That *something* can be a function, a class, an object… anything you
want.

To create a service in Distopia, you need to use the `Service` type and
the `createService` function.

```ts
import * as DI from 'distopia'

interface MyService extends DI.Service<
  'MyService', // The name of the service
  {
    myFunction: () => void
  } // The type of the service
> { }

const myService = DI.createService<MyService>('MyService')
```

## Implementing services

Implementing a service is creating a function that returns the service.

To implement a service in Distopia, you need to use the `lazyCreateServiceImpl`
function.

```ts
import * as DI from 'distopia'

const myServiceImpl = DI.lazyCreateServiceImpl<MyService>(() => ({
  myFunction: () => {
    console.log('Hello, world!')
  }
}))
```

## Using services

To use a service in Distopia, you need to use the `createFunction` function.

```ts
import * as DI from 'distopia'

const mainFunction = DI.createFunction(function* () {
  // ...
})
```

> [!NOTE]
> The `createFunction` function does nothing other than returning what
> you pass to it. It is used to improve your development experience,
> but you can use the `function*` syntax directly if you want.

Now, you can use the `yield * DI.requireService` function to get the
service you want.

```ts
import * as DI from 'distopia'

const mainFunction = DI.createFunction(function* () {
  const myService = yield * DI.requireService(myService)
  myService.myFunction()
})
```

## Running your program

To run your program, you need to use the `run` function.

```ts
import * as DI from 'distopia'

DI.run(mainFunction(), {
  MyService: myServiceImpl
})
```

The `run` function is type-safe. If you forget to provide a service, you
will get a TypeScript error.

## Alias

Instead of importing from `'distopia'`, you can import from
`'distopia/aliased'`. This version exports all the functions
and types from `'distopia'` with shorter names.

```ts
import * as DI from 'distopia/aliased'
```

Here is the table of the aliases:

| Original | Alias |
| --- | --- |
| `Service` | `Srv` |
| `createService` | `srv` |
| `lazyCreateServiceImpl` | `impl` |
| `createFunction` | `fn` |
| `requireService` | `req` |
| `run` | `run` |

## Examples

### API service

```ts
import * as DI from 'distopia'

interface ApiService extends DI.Service<'ApiService', {
  getDog: () => Promise<string>
}> { }

const apiService = DI.createService<ApiService>('ApiService')

const apiServiceImpl = DI.lazyCreateServiceImpl<ApiService>(() => ({
  getDog: async () => {
    const response = await fetch('https://dog.ceo/api/breeds/image/random')
    const data = await response.json()
    return data.message
  }
}))

const testApiServiceImpl = DI.lazyCreateServiceImpl<ApiService>(() => ({
  getDog: async () => 'https://images.dog.ceo/breeds/terrier/norfolk/n02094114_1003.jpg'
}))

const mainFunction = DI.createFunction(function* () {
  const api = yield * DI.requireService(apiService)
  const dog = api.getDog()
  return dog
})

DI.run(mainFunction(), {
  ApiService: apiServiceImpl
})

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest
  it('should get a dog', async () => {
    const dog = await DI.run(mainFunction(), {
      ApiService: testApiServiceImpl
    })
    expect(dog).toBe('https://images.dog.ceo/breeds/terrier/norfolk/n02094114_1003.jpg')
  })
}
```

## License

[MIT © Arthur Fontaine](./LICENSE)
