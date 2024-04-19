// https://stackoverflow.com/a/50375286/13123142

export type UnionToIntersection<U> =
  // eslint-disable-next-line ts/no-explicit-any
  (U extends any ? (x: U) => void : never) extends ((x: infer I) => void)
    ? I
    : never
