<p align="center">
  <img
    src="https://raw.githubusercontent.com/arthur-fontaine/diabolo/main/.github/assets/logo.png"
    width="200px"
    align="center"
    alt="Diabolo logo" />
  <h1 align="center">Diabolo</h1>
  <p align="center">
    <a href="https://diabolo.js.org">https://diabolo.js.org</a>
    <br/>
    Dependency injection for JavaScript.
    <br/>
    Simple, cross-platform, type-safe.
  </p>
</p>

## Getting started

### Installation

#### Deno

```bash
deno add @arthur-fontaine/diabolo
```

You can change your import map (in `deno.json`) to allow for imports like
`import * as DI from 'diabolo'`.

```diff
{
  "imports": {
-    "@arthur-fontaine/diabolo": "jsr:@arthur-fontaine/diabolo"
+    "diabolo": "jsr:@arthur-fontaine/diabolo"
  }
}
```

#### Other environments

```bash
echo "@jsr:registry=https://npm.jsr.io" >> .npmrc
pnpm i diabolo@npm:@jsr/arthur-fontaine__diabolo
```

*See why we use JSR instead of NPM here: [https://jsr.io/docs/why](https://jsr.io/docs/why)*.

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

### What is Diabolo?

Diabolo is a library that provides a simple and type-safe way to
implement dependency injection in JavaScript. It is inspired by the
[Effect](https://effect.website/) library.

### Example

```ts
import * as DI from 'diabolo'

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

const result = DI.provide(mainFunction, {
  Adder: adderServiceImpl,
})()

// result === 3
```

### Comparison with other libraries

#### Effect

Effect is a library with a large (too large?) scope. At the time I
am writing this, the “Unpacked size” of Effect on NPM is 16.3 MB.
In comparison, the “Unpacked size” of Diabolo is only a few dozen KB.

Among other things, Effect provides a way to manage dependency injection.
To achieve dependency injection in Effect, you need to use at least 3 modules:
`Effect`, `Context`, and `Layer`. `Effect` has 305 exported members, `Context`
has 14 exported members, and `Layer` has 79 exported members. That can make
it difficult to understand how to use the library.

Also, as mentioned above, the purpose of dependency injection is decoupling.
However, Effect describes itself as “the missing standard library for
TypeScript”. Depending on how you use Effect, it may be contrary to the
principle of decoupling.

Diabolo, on its side, is a library with a very small scope. It only provides
a way to manage dependency injection. Its exported members can be counted
on the fingers of one hand. It is very easy to understand how to use the
library.

#### InversifyJS and TSyringe

InversifyJS and TSyringe are two popular dependency injection libraries
for TypeScript.

As just mentioned, they are dependency injection libraries **for TypeScript**,
and only for TypeScript. They cannot be used with vanilla JavaScript.

They also rely on TypeScript **`experimentalDecorators`**, which are not
compatible with the [TC39 decorators proposal](https://github.com/tc39/proposal-decorators), as
TypeScript decorators are based on an old version of the proposal.

Moreover, you will likely need to install `reflect-metadata` to use
decorators.

If you use Babel in your project, you will also need to install
`babel-plugin-transform-typescript-metadata`.

On the other hand, Diabolo is very simple to use. It does not require
any other dependencies. It is cross-platform because it relies on
generators, which are available in all JavaScript environments since
2016.

### Motivation

I am a big fan of the Effect library. However, it is very complex. Even
the most experienced developers can have a hard time understanding the
whole library. The concept I found most interesting in Effect is the
dependency injection part. So I decided to create a simpler library
(strongly inspired by Effect) that only focuses on dependency injection.

This way, my friends can use (and learn) dependency injection in our
school projects.

## Creating services

A service is a type that represents a *something* that can be injected.
That *something* can be a function, a class, an object… anything you
want.

To create a service in Diabolo, you need to use the `Service` type and
the `createService` function.

```ts
import * as DI from 'diabolo'

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

To implement a service in Diabolo, you need to use the `lazyCreateServiceImpl`
function.

```ts
import * as DI from 'diabolo'

const myServiceImpl = DI.lazyCreateServiceImpl<MyService>(() => ({
  myFunction: () => {
    console.log('Hello, world!')
  }
}))
```

## Using services

To use a service in Diabolo, you need to use the `createFunction` function.

```ts
import * as DI from 'diabolo'

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
import * as DI from 'diabolo'

const mainFunction = DI.createFunction(function* () {
  const myService = yield * DI.requireService(myService)
  myService.myFunction()
})
```

## Running your program

To run your program, you need to use the `provide` function and call its
return value.

```ts
import * as DI from 'diabolo'

DI.provide(mainFunction, {
  MyService: myServiceImpl
})()
```

The `provide` function is type-safe. If you forget to provide a service, you
will get a TypeScript error.

I decided to export a `provide` function instead of a `run`. This way, you
can provide the services you want and call the function later.

```ts
import * as DI from 'diabolo'

const providedMainFunction = DI.provide(mainFunction, {
  MyService: myServiceImpl
})

providedMainFunction()
```

## Alias

Instead of importing from `'diabolo'`, you can import from
`'diabolo/aliased'`. This version exports all the functions
and types from `'diabolo'` with shorter names.

```ts
import * as DI from 'diabolo/aliased'
```

Here is the table of the aliases:

| Original | Alias |
| --- | --- |
| `Service` | `Srv` |
| `createService` | `srv` |
| `lazyCreateServiceImpl` | `impl` |
| `createFunction` | `fn` |
| `requireService` | `req` |
| `provide` | `prov` |

## Examples

### API service

```ts
import * as DI from 'diabolo'

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

const dog = DI.provide(mainFunction, {
  ApiService: apiServiceImpl
})()

if (import.meta.vitest) {
  const { expect, it } = import.meta.vitest
  it('should get a dog', async () => {
    const dog = await DI.provide(mainFunction, {
      ApiService: testApiServiceImpl
    })()
    expect(dog).toBe('https://images.dog.ceo/breeds/terrier/norfolk/n02094114_1003.jpg')
  })
}
```

## License

[MIT © Arthur Fontaine](./LICENSE)
