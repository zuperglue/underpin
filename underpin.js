"use strict";
const {isDeepStrictEqual} = require('util');

const api = (v) => {
  const state = {value: v}
  const chain = getChainedFunctions('dummy', state);
  chain.value = () => {
    return state.value
  } // TODO: fix state so we can freeze chain...
  return chain
}
api.VERSION = require('./package.json').version;

/* Lang ************************************** */
api.castArray = (...a) => api.isArray(a[0]) ? a[0] : api.isSet(a[0]) ? [...a[0]] : (a.length == 0) ? [] : [a[0]]
api.isType = (name) => (obj => Object.prototype.toString.call(obj) === '[object ' + name + ']')
api.isArray = (o) => Array.isArray(o)
api.isBoolean = (b) => b === true || b === false || api.isType('Boolean')(b)
api.isBuffer = (o) => Buffer.isBuffer(o)
api.isEqual = (o1,o2) => isDeepStrictEqual(o1,o2)
api.isFunction = (o) => typeof o === 'function'
api.isInteger = (o) => Number.isInteger(o)
api.isObject = (o) => {
  const type = typeof o;
  return o != null && (type === 'object' || type === 'function')
}
api.isString = (s) => (typeof s === 'string' || s instanceof String)
api.isNumber = api.isType('Number')
api.isDate = api.isType('Date')
api.isError = api.isType('Error')
api.isPlainObject = (o) => api.isObject(o) && (Reflect.getPrototypeOf(o) === Object.prototype || isNullPrototype(o))
api.isRegExp = api.isType('RegExp')
api.isSymbol = api.isType('Symbol')
api.isSet = api.isType('Set')
api.isMap = api.isType('Map')
api.isMatch = (o, src) => api.matches(src)(o)
api.conformsTo = api.isMatch //alias to isMatch
api.isArrayLike = (o) => o != null && typeof o !== 'function' && api.isLength(o.length) // Exploit: should test isArr or isStr???
api.isNaN = (v) =>  Number.isNaN(v)
api.isNil = (o) => o === undefined || o === null
api.isNull = (o) => o === null
api.isIterable = (o) => o != null && typeof o[Symbol.iterator] === 'function'
api.isLength = (len) => typeof len === 'number' && len > -1 && len % 1 == 0 && len <= Number.MAX_SAFE_INTEGER
api.isEmpty = (o) => !api.size(o)
api.isUndefined = (o) => o === undefined
api.toArray = (o) => {
  //if (api.isArray(o)) return api.concat(o)  // make copy as Lodash?
  if (api.isArray(o)) return o  // or passthrough?
  if (api.isString(o)) return o.split('')
  if (api.isSet(o)) return [...o]
  if (api.isObject(o)) return Object.values(o)
  return []
}
api.toString = (o) => {
  if (api.isNil(o)) return ''
  if (api.isString(o)) return o
  if (isNullPrototype(o)) return '[Object: null prototype]'
  return o + ''
}
api.toNumber = (v) => (typeof v == 'number') ? v : +v;
api.toInteger = (v) => {
  if (api.isNil(v)) return 0
  if (v === Infinity) return Number.MAX_VALUE // Should be Number.MAX_SAFE_INTEGER
  if (v === -Infinity) return Number.MIN_SAFE_INTEGER // Lodash return different but not Number.MIN_VALUE
  if (api.isNaN(api.toNumber(v))) return 0
  return Math.floor(v)
}
api.eq = (v1, v2) => v1 === v2 || (v1 !== v1 && v2 !== v2) // NaN, NaN => true
api.gt = (v1, v2) => v1 > v2
api.gte = (v1, v2) => isStrings(v1, v2) ? api.toNumber(v1) >= api.toNumber(v2) : v1 >= v2  // Object is string?
api.lt = (v1, v2) => v1 < v2
api.lte = (v1, v2) => isStrings(v1, v2) ? api.toNumber(v1) <= api.toNumber(v2) : v1 <= v2  // Object is string?

