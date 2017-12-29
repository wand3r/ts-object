import { map, filter, reduce, some, every, mapToArray } from "./index"

describe("map", () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  }
  it("with arity 2", () => {
    const mappedObj = map((x, key) => (key === "b" ? x * 3 : x * 2), obj)
    expect(mappedObj).toEqual({ a: 2, b: 6, c: 6 })
  })
  it("with arity 1", () => {
    const mappedObj = map<typeof obj, number>(
      (x, key) => (key === "b" ? x * 3 : x * 2),
    )(obj)
    expect(mappedObj).toEqual({ a: 2, b: 6, c: 6 })
  })
})

describe("filter", () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  }
  it("with arity 2", () => {
    const filteredObj = filter((v, k) => v > 1 && k > "b", obj)
    expect(filteredObj).toEqual({ c: 3 })
  })
  it("with arity 1", () => {
    const filteredObj = filter<typeof obj>((v: number, k) => v > 1 && k > "b")(
      obj,
    )
    expect(filteredObj).toEqual({ c: 3 })
  })
})

describe("reduce", () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  }
  const result = [{ v: 1, k: "a" }, { v: 2, k: "b" }, { v: 3, k: "c" }]
  it("with arity 3", () => {
    const reducedObj = reduce(
      (acc, v, k) => [...acc, { v, k }],
      [] as Array<{ v: number; k: string }>,
      obj,
    )
    expect(reducedObj).toEqual(result)
  })
  it("with arity 2", () => {
    const reducedObj = reduce<
      typeof obj,
      Array<{
        v: number
        k: string
      }>
    >((acc, v, k) => [...acc, { v, k }], [])(obj)
    expect(reducedObj).toEqual(result)
  })
})

describe("some", () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  }
  it("with arity 2", () => {
    expect(some((v, k) => v === 2 && k === "b", obj)).toBeTruthy()
    expect(some((v, k) => v === 1 && k === "b", obj)).toBeFalsy()
  })
  it("with arity 1", () => {
    expect(some<typeof obj>((v, k) => v === 2 && k === "b")(obj)).toBeTruthy()
    expect(some<typeof obj>((v, k) => v === 1 && k === "b")(obj)).toBeFalsy()
  })
})

describe("every", () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  }
  it("with arity 2", () => {
    expect(every((v, k) => v > 0, obj)).toBeTruthy()
    expect(every((v, k) => v > 1, obj)).toBeFalsy()
  })
  it("with arity 1", () => {
    expect(every<typeof obj>((v, k) => v > 0)(obj)).toBeTruthy()
    expect(every<typeof obj>((v, k) => v > 1)(obj)).toBeFalsy()
  })
})

describe("mapToArray", () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  }
  const result = [{ v: 1, k: "a" }, { v: 2, k: "b" }, { v: 3, k: "c" }]
  it("with arity 2", () => {
    const arr = mapToArray((v, k) => ({ v, k }), obj)
    expect(arr).toEqual(result)
  })
  it("with arity 1", () => {
    const arr = mapToArray<typeof obj, { k: string; v: number }>((v, k) => ({
      v,
      k,
    }))(obj)
    expect(arr).toEqual(result)
  })
})
