# underpin

## API

| | underpin      | underpin / fp |
| ----------- | ----------- | ----------- |
| <br><br>:black_small_square: | <br><br>**Array** <br> |
| | _.chunk(array, [size=1]) |_.chunk(size)(array) <br> _.chunk(array, size) |
| | _.compact(array) | _.compact(array)|
| | _.concat(array, [values]) | _.concat(values)(array) <br> _.concat(array, values)  |
| | _.difference(array, [values]) | _.difference(values)(array) <br>  _.difference(array,values) |
| | _.drop(array, [n=1]) | _.drop(n)(array) <br> _.drop(array, n) |
| | _.dropWhile(array, [predicate= _.identity]) | _.dropWhile(predicate)(array) <br> _.dropWhile(array, predicate) |
| | _.first(array) | _.first(array) |
| | _.flatten(array) | _.flatten(array) |
| | _.fromPairs(pairs) | _.fromPairs(pairs) |
| | _.head(array) | _.head(array) |
| | _.intersection([array1],[array2]) | _.intersection(array2)(array1) <br> _.intersection(array1, array2)|
| | _.join(array, [separator=',']) | _.join(separator)(array) <br>  _.join(array, separator) |
| | _.last(array) | _.last(array) |
| | _.reverse(array) | _.reverse(array) |
| | _.slice(array, [start=0], [end=array.length]) | _.slice(length)(start)(array) <br> _.slice(start, length)(array) <br> _.slice(array, start, length) |
| | _.tail(array) | _.tail(array) |
| | _.union([array1],[array2]) | _.union(array2)(array1) <br> _.union(array1, array2)|
| | _.uniq(array) | _.uniq(array) |
| | _.xor([array1],[array2]) | _.xor(array2)(array1) <br> _.xor(array1, array2)|
| | _.zipObject([props=[]], [values=[]]) | _.zipObject(values)(props) <br> _.zipObject(props, values)|
|  |
| <br><br>:black_small_square: | <br><br> **Collection** <br> | |
| | filter(collection, [iteratee= _.identity]) | filter(iteratee)(collection) <br> filter(collection, iteratee)|
| | find(collection, [iteratee= _.identity], <s>[fromIndex=0]</s>) | find(iteratee)(collection) <br> find(collection, iteratee)|
| | forEach(collection, [iteratee= _.identity]) | forEach(iteratee)(collection) <br> forEach(collection, iteratee)|
| | groupBy(collection, [iteratee= _.identity]) | groupBy(iteratee)(collection) <br> groupBy(collection, iteratee)|
| | includes(collection, value, <s>[fromIndex=0]</s>)  | includes(value)(collection) <br> includes(collection, value)|
| | map(collection, [iteratee= _.identity]) | map(iteratee)(collection) <br> map(collection, iteratee) |
| | orderBy(collection, [iteratees=[ _.identity ]], [orders]) | orderBy(iteratees)(collection) <br>  orderBy(collection, iteratees, orders) |
| | reduce(collection, [iteratee= _.identity], [accumulator]) | reduce(accumulator)(iteratee)(collection) <br>  reduce(iteratee, accumulator)(collection) <br> reduce(collection, iteratee, accumulator) |
| | reject(collection, [iteratee= _.identity ]) | reject(iteratee)(collection) <br> reject(collection, iteratee) |
| | size(collection) | size(collection) |
| | sortBy(collection, [iteratees=[ _.identity]]) | sortBy(iteratees)(collection) <br> sortBy(collection, iteratees) |
| <br><br>:black_small_square: | <br><br> **Date** | |
| | now() | now() |
