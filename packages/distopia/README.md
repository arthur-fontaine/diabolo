# Distopia

## Example

```ts
import * as DI from 'distopia'

interface LoggerService extends DI.Service<'Logger', {
  log: (message: string) => void
}> {}

const loggerService = DI.createService<LoggerService>('Logger')

const loggerServiceImpl = DI.lazyCreateServiceImpl(
  loggerService,
  () => ({
    log: (message: string) => console.log(message)
  })
)

const mainFunction = DI.createFunction(({ require }) => {
  const logger = require(loggerService)
  logger.log('Hello, world!')
})

DI.runFunction(mainFunction, {
  loggerService: loggerServiceImpl
})
```