/* Array ************************************/
api.chunk = (a, size = 1) => {
  if (!api.isNumber(size) || size < 1 ) return []
  const arr = api.toArray(a)
  const n = Math.ceil(arr.length / size)
  const res = Array(n);
  for (let i = 0; i < n; i++) res[i] = arr.slice((i*size), (i*size+size))
  return res
}
api.concat = (a, ...rest) => api.isArray(a) ? a.concat(...rest) : api.castArray(a).concat(...rest)
api.compact = (a) => api.isArrayLike(a) ? api.toArray(a).reduce( (acc, v) => (!v) ? acc : api.push(acc,v), []) : []
api.difference = (a1,a2) => {
  const set = toSet(api.isArray(a2) ? a2 :[]);
  return (api.isArray(a1) ? a1 :[]).filter( v => !set.has(v))
}
api.drop = (arr, n = 1) => api.slice(arr,n)
api.dropWhile = (a, p) => {
  if (!p) return [];
  const arr = api.toArray(a);
  return arr.slice(countWhile(arr,p))
}
api.flatten = (a) => api.isArrayLike(a) ? api.toArray(a).flat() : []
api.fromPairs = (a) => api.toArray(a).reduce((obj, p) => api.tap(obj, (o)=> o[p[0]] = p[1]),{})
api.head = (a) => api.isArrayLike(a) ? api.toArray(a)[0] : undefined
api.first = api.head
api.intersection = (a1,a2) => {
  const set = toSet(a2);
  return (a2) ? api.toArray(a1).filter( v => set.has(v)) : api.toArray(a1)
}
api.join = (a, c = ',') => api.toArray(a).join(c);
api.last = (a) => {
  if (!api.isArrayLike(a)) return undefined
  const arr = api.toArray(a)
  return arr[arr.length-1]
}
api.reverse = (a) => {
  if (api.isArray(a)) return a.reverse()
  if (api.isString(a)) return api.join(api.toArray(a).reverse(),'')
  return a
}
api.slice = (a, from, until) => api.toArray(a).slice(from, until);
api.tail = (a) => api.slice(a,1);
api.union = (a1,a2) => api.uniq(api.concat(api.toArray(a1),api.toArray(a2)))
api.uniq = (a) => [...toSet(a)]
api.xor = (a1,a2) => api.concat(api.difference(a1,a2), api.difference(a2,a1))
api.zipObject = (a1,a2) => {
  const a2Arr = api.toArray(a2)
  return api.toArray(a1).reduce((o,k,i) => {
    if (isUnsafeKey(k)) return o;
    o[k] = a2Arr[i];
    return o
  }, {})
}

/* Collection ********************************/
api.forEach = (a, f) => {
  if (!api.isFunction(f)) return a;
  if (api.isArrayLike(a)) { api.toArray(a).forEach((v,i)=>f(v,i,a)); return a }
  if (api.isSet(a)) { const aSet = api.toArray(a);  aSet.forEach((v,i)=>f(v,i, aSet)); return a }
  if (api.isObject(a)) { api.keys(a).forEach((k)=>f(a[k],k,a)); return a }
  return a
}
api.filter = (a,f) => api.toArray(a).filter(api.iteratee(f))
api.find = (a,f) => api.toArray(a).find(api.iteratee(f))
api.groupBy = (a, f) => api.reduce(api.toArray(a), (o,v) => {
  const k = api.iteratee(f)(v)
  api.isArray(o[k]) ? o[k].push(v) : o[k] = [v];
  return o
}, {})
api.includes = (a, v) => {
  if (api.isArrayLike(a) ) return a.includes(v)
  if (api.isSet(a)) return a.has(v)
  if (api.isObject(a)) return api.toArray(a).includes(v)
  return false
}
api.map = (a, f) => {
  if (api.isArrayLike(a)) return api.toArray(a).map(api.iteratee(f))
  if (api.isObject(a)) return api.values(api.mapValues(a, api.iteratee(f)))
  return []
}
api.orderBy = (a, ...args) => api.sortBy(a, ...args )
api.reduce = (a, f, init) => {
  if (api.isArray(a) || api.isSet(a)) return api.toArray(a).reduce(api.iteratee(f), init)
  if (api.isString(a)) return api.toArray(a).reduce((acc,char,i)=> api.iteratee(f)(acc,char,i,a), init)
  if (api.isObject(a)) return api.keys(a).reduce((acc,key)=> api.iteratee(f)(acc,a[key],key,a), init)
  return init
}
api.reject = (a,f) => api.toArray(a).filter(api.negate(api.iteratee(f)))
api.size = (a) => {
  if (api.isArrayLike(a)) return a.length
  if (api.isSet(a) || api.isMap(a)) return a.size
  if (api.isObject(a)) return api.keys(a).length
  return 0
}
api.sortBy = (a, ...args) => api.isArray(a) ? api.concat(a).sort(api.by(...args)) : []

