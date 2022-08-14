/**
 * Redwood targets Node.js 12, but that doesn't factor into what gets polyfilled
 * because Redwood uses the plugin-transform-runtime polyfill strategy.
 *
 * Also, plugin-transform-runtime is pinned to core-js v3.0.0,
 * so the list of available polyfill is a little outdated.
 * Some "ES Next" polyfills have landed in v12+ Node.js versions.
 *
 * Key:
 * - ✅ -> plugin-transform-runtime polyfills this
 * - ❌  -> plugin-transform-runtime doesn't polyfill this
 *
 * Note that these polyfills comprise...
 *
 * - feautres that landed in more-recent versions of Node.js (ES)
 * - proposals (ES Next)
 *
 * These examples have been taken from the core-js README, the proposal's README, or MDN.
 */

/**
 * # ES
 */

// ✅ / Node.js 15 / es.aggregate-error
const error1 = new TypeError('Error 1')
const error2 = new TypeError('Error 2')
const aggregate = new AggregateError([error1, error2], 'Collected errors')

// ✅ / Node.js 15  / es.promise.any
Promise.any([
  Promise.resolve(1),
  Promise.reject(2),
  Promise.resolve(3),
]).then(console.log)
Promise.any([
  Promise.reject(1),
  Promise.reject(2),
  Promise.reject(3),
]).catch(({ errors }) => console.log(errors))

// ✅ / Node.js 15 / es.string.replace-all
'Test abc test test abc test.'.replaceAll('abc', 'foo')

// ✅ / Node.js 16.6 / es.array.at
;[1, 2, 3].at(1)
;[1, 2, 3].at(-1)

// ✅ / Node.js 16.9 / es.object.has-own
Object.hasOwn({ foo: 42 }, 'foo')

// ❌ / Node.js 17 / es.typed-array.set
//
// This is overriden in core-js-pure.
// See https://github.com/zloirock/core-js/blob/master/packages/core-js-pure/override/modules/es.typed-array.set.js.
const buffer = new ArrayBuffer(8)
const uint8 = new Uint8Array(buffer)
uint8.set([1, 2, 3], 3)

// ✅ / Node.js 18 / es.array.find-last, es.array.find-last-index
function isOdd(value) {
  return value % 2
}
;[1, 2, 3, 4].findLast(isOdd)
;[1, 2, 3, 4].findLastIndex(isOdd)

// ✅ / Node.js 17 / web.dom-exception.constructor, web.dom-exception.stack, web.dom-exception.to-string-tag
const exception = new DOMException('error', 'DataCloneError');
console.log(exception.name)
console.log(exception.message)
console.log(exception.code)
console.log(typeof exception.stack)
console.log(exception instanceof DOMException)
console.log(exception instanceof Error)
console.log(exception.toString())
console.log(Object.prototype.toString.call(exception))

// ✅ / Node.js 17 / web.structured-clone
const structured = [{ a: 42 }]
const sclone = structuredClone(structured)

// ✅ / Node.js 17.5 / web.btoa
btoa('hi, core-js')

// ✅ / Node.js 18 / web.atob
atob('aGksIGNvcmUtanM=')

/**
 * # ES Next
 */

/**
 * ## Array
 *
 * ✅ / Stage 1 proposal / esnext.array.filter-out, esnext.array.filter-reject
 * ✅ / Stage 1 proposal / esnext.array.unique-by
 * ✅ / Stage 2 proposal / esnext.array.from-async
 * ✅ / Stage 2 proposal / esnext.array.is-template-object
 * ✅ / Stage 3 proposal / esnext.array.to-reversed, esnext.array.to-sorted, esnext.array.to-spliced, esnext.array.with
 *
 * ❌ / Stage 1 proposal / esnext.array.last-index, esnext.array.last-item
 *
 * These are overriden in core-js-pure. See...
 * - https://github.com/zloirock/core-js/blob/master/packages/core-js-pure/override/modules/esnext.array.last-index.js,
 * - https://github.com/zloirock/core-js/blob/master/packages/core-js-pure/override/modules/esnext.array.last-item.js
 *
 * ❌ / Stage 3 / esnext.array.group, esnext.array.group-by, esnext.array.group-by-to-map, esnext.array.group-to-map
 */
;[1, 2, 3, 4, 5].filterReject(it => it % 2)
;[1, 2, 3, 2, 1].uniqueBy()
await Array.fromAsync((async function * (){ yield * [1, 2, 3] })(), i => i * i)
Array.isTemplateObject((it => it)`qwe${ 123 }asd`)
;[1, 2, 3].toReversed()
;[3, 1, 2].toSorted()
;[1, 2, 3, 4].toSpliced(1, 2, 5, 6, 7)
;[1, 1, 3].with(1, 2)

;[1, 2, 3].lastItem
;[1, 2, 3].lastIndex

const array = [1, 2, 3]
array.lastItem = 4

new Array(1, 2, 3).lastItem
new Array(1, 2, 3).lastIndex

