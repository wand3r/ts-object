import { curry2, curry3 } from "./curry"

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
export const map = curry2(
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
export const filter = curry2(
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
export const reduce = curry3(
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
export const some = curry2(
  <O, K extends keyof O = keyof O>(
    predicate: Predicate<O[K], K>,
    obj: O,
  ): boolean => Object.keys(obj).some((key: K) => predicate(obj[key], key)),
) as Obj2Boolean

export const every = curry2(
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
export const mapToArray = curry2(
  <O, R, K extends keyof O = keyof O>(
    pick: Transform<O[K], K, R>,
    obj: O,
  ): R[] =>
    Object.keys(obj).reduce(
      (arr, key: K) => [...arr, pick(obj[key], key)],
      [] as R[],
    ),
) as MapToArray