/* Date **************************************/
api.hours = (len = 1) => {
  const d = new Date();
  const h =  Math.max(1, Math.min(24, api.toInteger(len)))
  d.setHours(Math.floor(d.getHours() / h) * h, 0, 0, 0);
  return api.toEpoch(d)
}
api.isToday = (d) => {
  const e = api.toEpoch(d);
  return  (e >= api.today() && e < api.tomorrow())
}
api.minutes = (len = 1) => {
  const d = new Date();
  const m =  Math.max(1, Math.min(60, api.toInteger(len)))
  d.setHours(d.getHours(), Math.floor(d.getMinutes() / m ) * m, 0, 0);
  return api.toEpoch(d)
}
api.now = () => Date.now()
api.toDate = (...args) => {
  const d = args[0]
  if (api.isDate(d)) return d;
  if (api.toLower(d) == 'today') return new Date(api.today())
  if (api.toLower(d) == 'now') return new Date(api.now())  // dangerous tets, clock may have had tome to tick
  if (api.toLower(d) == 'tomorrow') return new Date(api.tomorrow())
  const date = (args.length === 0) ? new Date() : new Date(...args)
  return (api.isNaN(date.valueOf())) ? new InvalidDate(date) : date
}
api.toEpoch = (d) => Number(api.toDate(d))
api.today = () => new Date().setHours(0,0,0,0)  //TODO: setHours vs setUTCHours must be defined
api.toISOString = (d) => api.toDate(d).toISOString()
api.tomorrow = () => api.today() + 24 * 3600 * 1000

/* Function **********************************/
api.negate = (predicate) => (...args) => !( api.isFunction(predicate) ? predicate(...args): api.identity(...args) )
api.memoize = (f, resolver, maxCacheSize = Math.pow(2, 24)) => {
  const cache = new Map()
  const cacheKey = api.isFunction(resolver) ? resolver : api.identity
  return (...args) => {
    const key = cacheKey(...args)
    let value = cache.get(key);
    if (value === undefined && !cache.has(key)) {
      if (cache.size >= maxCacheSize) cache.clear()
      value = f(...args)
      if (api.isPromise(value)) {
        return new Promise((resolve, reject) => {
          Promise.resolve(value)
            .then(v=> {cache.set(key, Promise.resolve(v)); resolve(v)})
            .catch(reject)
        })
      }
      cache.set(key, value);
    }
    return value;
  }
}

/* Math **************************************/
api.max = (a) => {
  if (!api.isArrayLike(a) || api.isEmpty(a)) return undefined
  return api.reduce(a, (v1, v2) => api.compareValues(v1,v2, true) <= 0 ? v1 : v2)
}
api.maxBy = (a, src) => {
  if (!api.isArrayLike(a) || api.isEmpty(a)) return undefined
  return api.reduce(a, (v1, v2) => api.compareValues(api.iteratee(src)(v1), api.iteratee(src)(v2), true) <= 0 ? v1 : v2)
}
api.mean = (a) => (!api.isArrayLike(a) || api.isEmpty(a)) ? NaN : (api.sum(a) / a.length)
api.meanBy = (a, src) => api.mean(api.map(a, src))
api.min = (a) => {
  if (!api.isArrayLike(a) || api.isEmpty(a)) return undefined
  return api.reduce(a, (v1, v2) => api.compareValues(v1,v2, false) <= 0 ? v1 : v2)
}
api.minBy = (a, src) => {
  if (!api.isArrayLike(a) || api.isEmpty(a)) return undefined
  return api.reduce(a, (v1, v2) => api.compareValues(api.iteratee(src)(v1), api.iteratee(src)(v2), false) <= 0 ? v1 : v2)
}
api.sum = (a) => {
  if (!api.isArrayLike(a) || api.isEmpty(a)) return 0
  return api.reduce(a, (sum, v) => (v === undefined) ? sum : ((sum === undefined)? v : sum+v) , undefined)
}
api.sumBy = (a, src) => api.sum(api.map(a, src))

