type Transform<V, K, R> = (value: V, key: K) => R
type Predicate<V, K> = (value: V, key: K) => boolean
type Reducer<Acc, V, K> = (acc: Acc, value: V, key: K) => Acc

type Arity2<A, B, C> = (a: A, b: B) => C
type Curried2<A, B, C> = {
  (a: A, b: B): C
  (a: A): (b: B) => C
}
const curry2: <A, B, C>(fn: Arity2<A, B, C>) => Curried2<A, B, C> = (fn) => {
  const curried = (...args: any[]) => {
    switch (args.length) {
      case 2: {
        const [a, b] = args
        return fn(a, b)
      }
      case 1: {
        const [a] = args
        return (b: any) => fn(a, b)
      }
      default:
        throw new Error("Wrong arity")
    }
  }
  return curried as Curried2<any, any, any>
}

type Arity3<A, B, C, D> = (a: A, b: B, c: C) => D
type Curried3<A, B, C, D> = {
  (a: A, b: B, c: C): D
  (a: A, b: B): (c: C) => D
}
const curry3: <A, B, C, D>(fn: Arity3<A, B, C, D>) => Curried3<A, B, C, D> = (
  fn,
) => {
  const curried = (...args: any[]) => {
    switch (args.length) {
      case 3: {
        const [a, b, c] = args
        return fn(a, b, c)
      }
      case 2: {
        const [a, b] = args
        return (c: any) => fn(a, b, c)
      }
      default:
        throw new Error("Wrong arity")
    }
  }
  return curried as Curried3<any, any, any, any>
}

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