;[1, 2, 3, 4, 5].group(it => it % 2)
const map = [1, 2, 3, 4, 5].groupToMap(it => it % 2)
map.get(1)
map.get(0)

/**
 * ## BigInt
 *
 * ✅ / Stage 1 proposal / esnext.bigint.range
 */
for (const i of BigInt.range(0n, 43n)) console.log(i)

/**
 * ## compositeKey, compositeSymbol
 *
 * ✅ / Stage 1 proposal / esnext.composite-key, esnext.composite-symbol
 */
const key = compositeKey({})
const symbol = compositeSymbol({})

/**
 * ## Function
 *
 * ✅ / Stage 0 proposal / esnext.function.un-this
 * ✅ / Stage ? proposal / esnext.function.is-callable, esnext.function.is-constructor
 */
const slice = Array.prototype.slice.unThis();
slice([1, 2, 3], 1)
Function.isCallable(null)
Function.isConstructor(null)

/**
 * ## Iterator
 *
 * ✅ / Stage 2 proposal /
 * - esnext.async-iterator.constructor
 * - esnext.async-iterator.as-indexed-pairs
 * - esnext.async-iterator.drop
 * - esnext.async-iterator.every
 * - esnext.async-iterator.filter
 * - esnext.async-iterator.find
 * - esnext.async-iterator.flat-map
 * - esnext.async-iterator.for-each
 * - esnext.async-iterator.from
 * - esnext.async-iterator.indexed
 * - esnext.async-iterator.map
 * - esnext.async-iterator.reduce
 * - esnext.async-iterator.some
 * - esnext.async-iterator.take
 * - esnext.async-iterator.to-array
 * - esnext.iterator.constructor
 * - esnext.iterator.as-indexed-pairs
 * - esnext.iterator.drop
 * - esnext.iterator.every
 * - esnext.iterator.filter
 * - esnext.iterator.find
 * - esnext.iterator.flat-map
 * - esnext.iterator.for-each
 * - esnext.iterator.from
 * - esnext.iterator.indexed
 * - esnext.iterator.map
 * - esnext.iterator.reduce
 * - esnext.iterator.some
 * - esnext.iterator.take
 * - esnext.iterator.to-array
 * - esnext.iterator.to-async
 */
;[1, 2, 3, 4, 5, 6, 7].values()
  .drop(1)
  .take(5)
  .filter(it => it % 2)
  .map(it => it ** 2)
  .toArray()

Iterator.from({
  next: () => ({ done: Math.random() > .9, value: Math.random() * 10 | 0 })
}).toArray()

await AsyncIterator.from([1, 2, 3, 4, 5, 6, 7])
  .drop(1)
  .take(5)
  .filter(it => it % 2)
  .map(it => it ** 2)
  .toArray()

await [1, 2, 3].values().toAsync().map(async it => it ** 2).toArray()

/**
 * ## Map
 *
 * ✅ / Stage 1 proposal /
 * - esnext.map.delete-all
 * - esnext.map.every
 * - esnext.map.filter
 * - esnext.map.find
 * - esnext.map.find-key
 * - esnext.map.from
 * - esnext.map.group-by
 * - esnext.map.includes
 * - esnext.map.key-by
 * - esnext.map.key-of
 * - esnext.map.map-keys
 * - esnext.map.map-values
 * - esnext.map.merge
 * - esnext.map.of
 * - esnext.map.reduce
 * - esnext.map.some
 * - esnext.map.update
 *
 * ✅ / Stage 1 proposal / esnext.map.emplace
 * Stage ? proposal / esnext.map.update-or-insert, esnext.map.upsert
 */
const m = new Map()
m.deleteAll()

const mapEmplace = new Map([['a', 2]])
mapEmplace.emplace('a', { update: it => it ** 2, insert: () => 3})

/**
 * ## Math
 *
 * ✅ / Stage 1 proposal /
 * - esnext.math.clamp
 * - esnext.math.deg-per-rad
 * - esnext.math.degrees
 * - esnext.math.fscale
 * - esnext.math.rad-per-deg
 * - esnext.math.radians
 * - esnext.math.scale
 * - esnext.math.signbit
 *
 * ✅ / Will be removed in core-js 4 /
 * - esnext.math.iaddh
 * - esnext.math.imulh
 * - esnext.math.isubh
 * - esnext.math.umulh
 * - esnext.math.seeded-prng
 */
Math.clamp(2, 1, 3)
Math.DEG_PER_RAD
Math.degrees(1)
Math.fscale(5, 1, 1, 2, 2)
Math.RAD_PER_DEG
Math.radians(360)
Math.scale(5, 1, 1, 2, 2)
Math.signbit(NaN)

Math.iaddh(lo0, hi0, lo1, hi1)
Math.imulh(a, b)
Math.isubh(lo0, hi0, lo1, hi1)
Math.umulh(a, b)
for (let x of Math.seededPRNG({ seed: 42 })) {
  console.log(x)
  if (x > .8) break
}