/* Number ************************************/
api.inRange = (number, start, end) => {
  const n = api.toNumber(number);
  if (!api.isNumber(n) || api.isNil(start)) return false;
  return (api.isNil(end)) ? (n >= 0 && n < start) :
    (end < start) ? (n >= end && n < start) :
    (n >= start && n < end)
}

/* Object ************************************/
api.assign = (...objects) => {
  if (api.isNil(objects)) return {};
  const result = {};
  api.castArray(objects).forEach((o) => {
    if (!api.isObject(o)) return
    const keys = api.keys(o)
    if (hasUnsafeKeys(keys)) {
      // Slow copy to avoid potential "evil"...
      keys.forEach( (key)=> {
        if (isUnsafeKey(key)) return
        Object.assign(result, {[key]: o[key]})
      })
    } else {
      Object.assign(result, o)
    }
  })
  return result;
}
api.get = (o, p) => {
  if (api.isNil(p) || api.isNil(o)) return undefined
  return hasDotOrArrayStartOrEnd(p) ? api.toPath(p).reduce((a, v) => a ? a[v] : a , o ) : o[p]
}
api.has = (o, p) => {
  if (api.isNil(p) || api.isNil(o) || isNullPrototype(o)) return false
  if ( hasDotOrArrayStartOrEnd(p) ) {
    return !!(api.toPath(p).reduce((a, v) => !hasProperty(a, v) ? false : api.isObject(a[v]) ? a[v] : true, o)) // can be optimized
  } else {
    return o.hasOwnProperty(p)
  }
}
api.keys = (o) => api.isString(o)? api.range(o.length).map(v=> api.toString(v)): api.isObject(o) ? Object.keys(o) : []
api.keysIn = (o) => api.tap([], (keys) => {
  for (let key in o) keys.push(key)
})
api.mapKeys = (o, f) => {
  return api.reduce(api.keys(o), (obj,k)=> {
    const value = o[k]
    const key = api.isFunction(f) ? f(k, value, o) || k : api.isObject(f) ? api.result(f, k, k) || k : k
    return isUnsafeKey(key) ? Object.assign(obj, { [k]: value } ) : Object.assign(obj, { [key]: value } )
  }, {})
}
api.mapValues = (o, f) => {
  return api.reduce(api.keys(o), (obj,k,i)=> {
    const v = o[k]
    const value = api.isFunction(f) ? f(v ,k, o) :
      api.isString(f) ? api.get(v, f) :
      api.isObject(f) ? api.result(f, k, v) :
      v
    return isUnsafeKey(k) ? obj :  Object.assign(obj, { [k]: value } )
  }, {})
}
api.pick = (o, a0, ...args) => {
  if (api.isNil(o) || api.isFunction(o) || api.isArray(o)) return {}
  const keys = api.isArray(a0) ? a0 : [a0, ...args]
  const result = {}
  keys.forEach(key => api.set(result, key, api.get(o,key)))
  return result;
}
api.pickBy = (o, f ) => {
  const predicate = api.isFunction(f) ? f : api.identity
  return api.reduce(api.keys(o), (a,k) => {
    return predicate(o[k],k) ? api.set(a, k, api.get(o,k)) : a
  }, {})
}
api.result = (o, p, def) => {
  const v = api.get(o,p);
  return api.isFunction(v) ? v(def) : (v !== undefined) ? v: api.isFunction(def) ? def(v) : def;
}
api.set = (o , p , v) => {
  if (api.isNil(o)) return o
  api.toPath(p).reduce((obj, prop, index, path) => {
    if (isUnsafeKey(prop)) return undefined
    if (index === (path.length - 1)) return obj[prop] = v  // end of path, set value
    if (api.has(obj, prop) && (api.isObject(obj[prop]) || api.isArray(obj[prop]))) return obj[prop]  // already has arr or obj on this path, return prop
    return api.isNaN(api.toNumber(path[index + 1])) ? obj[prop]={} : obj[prop]=[] // look ahead to know if to create object or array
  } , o)
  return o
}
api.toPairs = (o) => api.keys(o).map( (k, i) => [k, o[k]]);
api.toPairsIn = (o) => api.keysIn(o).map( (k, i) => [k, o[k]]);
api.toPlainObject = (o) => api.fromPairs(api.toPairsIn(o))
api.values = (o) => api.toArray(o)
api.valuesIn = (o) => api.keysIn(o).map((k) => o[k])

