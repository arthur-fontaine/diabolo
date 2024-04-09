export interface Ref<T, N extends string, Type extends string = 'ref'> {
  _type: Type
  clone: () => Ref<T, N, Type>
  name: N
  value: T
}
