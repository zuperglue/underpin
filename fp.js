"use strict";
const _ = require ('./underpin')

/**
 * @namespace _
 */

/**
 * Return stuff.
 * @function _
 * @static
 * @param {*} v - state stuff
 * @return {function} - returns value casted to array
 */
const api = (v) => {
  return _(v)
}

/*
  Curried to arity 2 => reverse argument order for partials
  fc = curry2(f)
  fc(arg1)(arg0)            => f(arg0, arg1)
  fc(arg0, arg1, ...args)   => f(arg0, arg1, ...args)
 */
const curry2Right = (func) => {
  return (...args) => {
    const [arg1] = args;
    switch (args.length) {
      case 0:
      case 1:
        return (arg0) => func.apply(undefined, [arg0, args[0]])
      default:
        return func.apply(undefined, args)
    }
  }
}

const curry2Left = (func) => {
  return (...args) => {
    switch (args.length) {
      case 0:
      case 1:
        return (arg1) => func.apply(undefined, [args[0], arg1])
      default:
        return func.apply(undefined, args)
    }
  }
}

/*
  Curried to arity 3  => reverse argument order for partials
  fc = curry3(f)
  fc(arg2)(arg1)(arg0)            => f(arg0, arg1, arg2)
  fc(arg1, arg2)(arg0)            => f(arg0, arg1, arg2)
  fc(arg0, arg1, arg2, ...args)   => f(arg0, arg1, arg2, ...args)
 */
const curry3Right = (func) => {
  return (...args) => {
    switch (args.length) {
      case 0:
      case 1:
        return (arg1) => (arg0) => func.apply(undefined, [arg0, arg1, args[0]])
      case 2:
        return (arg0) => func.apply(undefined, [arg0, args[0], args[1]])
      default:
        return func.apply(undefined, args)
    }
  }
}

const curryRight = (f, arity) => {
  switch (arity) {
    case 0:
    case 1:
      return f
    case 2:
      return curry2Right(f)
    default:
      return curry3Right(f)
  }
}

const curryLeft = (f, arity) => {
  switch (arity) {
    case 0:
    case 1:
      return f
    default:
      return curry2Left(f)
  }
}

let dummy = curryRight(null,0)
dummy = curryRight(null,1)
dummy = curryLeft(null,0)
dummy = curryLeft(null,1)

/* API mapping */
/**
 * @string VERSION
 * @memberof _
 */
api.VERSION = _.VERSION
/* Array ***************************************/
api.chunk = curryRight(_.chunk,2)
api.compact = _.compact
api.concat = curryRight(_.concat,2)
api.difference = curryRight(_.difference,2)
api.drop = curryRight(_.drop,2)
api.dropWhile = curryRight(_.dropWhile,2)              // Iteratee replace candidate
api.first = _.first
api.flatten = _.flatten
api.fromPairs = _.fromPairs
api.head = _.head
api.intersection = curryRight(_.intersection,2)       // limited to two arrays
api.join = curryRight(_.join,2)
api.last = _.last
api.remove = curryRight(_.remove,2)                   // Iteratee replace candidate
api.reverse = _.reverse
api.slice = curryRight(_.slice,3)
api.tail = _.tail
api.union = curryRight(_.union,2)
api.uniq = _.uniq
api.xor = curryRight(_.xor,2)
api.zipObject = curryRight(_.zipObject,2)

/* Collection ***************************************/
api.forEach = curryRight(_.forEach,2)
api.filter = curryRight(_.filter,2)                 // Iteratee replace candidate
api.find = curryRight(_.find,2 )                    // partials start at 0, Iteratee replace candidate
api.groupBy = curryRight(_.groupBy,2 )
api.includes = curryRight(_.includes,2)             // partials start at 0
api.map = curryRight(_.map,2)
api.orderBy = curryRight(_.orderBy,2)
api.reduce = curryRight(_.reduce,3)
api.discard = curryRight(_.discard,2)                 // Iteratee replace candidate
api.size = _.size
api.sortBy = curryRight(_.sortBy,2)

/* Date **************************************/
api.now = _.now

/* Function **************************************/
api.negate = _.negate
api.memoize = _.memoize

/* Lang **************************************/
/**
 * Cast value to Array.
 * @function _.castArray
 * @static
 * @param {*} a - value to cast
 * @return {array} - returns value casted to array
 */
