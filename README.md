# underpin

## API

| | underpin      | underpin / fp |
| ----------- | ----------- | ----------- |
| <br><br>:black_small_square: | <br><br>**Array** <br> |
| | chunk(array, [size=1]) | chunk(size)(array) <br> chunk(array, size) |
| | compact(array) | compact(array)|
| | concat(array, [values]) | concat(values)(array) <br> concat(array, values)  |
| | difference(array, [values]) | difference(values)(array) <br>  difference(array,values) |
| | drop(array, [n=1]) | drop(n)(array) <br> drop(array, n) |
| | dropWhile(array, [predicate=identity]) | dropWhile(predicate)(array) <br> _.dropWhile(array, predicate) |
| | first(array) | first(array) |
| | flatten(array) | flatten(array) |
| | fromPairs(pairs) | fromPairs(pairs) |
| | head(array) | head(array) |
| | intersection([array1],[array2]) | intersection(array2)(array1) <br> intersection(array1, array2)|
| | join(array, [separator=',']) | join(separator)(array) <br>  join(array, separator) |
| | last(array) | last(array) |
| | reverse(array) | reverse(array) |
| | slice(array, [start=0], [end=array.length]) | slice(length)(start)(array) <br> slice(start, length)(array) <br> _.slice(array, start, length) |
| | tail(array) | tail(array) |
| | union([array1],[array2]) | union(array2)(array1) <br> union(array1, array2)|
| | uniq(array) | uniq(array) |
| | xor([array1],[array2]) | xor(array2)(array1) <br> xor(array1, array2)|
| | zipObject([props=[]], [values=[]]) | zipObject(values)(props) <br> zipObject(props, values)|
|  |
| <br><br>:black_small_square: | <br><br> **Collection** <br> | |
| | filter(collection, [iteratee=identity]) | filter(iteratee)(collection) <br> filter(collection, iteratee)|
| | find(collection, [iteratee=identity], <s>[fromIndex=0]</s>) | find(iteratee)(collection) <br> find(collection, iteratee)|
| | forEach(collection, [iteratee=identity]) | forEach(iteratee)(collection) <br> forEach(collection, iteratee)|
| | groupBy(collection, [iteratee=identity]) | groupBy(iteratee)(collection) <br> groupBy(collection, iteratee)|
| | includes(collection, value, <s>[fromIndex=0]</s>)  | includes(value)(collection) <br> includes(collection, value)|
| | map(collection, [iteratee=identity]) | map(iteratee)(collection) <br> map(collection, iteratee) |
| | orderBy(collection, [iteratee=identity], [orders]) | orderBy(iteratees)(collection) <br>  orderBy(collection, iteratees, orders) |
| | reduce(collection, [iteratee=identity], [accumulator]) | reduce(accumulator)(iteratee)(collection) <br>  reduce(iteratee, accumulator)(collection) <br> reduce(collection, iteratee, accumulator) |
| | reject(collection, [iteratee=identity]) | reject(iteratee)(collection) <br> reject(collection, iteratee) |
| | size(collection) | size(collection) |
| | sortBy(collection, [iteratee=identity]) | sortBy(iteratees)(collection) <br> sortBy(collection, iteratees) |
| <br><br>:black_small_square: | <br><br> **Date** | |
| | now() | now() |
| <br><br>:black_small_square: | <br><br> **Function** | |
| | memoize(func, [resolver], [maxSize]) | memoize(func, [resolver], [maxSize]) |
| | negate(predicate) | negate(predicate) |
|  |
| <br><br>:black_small_square: | <br><br> **Lang** | |
| | [castArray(value)](https://lodash.com/docs/4.17.15#castArray) | castArray(value) |
| | [conformsTo(object, source)](https://lodash.com/docs/4.17.15#conformsTo) |  conformsTo(source)(object) <br> conformsTo(object, source) |
| | [eq(value, other)](https://lodash.com/docs/4.17.15#eq) | eq(other)(value) <br> eq(value, other) |
| | [gt(value, other)](https://lodash.com/docs/4.17.15#gt) | gt(other)(value) <br> gt(value, other) |
| | [gte(value, other)](https://lodash.com/docs/4.17.15#gte) | gte(other)(value) <br> gte(value, other) |
| | [isArray(value)](https://lodash.com/docs/4.17.15#isArray) | isArray(value) |
| | [isArrayLike(value)](https://lodash.com/docs/4.17.15#isArrayLike) | isArrayLike(value) |
| | [isBoolean(value)](https://lodash.com/docs/4.17.15#isBoolean) | isBoolean(value) |
| | [isBuffer(value)](https://lodash.com/docs/4.17.15#isBuffer) | isBuffer(value) |
| | [isDate(value)](https://lodash.com/docs/4.17.15#isDate) | isDate(value) |
| | [isEmpty(value)](https://lodash.com/docs/4.17.15#isEmpty) | isEmpty(value) |
| | [isEqual(value, other)](https://lodash.com/docs/4.17.15#isEqual) | isEqual(other)(value) <br> isEqual(value, other) |
| | [isError(value)](https://lodash.com/docs/4.17.15#isError) | isError(value) |
| | [isFunction(value)](https://lodash.com/docs/4.17.15#isFunction) | isFunction(value) |
| | [isInteger(value)](https://lodash.com/docs/4.17.15#isInteger) | isInteger(value) |

