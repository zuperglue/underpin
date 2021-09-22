# underpin

## API

| underpin      | underpin / fp |
| ----------- | ----------- |
| <br><br>**Array** <br> |
| _.chunk(array, [size=1]) |_.chunk(size)(array) <br> _.chunk(array, size) |
| _.compact(array) | _.compact(array)|
| _.concat(array, [values]) | _.concat(values)(array) <br> _.concat(array, values)  |
| _.difference(array, [values]) | _.difference(values)(array) <br>  _.difference(array,values) |
| _.drop(array, [n=1]) | _.drop(n)(array) <br> _.drop(array, n) |
| _.dropWhile(array, [predicate= _.identity]) | _.dropWhile(predicate)(array) <br> _.dropWhile(array, predicate) |
| _.first(array) | _.first(array) |
| _.flatten(array) | _.flatten(array) |
| _.fromPairs(pairs) | _.fromPairs(pairs) |
| _.head(array) | _.head(array) |
| _.intersection([array1],[array2]) | _.intersection(array2)(array1) <br> _.intersection(array1, array2)|
| _.join(array, [separator=',']) | _.join(separator)(array) <br>  _.join(array, separator) |
| _.last(array) | _.last(array) |
| _.reverse(array) | _.reverse(array) |
| _.slice(array, [start=0], [end=array.length]) | _.slice(length)(start)(array) <br> _.slice(start, length)(array) <br> _.slice(array, start, length) |
| _.tail(array) | _.tail(array) |
| _.union([array1],[array2]) | _.union(array2)(array1) <br> _.union(array1, array2)|
| _.uniq(array) | _.uniq(array) |
| _.xor([array1],[array2]) | _.xor(array2)(array1) <br> _.xor(array1, array2)|
| _.zipObject([props=[]], [values=[]]) | _.zipObject(values)(props) <br> _.zipObject(props, values)|
|  |
| <br><br> **Collection** <br> | |
| _.filter(collection, [iteratee= _.identity]) | _.filter(iteratee)(collection) <br> _.filter(collection, iteratee)|
| _.find(collection, [iteratee= _.identity], <s>[fromIndex=0]</s>) | _.find(iteratee)(collection) <br>  _.find(collection, iteratee)|
| _.forEach(collection, [iteratee= _.identity]) | _.forEach(iteratee)(collection) <br> _.forEach(collection, iteratee)|
| _.groupBy(collection, [iteratee= _.identity]) | _.groupBy(iteratee)(collection) <br> _.groupBy(collection, iteratee)|
| _.includes(collection, value, <s>[fromIndex=0]</s>)  | _.includes(value)(collection) <br> _.includes(collection, value)|
| _.map(collection, [iteratee= _.identity]) | _.map(iteratee)(collection) <br> _.map(collection, iteratee) |
| _.orderBy(collection, [iteratees=[ _.identity ]], [orders]) | **_.orderBy(iteratees)(collection)** <br>  _.orderBy(collection, iteratees, orders) |
| _.reduce(collection, [iteratee= _.identity], [accumulator]) | _.reduce(accumulator)(iteratee)(collection) <br>  _.reduce(iteratee, accumulator)(collection) <br> _.reduce(collection, iteratee, accumulator) |
| _.reject(collection, [iteratee= _.identity ]) | _.reject(iteratee)(collection) <br> _.reject(collection, iteratee) |
| _.size(collection) | _.size(collection) |
| _.sortBy(collection, [iteratees=[ _.identity]]) | _.sortBy(iteratees)(collection) <br> _.sortBy(collection, iteratees) |
| <br><br> **Date** <br> | |
| :black_small_square: _.now() | _.now() |