api.castArray = _.castArray
api.conformsTo = curryRight(_.conformsTo,2)
api.eq = curryRight(_.eq,2)
api.gt = curryRight(_.gt,2)
api.gte = curryRight(_.gte,2)
api.isArray = _.isArray
api.isArrayLike = _.isArrayLike
api.isBoolean = _.isBoolean
api.isBuffer = _.isBuffer
api.isDate = _.isDate
api.isEmpty = _.isEmpty
api.isEqual = curryRight(_.isEqual,2)
api.isError = _.isError
api.isFunction = _.isFunction
api.isInteger = _.isInteger
api.isIterable = _.isIterable
api.isLength = _.isLength
api.isMap = _.isMap
api.isMatch = curryRight(_.isMatch,2)
api.isNaN = _.isNaN
api.isNil = _.isNil
api.isNull = _.isNull
api.isNumber = _.isNumber
api.isObject = _.isObject
api.isPlainObject = _.isPlainObject
api.isRegExp = _.isRegExp
api.isSet = _.isSet
/**
 * Checks if value is classified as a String primitive or object.
 * @function _.isString
 * @static
 * @param {*} s - value to test
 * @return {boolean} - returns true if value is string
 */
api.isString = _.isString
api.isSymbol = _.isSymbol
api.isUndefined = _.isUndefined
api.lt = curryRight(_.lt,2)
api.lte = curryRight(_.lte,2)
api.toArray = _.toArray
api.toInteger = _.toInteger
api.toNumber = _.toNumber
api.toPlainObject = _.toPlainObject
api.toString = _.toString

/* Math **************************************/
api.max = _.max
api.maxBy = curryRight(_.maxBy,2)
api.mean = _.mean
api.meanBy = curryRight(_.meanBy,2)
api.min = _.min
api.minBy = curryRight(_.minBy,2)
api.sum = _.sum
api.sumBy = curryRight(_.sumBy,2)

/* Number **************************************/
api.inRange = curryRight(_.inRange,3)

/* Object **************************************/
api.assign = curryLeft(_.assign,2)               // CURRY LEFT!!!! Partial only support 1 arg
api.get = curryRight(_.get,2)                      // No default
api.has = curryRight(_.has,2)
api.keys = _.keys
api.keysIn = _.keysIn
api.mapKeys = curryRight(_.mapKeys,2)
api.mapValues = curryRight(_.mapValues,2)
api.pick = curryRight(_.pick,2)
api.pickBy = curryRight(_.pickBy,2)
api.result = _.result                                 // NOT curried!!
api.set = curryRight(_.set,3)
api.toPairs = _.toPairs
api.toPairsIn = _.toPairsIn
api.values = _.values
api.valuesIn = _.valuesIn

/* Seq *****************************************/
api.tap = curryRight(_.tap,2)
api.thru = curryRight(_.thru,2)

/* String **************************************/
api.endsWith = curryRight(_.endsWith,2)             // always start at length-1
api.lowerFirst = _.lowerFirst
api.padEnd = curryRight(_.padEnd,3)
api.padStart = curryRight(_.padStart,3)
api.repeat = curryRight(_.repeat,2)
api.replace = curryRight(_.replace,3)
api.split = curryRight(_.split ,2)             // Replaced !!!
api.startsWith = curryRight(_.startsWith,2)         // Curried always start at pos 0
api.toLower = _.toLower
api.toUpper = _.toUpper
api.trim = curryRight(_.trim,2)
api.trimEnd = curryRight(_.trimEnd,2)
api.trimStart = curryRight(_.trimStart,2)
api.upperFirst = _.upperFirst

/* Util **************************************/
api.conforms = _.conforms
api.flow = _.flow
api.defaultTo = curryRight(_.defaultTo,2)
api.identity = _.identity
api.iteratee = _.iteratee                             // Candidate for replaced...
api.matches = _.matches
api.matchesProperty = _.matchesProperty               // NOT curried
api.noop = _.noop
api.over = _.over
api.overEvery = _.overEvery
api.overSome = _.overSome
api.property = _.property
api.range = _.range                                   // NOT curried
api.toPath = _.toPath

/* Additions **************************************/
api.by = _.by
api.compareValues = _.compareValues
api.push =  _.push
api.falsyTo = curryRight(_.falsyTo,2)
api.nilTo = curryRight(_.nilTo,2)
api.undefinedTo = curryRight(_.undefinedTo,2)
api.curate = curryRight(_.curate,3)
api.toISOString = _.toISOString
api.today = _.today
api.tomorrow = _.tomorrow
api.toEpoch = _.toEpoch
api.toJSON = _.toJSON
api.parseJSON = _.parseJSON
api.toDate = _.toDate
api.isToday = _.isToday
api.hours = _.hours
api.minutes = _.minutes
//api.resolve = _.resolve
api.reject = curryRight(_.reject,2)
api.rejectIfNil = curryRight(_.rejectIfNil,2)
api.rejectIfFalsy = curryRight(_.rejectIfFalsy,2)
api.isPromise =  _.isPromise
api.argsToCacheKey =  _.argsToCacheKey

Object.freeze(api)
module.exports = api