/* Seq ***************************************/
api.tap = (v, f) => { if (api.isFunction(f)) f(v) ; return v }  // lodash dose not test if is func before calling, why crash?
api.thru = (v, f) => api.isFunction(f) ? f(v) : undefined       // lodash dose not test if is func before calling, why crash?

/* String ************************************/
api.endsWith = (s, t) => api.toString(s).endsWith(t);
api.lowerFirst = (s) => api.toArray(api.toString(s)).map((c,i)=> (i === 0) ? api.toLower(c): c ).join('')
api.padStart = (s, n, c = ' ') => api.toString(s).padStart(n ,c);
api.padEnd = (s, n, c = ' ') => api.toString(s).padEnd(n,c);
api.repeat = (s, n) => api.toString(s).repeat( (n < 0 || n  === Infinity || api.isNaN(n)) ? 0 : n);
api.replace = (s, f, t) => api.isNil(s)  ? '' : (!t && t !== '') ? s : api.toString(s).replace(f,t)
api.split = (s, splitter) => {
  if (api.isNil(s) || isNullPrototype(s)) return [];
  if (api.isString(splitter)) return api.toString(s).split(splitter);
  if (api.isArray(splitter)) {
    let res = [api.toString(s)]
    splitter.forEach((separator,i,arr) => {
      res = res.map((str)=> api.isString(str) && api.isString(separator) ? str.split(separator): str )
      res = api.flatten(res)
    })
    return res;
  }
  return [s];
}
api.startsWith = (s, t) => api.toString(s).startsWith(t);
api.toLower = (s) => api.toString(s).toLowerCase();
api.toUpper = (s) => api.toString(s).toUpperCase();
api.trim = (s, e) => (!e) ? api.toString(s).trim(e) : api.trimStart(api.trimEnd(s,e),e)
api.trimEnd = (s, e) => {
  if (!e) return api.toString(s).trimEnd(e)
  const exclude = api.toArray(e)
  const str = api.toString(s)
  let i = str.length
  while ((i > 0) && exclude.includes(str[i-1])) i--
  return str.slice(0, i)
}
api.trimStart = (s, e) => {
  if (!e) return api.toString(s).trimStart(e)
  const exclude = api.toArray(e)
  const str = api.toString(s)
  const n = str.length
  let i = 0
  while ((i < n) && exclude.includes(str[i])) i++
  return str.slice(i)
}
api.upperFirst = (s) => api.toArray(api.toString(s)).map((c,i)=> (i === 0) ? api.toUpper(c): c ).join('')

