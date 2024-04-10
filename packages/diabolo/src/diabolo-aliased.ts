/**
 * @module diabolo
 *
 * This module provides the same simple dependency injection utilities as the default export, but with shorter names.
 *
 * | Original | Alias |
 * | --- | --- |
 * | `Service` | `Srv` |
 * | `createService` | `srv` |
 * | `lazyCreateServiceImpl` | `impl` |
 * | `createFunction` | `fn` |
 * | `requireService` | `req` |
 * | `provide` | `prov` |
 */

export { createFunction as fn } from './diabolo/create-function'
export { createService as srv } from './diabolo/create-service'
export { lazyCreateServiceImpl as impl } from './diabolo/lazy-create-service-impl'
export { provide as prov } from './diabolo/provide'
export { requireService as req } from './diabolo/require-service'
export type { Service as Srv } from './diabolo/types/service'
