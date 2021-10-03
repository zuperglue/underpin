# underpin

Utilities for **node.js** applications (version >=12). Mainly inspired by lodash but 
tries to be leaner on memory. API is monolitic, immutable and may/will change without notice until 1.0.0.

If you are building applications for a browser, this is **not** for you. Try lodash or underscore, they are excellent.

## Install
```
> npm i underpin
```

In node.js
```javascript
// Main API
var _ = require('underpin')

// Functional variant
var _ = require('underpin/fp')
```


If you want to avoid e.g. "_" prefix, you can load individual functions. 
Still a monolitic API so it may not impact memory much, 
and you must manage potential name conflicts.

```javascript
const {toString:toStr, map, filter} = require('underpin/fp')
```