/* Util **************************************/
api.defaultTo = (v, defaultValue) => (v == null || v !== v) ? defaultValue : v;
api.flow = (...funcs) => {
  const chain = api.flatten(funcs)//.filter(isFunc)
  api.forEach(chain, (f) => { if (!api.isFunction(f)) throw new Error('Expected a function') })
  return (...args) => {
    if (api.isEmpty(chain)) return args[0]
    return chain.reduce( (arg, f) => {
      let result = f.apply(undefined, arg)
      return [result]
    }, args)[0]  // final result from reduce is array, return element 0
  }
}
api.identity = (o) => o
api.iteratee = (o) => {
  return api.isFunction(o) ? o :
    (api.isString(o) || api.isNumber(o)) ? api.property(o) :
    api.isArray(o) ? api.matchesProperty(o[0], o[1]) :
    api.isObject(o) ? api.matches(o) :
    api.identity
}
api.noop = (o) => undefined
api.matches = (spec = {}) => o => {
  if (api.isNil(o)) return false;
  const keys = api.keys(spec);
  for (let i = 0; i < keys.length; i++) {
    if (!api.matchesProperty(keys[i],spec[keys[i]])(o)) return false;
  }
  return true;
}
api.conforms = api.matches
api.matchesProperty = (p,src) => (o) => {
  if (!api.has(o,p)) return false
  if (api.isFunction(src)) return !!(src(api.get(o,p)))
  if (api.isRegExp(src)) return src.test(api.get(o,p))
  return api.isEqual(src, api.get(o,p))
}
api.property = (s) => (o) => api.get(o,s)
api.range = (start, end, step) => {
  if (start && !api.isNumber(start)) return []
  let _start  = api.isNumber(end) ? api.defaultTo(start,0): 0
  const _end  = api.isNumber(end) ? api.defaultTo(end,0): api.defaultTo(start,0)
  const _step = api.isNumber(step) ? api.defaultTo(step,0): 1
  const n = Math.max( Math.ceil((_end - _start) / (_step || 1)), 0)
  const arr = Array(n);
  for (let i = 0; i < n; i++ ) {
    arr[i] = _start;
    _start += _step;
  }
  return arr
}
api.toPath = api.memoize( (s) => {
  if (api.isNil(s) ) return []
  if (api.isArray(s)) return s.map(api.toString)
  return hasArrayStartOrEnd(s) ? api.compact(api.split(api.replace(api.replace(s, /\[/g , '.') , /]/g , ''),'.' )) :
    api.isString(s) ? s.split('.') :
    api.split(s,'.')
}, undefined, 50)  // will clear map when size >= X, to prevent memory build up. Its only a cache !!!
api.over = (...funcs) => {
  return (...args) => api.toArray( api.isArray(funcs[0]) ? funcs[0] : [...funcs] ).map((f) => api.iteratee(f)(...args))
}
api.overEvery = (...predicates) => {
  return (...args) => {
    const predicateArr = api.isArray(predicates[0]) ? predicates[0] : [...predicates]
    for (let i = 0; i < predicateArr.length; i++) {
      const f = api.isFunction(predicateArr[i]) ? predicateArr[i] : api.identity;
      if (!f.call(undefined, ...args)) return false;
    }
    return true
  }
}
api.overSome = (...predicates) => {
  return (...args) => {
    const predicateArr = api.isArray(predicates[0]) ? predicates[0] : [...predicates]
    for (let i = 0; i < predicateArr.length; i++) {
      const f = api.isFunction(predicateArr[i]) ? predicateArr[i] : api.identity;
      if (f.call(undefined, ...args) == true) return true;
    }
    return false
  }
}

/* Additions **************************************/
api.push = (a,v) => api.tap((api.isArray(a) ? a : api.toArray(a)), (arr) => arr.push(v))
api.by = (arg, ...args) => {
  const source = (args.length === 0) ? arg :
    api.isString(arg) ? [arg, ...args] :
    api.isEmpty(arg) && api.isArray(args[0]) ? (api.toLower(args[0][0]) === 'desc' ? true : false) :
    api.isArray(arg) && api.isArray(args[0]) ? api.zipObject(arg, args[0]) :
    undefined
  return (v1,v2) => {
    return (!source) ?  api.compareValues(v1, v2) :
      api.isBoolean(source) ? api.compareValues(v1, v2, source) :
      api.isString(source) ? compareProperty(v1, v2, source) :
      api.isArray(source) ? compareProperty(v1, v2, propertyWhereValueNotEq(source, v1,v2) ) :
      api.isFunction(source) ? compareUsingGetter(v1, v2, source) :
      api.isObject(source) ? compareWithSource(v1,v2, source) :
      0;
  }
}
api.compareValues = (v1,v2, descending = false) => {
  // If eq return quick. Will not match NaN === NaN...
  if (v1 === v2) return 0;  //
  // null < undefined or NaN (null always before undefined or NaN)
  if ( (v1 === null ) && (v2 === undefined || api.isNaN(v2)) ) return -1;
  if ( (v1 === undefined || api.isNaN(v1))  && (v2 === null) ) return 1;
  // real values < undefined, null or NaN (values always before)
  if ( !(api.isNil(v1) || api.isNaN(v1)) && (api.isNil(v2) || api.isNaN(v2)) ) return -1;
  if ( (api.isNil(v1) || api.isNaN(v1) ) && !(api.isNil(v2) || api.isNaN(v2)) ) return 1;
  // Classify real values
  v1 = (api.isNumber(v1) && !api.isNumber(v2)) ? api.toString(v1) : v1;
  v2 = (api.isNumber(v2) && !api.isNumber(v1)) ? api.toString(v2) : v2;
  if (descending) {
    // Desc values
    if ( v1 > v2 ) return -1;
    if ( v1 < v2 ) return 1;
  } else {
    // Ascending values = default
    if ( v1 < v2 ) return -1;
    if ( v1 > v2 ) return 1;
  }
  return 0; // E.g  NaN === NaN...
}
api.isPromise = (p) => api.isNil(p) ? false : api.isFunction((p)['then'])
api.curate = (o, p, ...funcs) => api.flow(...funcs)(api.get(o,p))
api.falsyTo = (v,to)  => (!v) ? to : v
api.undefinedTo = (v,to)  => api.isUndefined(v) ? to : v
api.nilTo = (v,to)  => api.isNil(v) ? to : v
api.toJSON = (j,intend = 0) => JSON.stringify(j, null,intend )
api.parseJSON = (j) => {
  if (api.isUndefined(j)) return undefined
  const data = JSON.parse(j)  // will throw if invalid JSON
  if (api.isArrayLike(data)) return data;  // Array and string
  if (api.isObject(data)) {
    const keys = api.keys(data);
    if (hasUnsafeKeys(keys)) throw new Error('Unsafe JSON object')
  }
  return data;
}
api.rejectIfNil = (v,msg) => api.isNil(v) ? Promise.reject(msg) : v
api.argsToCacheKey = (...args) => args.reduce((key, v) => key +api.trim(api.toJSON(v),'"'),'')

