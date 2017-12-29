Utility methods for working with plain js objects in TypeScript just like with arrays.
All functions can be used in two ways:

* By passing all parameters, then TypeScript can correctly detect all types
* By leaving last parameter for point free style programming. In many cases TypeScript can't correctly detect types and explicit generic parameters are required but it should work with `pipe` method

## Installation

```
npm i ts-object
```

## Usage

```typescript
import { map, filter, reduce, some, every, mapToArray } from "ts-object"

const obj = {
  a: 1,
  b: 2,
  c: 3,
}

const mappedObj = map((v, k) => (k === "b" ? v * 3 : v * 2), obj)
const mappedObj = map<typeof obj, number>(
  (v, k) => (k === "b" ? v * 3 : v * 2),
)(obj)

const filteredObj = filter((v, k) => v > 1 && k > "b", obj)
const filteredObj = filter<typeof obj>((v, k) => v > 1 && k > "b")(obj)

const reducedObj = reduce(
  (acc, v, k) => [...acc, { v, k }],
  [] as Array<{ v: number; k: string }>,
  obj,
)
const reducedObj = reduce<
  typeof obj,
  Array<{
    v: number
    k: string
  }>
>((acc, v, k) => [...acc, { v, k }], [])(obj)

const any = some((v, k) => v === 2 && k === "b", obj)
const any = some<typeof obj>((v, k) => v === 2 && k === "b")(obj)

const all = every((v, _k) => v > 0, obj)
const all = every<typeof obj>((v, _k) => v > 0)(obj)

const arr = mapToArray((v, k) => ({ v, k }), obj)
const arr = mapToArray<typeof obj, { k: string; v: number }>((v, k) => ({
  v,
  k,
}))(obj)
```
