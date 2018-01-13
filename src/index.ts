import { curry2Last, curry3Last } from "ts-function"

type Transform<V, K, R> = (value: V, key: K) => R
type Predicate<V, K> = (value: V, key: K) => boolean
type Reducer<Acc, V, K> = (acc: Acc, value: V, key: K) => Acc

type Map = {
  <O, R, K extends keyof O = keyof O>(map: Transform<O[K], K, R>, obj: O): {
    [P in K]: R
  }
  <O, R, K extends keyof O = keyof O>(map: Transform<O[K], K, R>): (
    obj: O,
  ) => Record<K, R>
}
export const map = curry2Last(
  <O, R, K extends keyof O = keyof O>(
    transform: Transform<O[K], K, R>,
    obj: O,
  ): Record<K, R> =>
    Object.keys(obj).reduce(
      (mappedObj, key: K) => {
        mappedObj[key] = transform(obj[key], key)
        return mappedObj
      },
      {} as Record<K, R>,
    ),
) as Map

type Filter = {
  <O, K extends keyof O = keyof O>(
    predicate: Predicate<O[K], K>,
    obj: O,
  ): Partial<O>
  <O, K extends keyof O = keyof O>(predicate: Predicate<O[K], K>): (
    obj: O,
  ) => Partial<O>
}
export const filter = curry2Last(
  <O, K extends keyof O>(predicate: Predicate<O[K], K>, obj: O): Partial<O> => {
    return Object.keys(obj).reduce(
      (filteredObj, key: K) => {
        if (predicate(obj[key], key)) filteredObj[key] = obj[key]
        return filteredObj
      },
      {} as Partial<O>,
    )
  },
) as Filter

type Reduce = {
  <O, Acc, K extends keyof O = keyof O>(
    fn: Reducer<Acc, O[K], K>,
    init: Acc,
    obj: O,
  ): Acc
  <O, Acc, K extends keyof O = keyof O>(fn: Reducer<Acc, O[K], K>, init: Acc): (
    obj: O,
  ) => Acc
}
export const reduce = curry3Last(
  <O, Acc, K extends keyof O = keyof O>(
    fn: Reducer<Acc, O[K], K>,
    init: Acc,
    obj: O,
  ): Acc =>
    Object.keys(obj).reduce((acc, key: K) => fn(acc, obj[key], key), init),
) as Reduce

type Obj2Boolean = {
  <O, K extends keyof O = keyof O>(
    predicate: Predicate<O[K], K>,
    obj: O,
  ): boolean
  <O, K extends keyof O = keyof O>(predicate: Predicate<O[K], K>): (
    obj: O,
  ) => boolean
}
export const some = curry2Last(
  <O, K extends keyof O = keyof O>(
    predicate: Predicate<O[K], K>,
    obj: O,
  ): boolean => Object.keys(obj).some((key: K) => predicate(obj[key], key)),
) as Obj2Boolean

export const every = curry2Last(
  <O, K extends keyof O = keyof O>(
    predicate: Predicate<O[K], K>,
    obj: O,
  ): boolean => Object.keys(obj).every((key: K) => predicate(obj[key], key)),
) as Obj2Boolean

type MapToArray = {
  <O, R, K extends keyof O = keyof O>(pick: Transform<O[K], K, R>, obj: O): R[]
  <O, R, K extends keyof O = keyof O>(pick: Transform<O[K], K, R>): (
    obj: O,
  ) => R[]
}
export const mapToArray = curry2Last(
  <O, R, K extends keyof O = keyof O>(
    pick: Transform<O[K], K, R>,
    obj: O,
  ): R[] =>
    Object.keys(obj).reduce(
      (arr, key: K) => {
        arr.push(pick(obj[key], key))
        return arr
      },
      [] as R[],
    ),
) as MapToArray

type FromArray = {
  <T, Value>(key: (x: T) => string, value: (x: T) => Value, arr: T[]): {
    [key: string]: Value
  }
  <T, Value>(key: (x: T) => string, value: (x: T) => Value): (
    arr: T[],
  ) => { [key: string]: Value }
}
export const fromArray = curry3Last(
  <T, Value>(
    key: (x: T) => string,
    value: (x: T) => Value,
    arr: T[],
  ): { [key: string]: Value } =>
    arr.reduce(
      (acc, x) => {
        acc[key(x)] = value(x)
        return acc
      },
      {} as { [key: string]: Value },
    ),
) as FromArray

export const keys = <O>(obj: O) => Object.keys(obj) as Array<keyof O>

export const values = <T>(obj: { [key: string]: T }): T[] =>
  mapToArray((v) => v, obj)