//* Internals **************************************/

const isUnsafeKey = (key) => (key === '__proto__' || key === 'constructor')
const hasUnsafeKeys = (keys) => keys.includes('__proto__') || keys.includes('constructor')

class InvalidDate extends Date {
  toISOString() { return '' }
}
/*
const tryCatch = (f, ...args) => {
  try { return f( ...args) } catch (e) { return undefined}
}
 */
const hasDotOrArrayStartOrEnd = (s) => {
  if (!api.isString(s)) return false;
  for (let i = 0; i < s.length; i++) if (s.charAt(i) === '.' || s.charAt(i) === '[' || s.charAt(i) === ']') return true;
  return false;
}
const hasArrayStartOrEnd = (s) => {
  if (!api.isString(s)) return false;
  for (let i = 0; i < s.length; i++) if (s.charAt(i) === '[' || s.charAt(i) === ']') return true;
  return false;
}
const toSet = (a) => new Set(api.toArray(a))
const isNullPrototype = (o) => (o && Object.getPrototypeOf(o) === null)
const hasProperty = (o, p) => !api.isNil(o) ? o.hasOwnProperty(p) : false
const isStrings = (s1,s2) => (!(typeof s1 == 'string' && typeof s2 == 'string'))
const compareWithSource = (v1, v2, source) => {
  const prop = propertyWhereValueNotEq(api.keys(source), v1,v2) ;
  const order = !!(api.toLower(source[prop]) === 'desc')
  return compareProperty(v1, v2, prop, order)
}
const compareProperty = (o1, o2, prop, descending = false) => {
  return api.compareValues( api.get(o1,prop) , api.get(o2,prop) , descending)
}
const compareUsingGetter = (data1, data2, f, o, descending = false) => {
  return api.compareValues( f.apply(null, [data1, o]) , f.apply(null, [data2, o]) , descending)
}
const propertyWhereValueNotEq = (propertyNames, obj1, obj2) => {
  return propertyNames.find( prop => (api.get(obj1, prop)) != api.get(obj2, prop))
}
const countWhile = (a, p) => {
  if (!api.isArrayLike(a)) return undefined;
  const predicate = api.isFunction(p) ? p : noop;
  let i = 0;
  while( (i < a.length) && predicate(a[i],i,a)) i++;
  return i
}

const getChainedFunctions = api.memoize((dummy, state) => {
  const chain = {};
  Object.keys(api).forEach(name => chain[name] = (...args) => {
    state.value = api[name](state.value, ...args);
    return chain
  })
  return chain
}, null, 1)

module.exports = Object.freeze(api)