/**
 * ## Number
 *
 * ✅ / Stage 1 proposal / esnext.number.from-string
 * ✅ / Stage 1 proposal / esnext.number.range
 */
Number.fromString('42')

for (const i of Number.range(1, 10)) {
  console.log(i)
}

/**
 * ## Object
 *
 * ❌ / Will be removed in core-js 4 / esnext.object.iterate-entries, esnext.object.iterate-keys, esnext.object.iterate-values
 */
const obj = { foo: 'bar', baz: 'blah' }

for (const [key, value] of Object.iterateEntries(obj)) {
  console.log(`${key} -> ${value}`)
}

for (const key of Object.iterateKeys(obj)) {
  console.log(key)
}

for (const value of Object.iterateValues(obj)) {
  console.log(value)
}

/**
 * ## Observable
 *
 * ✅ / Stage 1 proposal / esnext.observable
 */
new Observable(observer => {
  observer.next('hello')
  observer.next('world')
  observer.complete()
}).subscribe({
  next(it) { console.log(it) },
  complete() { console.log('!') }
})

Symbol.observable

/**
 * ## Promise
 *
 * ✅ / Will be removed in core-js 4 / esnext.promise.try
 */
Promise.try(() => 42).then(it => console.log(`Promise, resolved as ${it}`))
Promise.try(() => { throw 42; }).catch(it => console.log(`Promise, rejected as ${it}`))

/**
 * ## Reflect metadata
 *
 * ✅ / Stage ? proposal /
 * - esnext.reflect.define-metadata
 * - esnext.reflect.delete-metadata
 * - esnext.reflect.get-metadata
 * - esnext.reflect.get-metadata-keys
 * - esnext.reflect.get-own-metadata
 * - esnext.reflect.get-own-metadata-keys
 * - esnext.reflect.has-metadata
 * - esnext.reflect.has-own-metadata
 * - esnext.reflect.metadata
 */
Reflect.defineMetadata(metadataKey, metadataValue, target)
Reflect.deleteMetadata(metadataKey, target)
Reflect.getMetadata(metadataKey, target)
Reflect.getMetadataKeys(target)
Reflect.getOwnMetadata(metadataKey, target)
Reflect.getOwnMetadataKeys(target)
Reflect.hasMetadata(metadataKey, target)
Reflect.hasOwnMetadata(metadataKey, target)
Reflect.metadata(metadataKey, metadataValue)

/**
 * ## Set
 *
 * ✅ / Stage 1 proposal /
 * - esnext.set.add-all
 * - esnext.set.delete-all
 * - esnext.set.difference
 * - esnext.set.every
 * - esnext.set.filter
 * - esnext.set.find
 * - esnext.set.from
 * - esnext.set.intersection
 * - esnext.set.is-disjoint-from
 * - esnext.set.is-subset-of
 * - esnext.set.is-superset-of
 * - esnext.set.join
 * - esnext.set.map
 * - esnext.set.of
 * - esnext.set.reduce
 * - esnext.set.some
 * - esnext.set.symmetric-difference
 * - esnext.set.union
 */
const s = new Set()
s.addAll()

/**
 * ## String
 *
 * ✅ / Stage 1 proposal / esnext.string.code-points
 * ✅ / Stage 1 proposal / esnext.string.cooked
 * ✅ / Will be removed in core-js 4 / esnext.string.at
 */
for (let { codePoint, position } of 'qwe'.codePoints()) {
  console.log(codePoint)
  console.log(position)
}

String.cooked`mmm ... \u0064elicious cooked string`;

'a𠮷b'.at(1)
'a𠮷b'.at(1).length

/**
 * ## Symbol
 *
 * ✅ / Stage 1 proposal / esnext.symbol.pattern-match, esnext.symbol.matcher
 * ✅ / Stage 2 proposal / esnext.symbol.dispose, esnext.symbol.async-dispose
 * ✅ / Stage 2 / esnext.symbol.metadata, esnext.symbol.metadata-key
 * esnext.symbol.replace-all...
 */
Symbol.dispose
Symbol.asyncDispose

Symbol.patternMatch
Symbol.matcher

Symbol.metadata
Symbol.metadataKey

Symbol.replaceAll

/**
 * ## WeakMap
 *
 * ✅ / Stage 1 proposal /
 * - esnext.weak-map.delete-all
 * - esnext.weak-map.from
 * - esnext.weak-map.of

 * ✅ / Stage 2 proposal / esnext.weak-map.emplace
 */
const wm = new WeakMap()
wm.deleteAll()

const weakMapEmplace = new WeakMap([['a', 2]])
weakMapEmplace.emplace('a', { update: it => it ** 2, insert: () => 3})

/**
 * ## WeakSet
 *
 * ✅ / Stage 1 proposal /
 * - esnext.weak-set.add-all
 * - esnext.weak-set.delete-all
 * - esnext.weak-set.from
 * - esnext.weak-set.of
 */
const ws = new WeakSet()
ws.addAll()
