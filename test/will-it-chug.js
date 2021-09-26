const chai = require('chai');
const expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const testPackageName = process.env.USE_PACKAGE || '../fp.js'
const isChugging = (
  testPackageName === '../underpin.js' ||
  testPackageName === '../fp.js'
);
const FP = (
  testPackageName === '../fp.js'
)

const instrument = () => {
  const m1 = process.memoryUsage();
  let max = {rss:0, heapTotal:0, heapUsed:0, external:0, arrayBuffers:0};
  return () => {
    const m2 = process.memoryUsage();
    if (m2.rss > max.rss) max.rss = m2.rss;
    if (m2.heapTotal > max.heapTotal) max.heapTotal = m2.heapTotal;
    if (m2.heapUsed > max.heapUsed) max.heapUsed = m2.heapUsed;
    if (m2.external > max.external) max.external = m2.external;
    if (m2.arrayBuffers > max.arrayBuffers) max.arrayBuffers = m2.arrayBuffers;
    console.log('CURRENT:')
    for (let key in m2) {
      console.log(`${key}: + ${Math.round((m2[key]-m1[key]) / 1024 / 1024 * 100) / 100} MB`);
    }
    console.log('MAX:')
    for (let key in max) {
      console.log(`${key}: + ${Math.round((max[key]-m1[key]) / 1024 / 1024 * 100) / 100} MB`);
    }
  }
}
const memory = instrument()
const t0 = Date.now()
const _ = require(testPackageName) // after we intrument memory
console.log('Loaded in (ms):', (Date.now()-t0))

const UNDEF_ARR = []
const UNDEF_INT = 0
const UNDEF_1 = 1


const arrStr = ['a', 'b', 'c']
const arrInt = _.range(1, arrStr.length + 1) // 1,2,3..
const set = new Set(arrInt)
const obj = {a:1, b:2, c:3}
const str = _.join(arrStr,'')
const boolFalse = false;
const boolTrue = true;
const func = arg => arg;
const int = 1;
const dec = 1.01;
const date = new Date()
const arrFalsy = [false, null, 0, '', undefined, NaN]
const largeArrSize = 200_000;
const arrIntLarge = _.range(0,largeArrSize)
const arrStrLarge = arrIntLarge.map(v => v.toString())
const objLarge = (FP) ? _.zipObject(arrIntLarge, arrStrLarge) : _.zipObject(arrStrLarge, arrIntLarge)
class clazz{}

const john = {name:'John', age:25, gender: 'male'}
const johnny  = {name:'Johnny', age:25, gender: 'male'}
const bill = {name:'Bill', age:52, gender: 'male'}
const jane = {name:'Jane', age:25, gender: 'female'}
const becky = {name:'Becky', age:52, gender: 'female'}
const fred = {name:'Fred', age:40, gender: 'male'}
const natas = {name:'Natas', age:undefined, gender: 'beast', features: {number: 666, color:'red', wings: true}}
const zlatan = {name:'Zlatan', age:undefined, gender: 'male', features: {number: 21, team:'AC Milan'}}

const people = [john, johnny, bill, fred, jane, becky]
const characters = [john, johnny, bill, fred, jane, becky, natas, zlatan]


describe( ('Will it chug? (' + testPackageName + ' ' +  _.VERSION + ')' ),  function ()  {

  afterEach(function() {
    //memory()
  });
  describe('_()',  function () {
    it("chain", function () {
      expect( _().value() ).to.be.eql(undefined);
      expect( _(null).value() ).to.be.eql(null);
      expect( _('a').value() ).to.be.eql('a');
      expect( _(1).value() ).to.be.eql(1);
      expect( _({a:1}).value() ).to.be.eql({a:1});
      expect( _([1,2,3]).value() ).to.be.eql([1,2,3]);
      expect( _(arrIntLarge).filter().map().filter().value() ).to.be.an('array');
      expect ( arrIntLarge.forEach( v => _(_.range(1,100)).filter().value() )).to.be.eql(undefined);

    })
  })

  describe('Lang',  function () {
    it("castArray",  function () {
      a = [1,2,3]
      expect( _.castArray(a) ).to.be.eq(a);
      expect( _.castArray('abc') ).to.be.eql(['abc']);
      expect( _.castArray(1) ).to.be.eql([1]);
      expect( _.castArray({a:1}) ).to.be.eql([{a:1}]);
      if (isChugging){
        expect( _.castArray(new Set([1,2,3])) ).to.be.eql([1,2,3]);
      }
      f = ()=>1
      expect( _.castArray(f ) ).to.be.eql([ f ]);
      expect( _.castArray(null) ).to.be.eql([null]);
      expect( _.castArray(undefined) ).to.be.eql([undefined]);
      expect( _.castArray() ).to.be.eql([]);
    });
    it("conformsTo",  function () {
      expect( _.conformsTo({a:1,b:2}, {a:_.isNumber}) ).to.be.eql(true);
      expect( _.conformsTo({a:1,b:2}, {a:_.isNumber,b:_.isNumber}) ).to.be.eql(true);
      expect( _.conformsTo({a:1,b:{c:3}}, {a:_.isNumber,b:_.isObject}) ).to.be.eql(true);
      expect( _.conformsTo({a:1,b:2}, {a:_.isString,b:_.isBoolean}) ).to.be.eql(false);
      expect( _.conformsTo({a:1,b:2}, 'a') ).to.be.eql(false);
      expect( _.conformsTo({a:1,b:2},(o)=> o.a === 1 ) ).to.be.eql(true);  // lodash seems to match true on any function??
      expect( _.conformsTo(null, {a:1}) ).to.be.eql(false);
      expect( _.conformsTo({a:1,b:2},null) ).to.be.eql(true);
      expect( _.conformsTo({a:1,b:2},{}) ).to.be.eql(true);
      expect( _.conformsTo([1,2,3],[]) ).to.be.eql(true);
      expect ( arrIntLarge.forEach( v => _.conformsTo({aa:1,bb:2}, {a:1,b:2}))).to.be.an('undefined');
      if (FP) {
        expect( _.conformsTo({a:_.isNumber})({a:1,b:2}) ).to.be.eql(true);
      }
    });
    it("isArray", function () {
      expect( _.isArray(arrInt) ).to.be.an('boolean').eq(true);
      expect( _.isArray() ).to.be.an('boolean').eq(false);
      expect( _.isArray(null) ).to.be.an('boolean').eq(false);
      expect( _.isArray(NaN) ).to.be.an('boolean').eq(false);
      expect( _.isArray(int) ).to.be.an('boolean').eq(false);
      expect( _.isArray(str) ).to.be.an('boolean').eq(false);
      expect( _.isArray(obj) ).to.be.an('boolean').eq(false);
      expect( _.isArray(func) ).to.be.an('boolean').eq(false);
      expect( _.isArray(dec) ).to.be.an('boolean').eq(false);
      expect( _.isArray(set) ).to.be.an('boolean').eq(false);
      expect( _.isArray(date) ).to.be.an('boolean').eq(false);
      expect( _.isArray(boolFalse) ).to.be.an('boolean').eq(false);
      expect( _.isArray(boolTrue) ).to.be.an('boolean').eq(false);
      expect( _.isArray(clazz) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isArray(v))).to.be.an('undefined');
    });
    it("isArrayLike", function () {
      expect( _.isArrayLike([]) ).to.be.an('boolean').eq(true);
      expect( _.isArrayLike('abc') ).to.be.an('boolean').eq(true);
      expect( _.isArrayLike(new Set([1,2])) ).to.be.an('boolean').eq(false);
      expect( _.isArrayLike({}) ).to.be.an('boolean').eq(false);
      expect( _.isArrayLike(()=>1) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isArrayLike(v))).to.be.an('undefined');
    });
    it("isBoolean", function () {
      expect( _.isBoolean(true) ).to.be.an('boolean').eq(true)
      expect( _.isBoolean(false) ).to.be.an('boolean').eq(true)
      expect( _.isBoolean(new Boolean(false)) ).to.be.an('boolean').eq(true)
      expect( _.isBoolean(0) ).to.be.an('boolean').eq(false)
      expect( _.isBoolean('false') ).to.be.an('boolean').eq(false)
      expect( _.isBoolean([]) ).to.be.an('boolean').eq(false)
      expect( _.isBoolean({}) ).to.be.an('boolean').eq(false)
      expect( _.isBoolean(null) ).to.be.an('boolean').eq(false);
      expect( _.isBoolean(undefined) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isBoolean(v))).to.be.an('undefined');

    });
    it("isBuffer", function () {
      expect( _.isBuffer(Buffer.from('')) ).to.be.an('boolean').eq(true)
      expect( _.isBuffer('abc') ).to.be.an('boolean').eq(false);
      expect( _.isBuffer([]) ).to.be.an('boolean').eq(false);
      expect( _.isBuffer({}) ).to.be.an('boolean').eq(false);
      expect( _.isBuffer(()=>1) ).to.be.an('boolean').eq(false);
      expect( _.isBuffer(null) ).to.be.an('boolean').eq(false);
      expect( _.isBuffer(undefined) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isBuffer(v))).to.be.an('undefined');
    });
    it("isDate", function () {
      expect( _.isDate(new Date) ).to.be.an('boolean').eq(true)
      expect( _.isDate('2020-01-01') ).to.be.an('boolean').eq(false);
      expect( _.isDate({}) ).to.be.an('boolean').eq(false);
      expect( _.isDate(()=>1) ).to.be.an('boolean').eq(false);
      expect( _.isDate(null) ).to.be.an('boolean').eq(false);
      expect( _.isDate(undefined) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isDate(v))).to.be.an('undefined');

    });
    it("isEmpty", function () {
      expect( _.isEmpty(NaN) ).to.be.an('boolean').eq(true);
      expect( _.isEmpty() ).to.be.an('boolean').eq(true);
      expect( _.isEmpty(null) ).to.be.an('boolean').eq(true);
      expect( _.isEmpty('') ).to.be.an('boolean').eq(true);
      expect( _.isEmpty(0) ).to.be.an('boolean').eq(true);
      expect( _.isEmpty(1) ).to.be.an('boolean').eq(true);
      expect( _.isEmpty(boolFalse) ).to.be.an('boolean').eq(true);
      expect( _.isEmpty(boolTrue) ).to.be.an('boolean').eq(true) // Really?
      expect( _.isEmpty({}) ).to.be.an('boolean').eq(true)
      expect( _.isEmpty([]) ).to.be.an('boolean').eq(true)
      expect( _.isEmpty( new Set()) ).to.be.an('boolean').eq(true)
      expect( _.isEmpty(str) ).to.be.an('boolean').eq(false)
      expect( _.isEmpty(obj) ).to.be.an('boolean').eq(false); // really??
      expect( _.isEmpty(arrInt) ).to.be.an('boolean').eq(false); // really??
      expect( _.isEmpty(set) ).to.be.an('boolean').eq(false); // really??
      expect ( arrIntLarge.forEach( v => _.isEmpty(v))).to.be.an('undefined');
    });
    it("isError", function () {
      expect( _.isError(new Error()) ).to.be.an('boolean').eq(true);
      expect( _.isError(new EvalError()) ).to.be.an('boolean').eq(true);
      expect( _.isError(new RangeError()) ).to.be.an('boolean').eq(true);
      expect( _.isError(new ReferenceError()) ).to.be.an('boolean').eq(true);
      expect( _.isError(new SyntaxError()) ).to.be.an('boolean').eq(true);
      expect( _.isError(new TypeError()) ).to.be.an('boolean').eq(true);
      expect( _.isError(new URIError()) ).to.be.an('boolean').eq(true);
      expect( _.isError(0) ).to.be.an('boolean').eq(false);
      expect( _.isError(NaN) ).to.be.an('boolean').eq(false);
      expect( _.isError('abc') ).to.be.an('boolean').eq(false);
      expect( _.isError(false) ).to.be.an('boolean').eq(false);
      expect( _.isError({}) ).to.be.an('boolean').eq(false);
      expect( _.isError([]) ).to.be.an('boolean').eq(false);
      expect( _.isError(clazz) ).to.be.an('boolean').eq(false);
      expect( _.isError(()=>1) ).to.be.an('boolean').eq(false);
      expect( _.isError(undefined) ).to.be.an('boolean').eq(false);
      expect( _.isError(null) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isError(v))).to.be.an('undefined');
    });
    it("isEqual", function () {

      class Foo {
        constructor() {this.a=1}
      }
      class Bar extends Foo {}
      const f = () => 1

      expect( _.isEqual({a:1}, {a:1}) ).to.be.an('boolean').eq(true)
      expect( _.isEqual([1,2,3], [1,2,3]) ).to.be.an('boolean').eq(true)
      expect( _.isEqual(1, 1) ).to.be.an('boolean').eq(true)
      expect( _.isEqual(1.001, 1.001) ).to.be.an('boolean').eq(true)
      expect( _.isEqual('a', 'a') ).to.be.an('boolean').eq(true)
      expect( _.isEqual(NaN, NaN) ).to.be.an('boolean').eq(true)
      expect( _.isEqual(false, false) ).to.be.an('boolean').eq(true)
      expect( _.isEqual(null, null) ).to.be.an('boolean').eq(true)
      expect( _.isEqual(undefined, undefined) ).to.be.an('boolean').eq(true)
      expect( _.isEqual(undefined, null) ).to.be.an('boolean').eq(false)
      expect( _.isEqual(1, '1') ).to.be.an('boolean').eq(false)
      expect( _.isEqual({a:1}, {a:2}) ).to.be.an('boolean').eq(false)
      expect( _.isEqual([1,2,3], [0,1,2]) ).to.be.an('boolean').eq(false)
      expect( _.isEqual([1,2,3], ['1','2','3']) ).to.be.an('boolean').eq(false)
      expect( _.isEqual(new Foo(), new Foo()) ).to.be.an('boolean').eq(true)
      expect( _.isEqual(new Foo(), new Bar()) ).to.be.an('boolean').eq(false)
      expect( _.isEqual(new Foo(), {a:1}) ).to.be.an('boolean').eq(false)
      expect( _.isEqual(f, f) ).to.be.an('boolean').eq(true)
      expect( _.isEqual(f, ()=>1) ).to.be.an('boolean').eq(false)
      expect ( arrIntLarge.forEach( v => _.isEqual(v, {a:1}))).to.be.an('undefined');
      if (FP) {
        expect( _.isEqual({a:1})({a:1}) ).to.be.eql(true);
      }
    });
    it("isFunction", function () {
      expect( _.isFunction(func) ).to.be.an('boolean').eq(true);
      expect( _.isFunction(clazz) ).to.be.an('boolean').eq(true);
      expect( _.isFunction() ).to.be.an('boolean').eq(false);
      expect( _.isFunction(null) ).to.be.an('boolean').eq(false);
      expect( _.isFunction(NaN) ).to.be.an('boolean').eq(false);
      expect( _.isFunction(int) ).to.be.an('boolean').eq(false);
      expect( _.isFunction(str) ).to.be.an('boolean').eq(false);
      expect( _.isFunction(obj) ).to.be.an('boolean').eq(false);
      expect( _.isFunction(dec) ).to.be.an('boolean').eq(false);
      expect( _.isFunction(set) ).to.be.an('boolean').eq(false);
      expect( _.isFunction(date) ).to.be.an('boolean').eq(false);
      expect( _.isFunction(boolFalse) ).to.be.an('boolean').eq(false);
      expect( _.isFunction(boolTrue) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isFunction(v))).to.be.an('undefined');
    });
    it("isInteger", function () {
      expect( _.isInteger(0) ).to.be.an('boolean').eq(true);
      expect( _.isInteger(1) ).to.be.an('boolean').eq(true);
      expect( _.isInteger(0.1) ).to.be.an('boolean').eq(false);
      expect( _.isInteger('0') ).to.be.an('boolean').eq(false);
      expect( _.isInteger('a') ).to.be.an('boolean').eq(false);
      expect( _.isInteger({}) ).to.be.an('boolean').eq(false);
      expect( _.isInteger([]) ).to.be.an('boolean').eq(false);
      expect( _.isInteger(()=>1) ).to.be.an('boolean').eq(false);
      expect( _.isInteger(NaN) ).to.be.an('boolean').eq(false);
      expect( _.isInteger(Infinity) ).to.be.an('boolean').eq(false);
      expect( _.isInteger(null) ).to.be.an('boolean').eq(false);
      expect( _.isInteger(undefined) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isInteger(v))).to.be.an('undefined');
    });
    if (isChugging) {
      it("isIterable", function () {
        expect( _.isIterable([1,2]) ).to.be.an('boolean').eq(true);
        expect( _.isIterable(new Set()) ).to.be.an('boolean').eq(true);
        expect( _.isIterable(null) ).to.be.an('boolean').eq(false);
        expect( _.isIterable(undefined) ).to.be.an('boolean').eq(false);
      });
    }
    it("isPlainObject", function () {
      class Foo {}
      expect( _.isPlainObject({a:1}) ).to.be.an('boolean').eq(true);
      expect( _.isPlainObject(Object.create(null)) ).to.be.an('boolean').eq(true); // support objects without prototype
      expect( _.isPlainObject(Foo) ).to.be.an('boolean').eq(false);
      expect( _.isPlainObject(new Foo()) ).to.be.an('boolean').eq(false);
      expect( _.isPlainObject( ()=>1 ) ).to.be.an('boolean').eq(false);
      expect( _.isPlainObject( 1 ) ).to.be.an('boolean').eq(false);
      expect( _.isPlainObject( 'abc' ) ).to.be.an('boolean').eq(false);
      expect( _.isPlainObject( false ) ).to.be.an('boolean').eq(false);
      expect( _.isPlainObject( true ) ).to.be.an('boolean').eq(false);
      expect( _.isPlainObject( new Boolean(true) ) ).to.be.an('boolean').eq(false);
      expect( _.isPlainObject( null ) ).to.be.an('boolean').eq(false);
      expect( _.isPlainObject( undefined ) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isPlainObject(v))).to.be.an('undefined');
    });
    it("isMap", function () {
      expect( _.isMap(new Map()) ).to.be.an('boolean').eq(true);
      expect( _.isMap(NaN) ).to.be.an('boolean').eq(false);
      expect( _.isMap('') ).to.be.an('boolean').eq(false);
      expect( _.isMap(0) ).to.be.an('boolean').eq(false);
      expect( _.isMap(true) ).to.be.an('boolean').eq(false);
      expect( _.isMap({}) ).to.be.an('boolean').eq(false)
      expect( _.isMap([]) ).to.be.an('boolean').eq(false)
      expect( _.isMap('abc') ).to.be.an('boolean').eq(false)
      expect( _.isMap(undefined) ).to.be.an('boolean').eq(false);
      expect( _.isMap(null) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isMap(v))).to.be.an('undefined');

    });
    it("isMatch",  function () {
      expect( _.isMatch({a:1,b:2}, {a:1}) ).to.be.eql(true);
      expect( _.isMatch({a:1,b:2}, {a:1,b:2}) ).to.be.eql(true);
      expect( _.isMatch({a:1,b:{c:3}}, {a:1,b:{c:3}}) ).to.be.eql(true);
      expect( _.isMatch({a:1,b:2}, {a:2,b:2}) ).to.be.eql(false);
      expect( _.isMatch({a:1,b:2}, {a:1,b:1}) ).to.be.eql(false);
      expect( _.isMatch({a:1,b:2}, 'a') ).to.be.eql(false);
      expect( _.isMatch({a:1,b:2},(o)=> o.a === 1 ) ).to.be.eql(true);  // lodash seems to match true on any function??
      expect( _.isMatch(null, {a:1}) ).to.be.eql(false);
      expect( _.isMatch({a:1,b:2},null) ).to.be.eql(true);
      expect( _.isMatch({a:1,b:2},{}) ).to.be.eql(true);
      expect( _.isMatch([1,2,3],[]) ).to.be.eql(true);
      expect( _.isMatch([1,2,3],[1,2,3]) ).to.be.eql(true);
      expect( _.isMatch([1,2,3],[1,2]) ).to.be.eql(true);
      expect( _.isMatch([1,2,3],[1,2,4]) ).to.be.eql(false);
      expect( _.isMatch([1,2,3],[2,3]) ).to.be.eql(false);
      expect ( arrIntLarge.forEach( v => _.isMatch({aa:1,bb:2}, {a:1,b:2}))).to.be.an('undefined');
      if (FP) {
        expect( _.isMatch({a:1})({a:1,b:2}) ).to.be.eql(true);
      }
    });
    it("isNaN", function () {
      expect( _.isNaN(NaN) ).to.be.an('boolean').eq(true);
      expect( _.isNaN((100/'a')) ).to.be.an('boolean').eq(true);
      expect( _.isNaN((Infinity)) ).to.be.an('boolean').eq(false);
      expect( _.isNaN(func) ).to.be.an('boolean').eq(false);
      expect( _.isNaN(obj) ).to.be.an('boolean').eq(false);
      expect( _.isNaN(clazz) ).to.be.an('boolean').eq(false);
      expect( _.isNaN(str) ).to.be.an('boolean').eq(false);
      expect( _.isNaN(int) ).to.be.an('boolean').eq(false);
      expect( _.isNaN(dec) ).to.be.an('boolean').eq(false);
      expect( _.isNaN(new Date()) ).to.be.an('boolean').eq(false);
      expect( _.isNaN(arrInt) ).to.be.an('boolean').eq(false);
      expect( _.isNaN(boolFalse) ).to.be.an('boolean').eq(false);
      expect( _.isNaN(boolTrue) ).to.be.an('boolean').eq(false);
      expect( _.isNaN() ).to.be.an('boolean').eq(false);
      expect( _.isNaN(null) ).to.be.an('boolean').eq(false);
      expect( _.isNaN(undefined) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isNaN(v))).to.be.an('undefined');
    });
    it("isNil", function () {
      expect( _.isNil() ).to.be.an('boolean').eq(true);
      expect( _.isNil(null) ).to.be.an('boolean').eq(true);
      expect( _.isNil(NaN) ).to.be.an('boolean').eq(false);
      expect( _.isNil('') ).to.be.an('boolean').eq(false);
      expect( _.isNil(0) ).to.be.an('boolean').eq(false);
      expect( _.isNil(1) ).to.be.an('boolean').eq(false);
      expect( _.isNil(boolFalse) ).to.be.an('boolean').eq(false);
      expect( _.isNil(boolTrue) ).to.be.an('boolean').eq(false)
      expect( _.isNil({}) ).to.be.an('boolean').eq(false)
      expect( _.isNil([]) ).to.be.an('boolean').eq(false)
      expect( _.isNil( new Set()) ).to.be.an('boolean').eq(false)
      expect( _.isNil(str) ).to.be.an('boolean').eq(false)
      expect( _.isNil(obj) ).to.be.an('boolean').eq(false);
      expect( _.isNil(arrInt) ).to.be.an('boolean').eq(false);
      expect( _.isNil(set) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isNil(v))).to.be.an('undefined');
    });
    it("isNull", function () {
      expect( _.isNull(null) ).to.be.an('boolean').eq(true);
      expect( _.isNull(undefined) ).to.be.an('boolean').eq(false);
      expect( _.isNull('') ).to.be.an('boolean').eq(false);
      expect( _.isNull({}) ).to.be.an('boolean').eq(false);
    });
    it("isNumber", function () {
      expect( _.isNumber(0) ).to.be.an('boolean').eq(true);
      expect( _.isNumber(-0) ).to.be.an('boolean').eq(true);
      expect( _.isNumber(1.01) ).to.be.an('boolean').eq(true);
      expect( _.isNumber(new Number(1)) ).to.be.an('boolean').eq(true);
      expect( _.isNumber(Infinity) ).to.be.an('boolean').eq(true);
      expect( _.isNumber(NaN) ).to.be.an('boolean').eq(true); // WTF, NaN (Not a Number) is a number ???
      expect( _.isNumber('1') ).to.be.an('boolean').eq(false);
      expect( _.isNumber(false) ).to.be.an('boolean').eq(false);
      expect( _.isNumber({}) ).to.be.an('boolean').eq(false);
      expect( _.isNumber([]) ).to.be.an('boolean').eq(false);
      expect( _.isNumber(clazz) ).to.be.an('boolean').eq(false);
      expect( _.isNumber(()=>1) ).to.be.an('boolean').eq(false);
      expect( _.isNumber(undefined) ).to.be.an('boolean').eq(false);
      expect( _.isNumber(null) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isNumber(v))).to.be.an('undefined');
    });
    it("isObject", function () {
      expect( _.isObject(obj) ).to.be.an('boolean').eq(true);
      expect( _.isObject(Object.create(null)) ).to.be.an('boolean').eq(true); // support objects without prototype
      expect( _.isObject(func) ).to.be.an('boolean').eq(true);
      expect( _.isObject([]) ).to.be.an('boolean').eq(true);
      expect( _.isObject(clazz) ).to.be.an('boolean').eq(true);
      expect( _.isObject(new String('')) ).to.be.an('boolean').eq(true);
      expect( _.isObject(date) ).to.be.an('boolean').eq(true);
      expect( _.isObject(set) ).to.be.an('boolean').eq(true);
      expect( _.isObject() ).to.be.an('boolean').eq(false);
      expect( _.isObject(null) ).to.be.an('boolean').eq(false);
      expect( _.isObject(str) ).to.be.an('boolean').eq(false);
      expect( _.isObject(NaN) ).to.be.an('boolean').eq(false);
      expect( _.isObject(int) ).to.be.an('boolean').eq(false);
      expect( _.isObject(dec) ).to.be.an('boolean').eq(false);
      expect( _.isObject(boolFalse) ).to.be.an('boolean').eq(false);
      expect( _.isObject(boolTrue) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isObject(v))).to.be.an('undefined');
    });
    it("isRegExp", function () {
      expect( _.isRegExp(/a/) ).to.be.an('boolean').eq(true);
      expect( _.isRegExp(1) ).to.be.an('boolean').eq(false);
      expect( _.isRegExp(NaN) ).to.be.an('boolean').eq(false);
      expect( _.isRegExp('a') ).to.be.an('boolean').eq(false);
      expect( _.isRegExp(false) ).to.be.an('boolean').eq(false);
      expect( _.isRegExp({}) ).to.be.an('boolean').eq(false);
      expect( _.isRegExp([]) ).to.be.an('boolean').eq(false);
      expect( _.isRegExp(clazz) ).to.be.an('boolean').eq(false);
      expect( _.isRegExp(()=>1) ).to.be.an('boolean').eq(false);
      expect( _.isRegExp(undefined) ).to.be.an('boolean').eq(false);
      expect( _.isRegExp(null) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isRegExp(v))).to.be.an('undefined');
    });
    it("isSet", function () {
      expect( _.isSet(set) ).to.be.an('boolean').eq(true);
      expect( _.isSet( new Set()) ).to.be.an('boolean').eq(true)
      expect( _.isSet() ).to.be.an('boolean').eq(false);
      expect( _.isSet(null) ).to.be.an('boolean').eq(false);
      expect( _.isSet(NaN) ).to.be.an('boolean').eq(false);
      expect( _.isSet('') ).to.be.an('boolean').eq(false);
      expect( _.isSet(0) ).to.be.an('boolean').eq(false);
      expect( _.isSet(1) ).to.be.an('boolean').eq(false);
      expect( _.isSet(boolFalse) ).to.be.an('boolean').eq(false);
      expect( _.isSet(boolTrue) ).to.be.an('boolean').eq(false)
      expect( _.isSet({}) ).to.be.an('boolean').eq(false)
      expect( _.isSet([]) ).to.be.an('boolean').eq(false)
      expect( _.isSet(str) ).to.be.an('boolean').eq(false)
      expect( _.isSet(obj) ).to.be.an('boolean').eq(false);
      expect( _.isSet(arrInt) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isSet(v))).to.be.an('undefined');
    });
    it("isString", function () {
      expect( _.isString('') ).to.be.an('boolean').eq(true);
      expect( _.isString(str) ).to.be.an('boolean').eq(true)
      expect( _.isString(new String('')) ).to.be.an('boolean').eq(true)
      expect( _.isString(set) ).to.be.an('boolean').eq(false);
      expect( _.isString() ).to.be.an('boolean').eq(false);
      expect( _.isString(null) ).to.be.an('boolean').eq(false);
      expect( _.isString(NaN) ).to.be.an('boolean').eq(false);
      expect( _.isString(int) ).to.be.an('boolean').eq(false);
      expect( _.isString(dec) ).to.be.an('boolean').eq(false);
      expect( _.isString(boolFalse) ).to.be.an('boolean').eq(false);
      expect( _.isString(boolTrue) ).to.be.an('boolean').eq(false)
      expect( _.isString(obj) ).to.be.an('boolean').eq(false);
      expect( _.isString(arrInt) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isString(v))).to.be.an('undefined');
    });
    it("isSymbol", function () {
      expect( _.isSymbol(Symbol.iterator) ).to.be.an('boolean').eq(true);
      expect( _.isSymbol('abc') ).to.be.an('boolean').eq(false)
      expect( _.isSymbol(0) ).to.be.an('boolean').eq(false)
      expect( _.isSymbol([]) ).to.be.an('boolean').eq(false);
      expect( _.isSymbol({}) ).to.be.an('boolean').eq(false);
      expect( _.isSymbol(undefined) ).to.be.an('boolean').eq(false);
      expect( _.isSymbol(null) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.isSymbol(v))).to.be.an('undefined');
    });
    it("isUndefined", function () {
      expect( _.isUndefined(undefined) ).to.be.an('boolean').eq(true);
      expect( _.isUndefined(null) ).to.be.an('boolean').eq(false);
      expect( _.isUndefined('') ).to.be.an('boolean').eq(false);
      expect( _.isUndefined({}) ).to.be.an('boolean').eq(false);
    });
    it("toArray", function () {
      expect( _.toArray(arrInt) ).to.be.an('array').eql(arrInt, '1');
      expect( _.toArray(set) ).to.be.an('array').eql(arrInt , '2');
      expect( _.toArray({a:1, b:2, c:3}) ).to.be.an('array').eql([1,2,3], '3');
      expect( _.toArray(str) ).to.be.an('array').eql(arrStr, '4');
      expect( _.toArray() ).to.be.an('array').eql([], '5');
      expect( _.toArray(null) ).to.be.an('array').eql([], '6');
      expect( _.toArray(func) ).to.be.an('array').eql([], '7');
      expect( _.toArray(clazz) ).to.be.an('array').eql([], '8');
      expect( _.toArray(int) ).to.be.an('array').eql([], '9');
      expect( _.toArray(arrIntLarge) ).to.be.an('array').eql(arrIntLarge, '10');
      // In lodash we can't call toArray(arrIntLarge) times X times as it clones. Never ends...
      // expect ( arrIntLarge.forEach( v => _.toArray(arrIntLarge))).to.be.an('undefined');
      expect ( arrIntLarge.forEach( v => _.toArray([0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9]))).to.be.an('undefined');
    });
    it("toNumber", function () {
      expect( _.toNumber(1) ).to.be.an('number').eql(1);
      expect( _.toNumber('1') ).to.be.an('number').eql(1);
      expect( _.toNumber(1.1) ).to.be.an('number').eql(1.1);
      expect( _.toNumber(new Number(1.1)) ).to.be.an('number').eql(1.1);
      expect( _.toNumber('1.1') ).to.be.an('number').eql(1.1);
      expect( _.toNumber(true) ).to.be.an('number').eql(1);
      expect( _.toNumber(false) ).to.be.an('number').eql(0);
      expect( _.toNumber('abc') ).to.be.an('number').eql(NaN);
      expect( _.toNumber({}) ).to.be.an('number').eql(NaN);
      expect( _.toNumber([]) ).to.be.an('number').eql(0); // WTF Why??
      expect( _.toNumber([1,2]) ).to.be.an('number').eql(NaN);
      expect( _.toNumber(null) ).to.be.an('number').eql(0);
      expect( _.toNumber(undefined) ).to.be.an('number').eql(NaN);
      expect( _.toNumber(NaN) ).to.be.an('number').eql(NaN);
      expect( _.toNumber(Infinity) ).to.be.an('number').eql(Infinity); // Should be Number.MAX_VALUE
      expect ( arrIntLarge.forEach( v => _.toNumber(v))).to.be.an('undefined');
    });
    it("toInteger", function () {
      expect( _.toInteger(1) ).to.be.an('number').eql(1);
      expect( _.toInteger('1') ).to.be.an('number').eql(1);
      expect( _.toInteger(1.1) ).to.be.an('number').eql(1);
      expect( _.toInteger(new Number(1.2)) ).to.be.an('number').eql(1);
      expect( _.toInteger('1.1') ).to.be.an('number').eql(1);
      expect( _.toInteger(true) ).to.be.an('number').eql(1);
      expect( _.toInteger(false) ).to.be.an('number').eql(0);
      expect( _.toInteger('abc') ).to.be.an('number').eql(0); //WTF
      expect( _.toInteger({}) ).to.be.an('number').eql(0); //WTF
      expect( _.toInteger([]) ).to.be.an('number').eql(0); // WTF Why??
      expect( _.toInteger([1,2]) ).to.be.an('number').eql(0); //WTF
      expect( _.toInteger(null) ).to.be.an('number').eql(0);
      expect( _.toInteger(undefined) ).to.be.an('number').eql(0);
      expect( _.toInteger(NaN) ).to.be.an('number').eql(0);
      expect( _.toInteger(Infinity) ).to.be.an('number').eql(Number.MAX_VALUE); // Should be Number.MAX_SAFE_INTEGER
      if (isChugging) {
        expect( _.toInteger(-Infinity) ).to.be.an('number').eql(Number.MIN_SAFE_INTEGER); // Should be Number.MIN_SAFE_INTEGER
      }
      expect ( arrIntLarge.forEach( v => _.toInteger(v))).to.be.an('undefined');

    });
    it("toString", function () {
      expect( _.toString([1,2,3]) ).to.be.an('string').eql('1,2,3', '1');
      expect( _.toString({a:1}) ).to.be.an('string').eql('[object Object]', '2');
      expect( _.toString([1,2,{a:1}]) ).to.be.an('string').eql('1,2,[object Object]', '3');
      expect( _.toString(1) ).to.be.an('string').eql('1', '4');
      expect( _.toString('a') ).to.be.an('string').eql('a', '5');
      expect( _.toString(clazz) ).to.be.an('string').eql('class clazz{}', '5');
      expect( _.toString(true) ).to.be.an('string').eql('true', '6');
      expect( _.toString(false) ).to.be.an('string').eql('false', '7');
      expect( _.toString(null) ).to.be.an('string').eql('', '8');
      expect( _.toString(undefined) ).to.be.an('string').eql('', '9');
      if (isChugging) {
        expect( _.toString(Object.create(null)) ).to.be.an('string').eq('[Object: null prototype]'); //support objects without prototype
      }
      expect ( arrIntLarge.forEach( v => _.toString(v))).to.be.an('undefined');

    });
    it("eq", function () {
      expect( _.eq(1,1) ).to.be.an('boolean').eq(true);
      expect( _.eq('1','1') ).to.be.an('boolean').eq(true);
      expect( _.eq(NaN,NaN) ).to.be.an('boolean').eq(true);
      expect( _.eq(obj,obj) ).to.be.an('boolean').eq(true);
      expect( _.eq(arrStr,arrStr) ).to.be.an('boolean').eq(true);
      expect( _.eq(undefined,undefined) ).to.be.an('boolean').eq(true);
      expect( _.eq(null,null) ).to.be.an('boolean').eq(true);
      expect( _.eq(1,NaN) ).to.be.an('boolean').eq(false);
      expect( _.eq(obj, {a:1,b:2,c:3}) ).to.be.an('boolean').eq(false);
      expect( _.eq(arrStr,['a','b','c']) ).to.be.an('boolean').eq(false);
      expect( _.eq(undefined,null) ).to.be.an('boolean').eq(false);
      expect( _.eq('1',1) ).to.be.an('boolean').eq(false);
      expect( _.eq(1,'1') ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.eq(v,1))).to.be.an('undefined');
      if (FP) {
        expect( _.eq(1)(1) ).to.be.eql(true);
      }
    });
    it("gt", function () {
      expect( _.gt(2,1) ).to.be.an('boolean').eq(true);
      expect( _.gt('2','1') ).to.be.an('boolean').eq(true);
      expect( _.gt('2',1) ).to.be.an('boolean').eq(true);
      expect( _.gt(2,'1') ).to.be.an('boolean').eq(true);
      expect( _.gt(NaN,NaN) ).to.be.an('boolean').eq(false);
      expect( _.gt(obj,obj) ).to.be.an('boolean').eq(false);
      expect( _.gt(arrStr,arrStr) ).to.be.an('boolean').eq(false);
      expect( _.gt(undefined,undefined) ).to.be.an('boolean').eq(false);
      expect( _.gt(null,null) ).to.be.an('boolean').eq(false);
      expect( _.gt(1,NaN) ).to.be.an('boolean').eq(false);
      expect( _.gt(obj, {a:1,b:2,c:3}) ).to.be.an('boolean').eq(false);
      expect( _.gt(arrStr,['a','b','c']) ).to.be.an('boolean').eq(false);
      expect( _.gt(undefined,null) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.gt(v,1))).to.be.an('undefined');
      if (FP) {
        expect( _.gt(1)(2) ).to.be.eql(true);
      }
    });
    it("gte", function () {
      expect( _.gte(2,1) ).to.be.an('boolean').eq(true);
      expect( _.gte(2,2) ).to.be.an('boolean').eq(true);
      expect( _.gte('2','1') ).to.be.an('boolean').eq(true);
      expect( _.gte('2','2') ).to.be.an('boolean').eq(true);
      expect( _.gte('2',1) ).to.be.an('boolean').eq(true);
      expect( _.gte('2',2) ).to.be.an('boolean').eq(true);
      expect( _.gte(2,'1') ).to.be.an('boolean').eq(true);
      expect( _.gte(2,'2') ).to.be.an('boolean').eq(true);
      expect( _.gte(null,null) ).to.be.an('boolean').eq(true);
      //expect( _.gte(NaN,NaN) ).to.be.an('boolean').eq(true); //Not supported to fix {a:1} >= {a:2} => true
      //expect( _.gte(obj,obj) ).to.be.an('boolean').eq(true); //Not supported to fix {a:1} >= {a:2} => true
      //expect( _.gte(arrStr,arrStr) ).to.be.an('boolean').eq(true); //Not supported to fix {a:1} >= {a:2} => true
      expect( _.gte(undefined,undefined) ).to.be.an('boolean').eq(false);
      expect( _.gte(1,NaN) ).to.be.an('boolean').eq(false);
      expect( _.gte(obj, {a:1,b:2,c:3}) ).to.be.an('boolean').eq(false);
      expect( _.gte(arrStr,['a','b','c']) ).to.be.an('boolean').eq(false);
      expect( _.gte(undefined,null) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.gte(v,1))).to.be.an('undefined');
      if (FP) {
        expect( _.gte(1)(2) ).to.be.eql(true);
      }
    });
    it("lt", function () {
      expect( _.lt(1,2) ).to.be.an('boolean').eq(true);
      expect( _.lt('1','2') ).to.be.an('boolean').eq(true);
      expect( _.lt('1',2) ).to.be.an('boolean').eq(true);
      expect( _.lt(1,'2') ).to.be.an('boolean').eq(true);
      expect( _.lt(NaN,NaN) ).to.be.an('boolean').eq(false);
      expect( _.lt(obj,obj) ).to.be.an('boolean').eq(false);
      expect( _.lt(arrStr,arrStr) ).to.be.an('boolean').eq(false);
      expect( _.lt(undefined,undefined) ).to.be.an('boolean').eq(false);
      expect( _.lt(null,null) ).to.be.an('boolean').eq(false);
      expect( _.lt(1,NaN) ).to.be.an('boolean').eq(false);
      expect( _.lt(obj, {a:1,b:2,c:3}) ).to.be.an('boolean').eq(false);
      expect( _.lt(arrStr,['a','b','c']) ).to.be.an('boolean').eq(false);
      expect( _.lt(undefined,null) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.lt(v,1))).to.be.an('undefined');
      if (FP) {
        expect( _.lt(2)(1) ).to.be.eql(true);
      }
    });
    it("lte", function () {
      expect( _.lte(1,2) ).to.be.an('boolean').eq(true);
      expect( _.lte(2,2) ).to.be.an('boolean').eq(true);
      expect( _.lte('1','2') ).to.be.an('boolean').eq(true);
      expect( _.lte('2','2') ).to.be.an('boolean').eq(true);
      expect( _.lte('1',2) ).to.be.an('boolean').eq(true);
      expect( _.lte('2',2) ).to.be.an('boolean').eq(true);
      expect( _.lte(1,'2') ).to.be.an('boolean').eq(true);
      expect( _.lte(2,'2') ).to.be.an('boolean').eq(true);
      expect( _.lte(null,null) ).to.be.an('boolean').eq(true);
      //expect( _.lte(NaN,NaN) ).to.be.an('boolean').eq(true); //Not supported to fix {a:1} <= {a:2} => true
      //expect( _.lte(obj,obj) ).to.be.an('boolean').eq(true); //Not supported to fix {a:1} <= {a:2} => true
      //expect( _.lte(arrStr,arrStr) ).to.be.an('boolean').eq(true); //Not supported to fix {a:1} <= {a:2} => true
      expect( _.lte(undefined,undefined) ).to.be.an('boolean').eq(false);
      expect( _.lte(1,NaN) ).to.be.an('boolean').eq(false);
      expect( _.lte(obj, {a:1,b:2,c:3}) ).to.be.an('boolean').eq(false);
      expect( _.lte(arrStr,['a','b','c']) ).to.be.an('boolean').eq(false);
      expect( _.lte(undefined,null) ).to.be.an('boolean').eq(false);
      expect ( arrIntLarge.forEach( v => _.lte(v,1))).to.be.an('undefined');
      if (FP) {
        expect( _.lte(2)(1) ).to.be.eql(true);
      }
    });
  })

  describe('Array',  function () {
    it("chunk", function () {
      expect( _.chunk([1,2,3],2) ).to.be.an('array').eql([[1,2],[3]]);
      expect( _.chunk([1,2,3],undefined) ).to.be.an('array').eql([[1],[2],[3]]);
      expect( _.chunk('abc',2) ).to.be.an('array').eql([['a','b'],['c']]);
      expect( _.chunk('abc',0) ).to.be.an('array').eql([]);
      expect( _.chunk(null,2) ).to.be.an('array').eql([]);
      expect( _.chunk(undefined,2) ).to.be.an('array').eql([]);
      //expect( _.chunk(func,2) ).to.be.an('array').eql([]);
      expect( _.chunk(arrIntLarge,2) ).to.be.an('array')
      if (FP) {
        expect( _.chunk(2)([1,2,3]) ).to.be.eql([[1,2],[3]]);
      }
    });
    it("compact", function () {
      expect( _.compact(arrFalsy) ).to.be.an('array').eql([], 'Falsy values should return []');
      expect( _.compact() ).to.be.an('array').eql([], 'undefined input array should return []');
      expect( _.compact(str) ).to.be.an('array').eql(arrStr, 'string input should return array of chars');
      expect( _.compact(func) ).to.be.an('array').eql([], 'function input should return []');
      expect( _.compact(int) ).to.be.an('array').eql([], 'int input should return []');
      expect( _.compact(boolFalse) ).to.be.an('array').eql([], 'false input should return []');
      expect( _.compact(dec) ).to.be.an('array').eql([], 'decimal input should return []');
      expect( _.compact(obj) ).to.be.an('array').eql([], 'object input should return []');
      expect( _.compact(arrIntLarge) ).to.be.an('array')
    });
    it("concat", function () {
      if (!FP) {
        expect(_.concat([1, 2, 3])).to.be.eql([1, 2, 3]);
      }
      expect( _.concat(undefined, undefined) ).to.be.eql([undefined, undefined]);
      expect( _.concat([1,2], [2,3], [3,4]) ).to.be.eql([1,2,2,3,3,4] , '1');
      expect( _.concat([1,2], UNDEF_ARR) ).to.be.eql([1,2] , '2');
      expect( _.concat([1,2], {a:1}) ).to.be.eql([1,2, {a:1}] , '3');
      expect( _.concat('abc','def') ).to.be.eql(['abc','def'] , '4');
      expect( _.concat(UNDEF_ARR, UNDEF_ARR) ).to.be.eql([] , '5');
      expect( _.concat(arrInt, UNDEF_ARR) ).to.be.eql(arrInt).and.not.eq(arrInt , '6');
      expect( _.concat(arrIntLarge, arrIntLarge, arrIntLarge, arrIntLarge, arrIntLarge, arrIntLarge) ).to.be.an('array')
      if (FP) {
        expect( _.concat(4)([1,2,3]) ).to.be.eql([1,2,3,4]);
      }
    });
    it("difference", function () {
      expect( _.difference([2,1],[2,3]) ).to.be.an('array').eql([1]);
      expect( _.difference(arrInt,arrInt) ).to.be.an('array').eql([]);
      expect( _.difference(arrInt,int) ).to.be.an('array').eql(arrInt);
      expect( _.difference(['a', 'b', 'c'] ,str) ).to.be.an('array').eql(['a', 'b', 'c'], 'array, str');
      expect( _.difference(arrInt,func) ).to.be.an('array').eql(arrInt);
      expect( _.difference(arrInt,null) ).to.be.an('array').eql(arrInt);
      expect( _.difference(arrInt,NaN) ).to.be.an('array').eql(arrInt);
      expect( _.difference(arrInt, UNDEF_ARR) ).to.be.an('array').eql(arrInt);
      expect( _.difference(int,arrInt) ).to.be.an('array').eql([]);
      expect( _.difference(str,arrStr) ).to.be.an('array').eql([], 'str, array');
      expect( _.difference(func,arrInt) ).to.be.an('array').eql([]);
      expect( _.difference(null,arrInt) ).to.be.an('array').eql([]);
      expect( _.difference(NaN,arrInt) ).to.be.an('array').eql([]);
      expect( _.difference(undefined,arrInt) ).to.be.an('array').eql([]);
      expect( _.difference(arrIntLarge,arrIntLarge) ).to.be.an('array');
      if (FP) {
        expect( _.difference([2,3])([2,1]) ).to.be.eql([1]);
      }
    });
    it("drop", function () {
      expect( _.drop([1,2,3,4], 1) ).to.be.eql([2,3,4]);
      expect( _.drop([], 1) ).to.be.eql([]);
      expect( _.drop(null,0) ).to.be.eql([], '3');
      expect( _.drop(arrIntLarge,100000) ).to.be.an('array');
      expect( _.drop([1,2,3,4], undefined) ).to.be.eql([2,3,4]);

      if (FP) {
        expect( _.drop(1)([1,2,3,4]) ).to.be.eql([2,3,4]);
      }
    });
    it("dropWhile", function () {
      expect( _.dropWhile([1,2,3,4], (v)=>v<2) ).to.be.eql([2,3,4]);
      expect( _.dropWhile([1,2,3,4], undefined) ).to.be.eql([]);
      expect( _.dropWhile(undefined, undefined) ).to.be.eql([]);
      expect( _.dropWhile(arrIntLarge, (v)=>v <= largeArrSize) ).to.be.eql([]);
      if (FP) {
        expect( _.dropWhile((v)=>v<2)([1,2,3,4]) ).to.be.eql([2,3,4]);
      }
    });
    it("first", function () {
      expect( _.first([1,2,3]) ).to.be.eql(1);
      expect( _.first('abc') ).to.be.eql('a');
      expect( _.first({a:1}) ).to.be.eql(undefined);
      expect( _.first() ).to.be.eql(undefined);
    });
    it("flatten", function () {
      expect( _.flatten([[1,2],[3,4]]) ).to.be.an('array').eql([1,2,3,4]);
      expect( _.flatten([[1,2],[3,[4]]]) ).to.be.an('array').eql([1,2,3,[4]]);
      expect( _.flatten('abc') ).to.be.an('array').eql(['a','b','c']);
      expect( _.flatten({a:1,b:2,c:3}) ).to.be.an('array').eql([]);
      expect( _.flatten(undefined) ).to.be.an('array').eql([]);
      expect( _.flatten(null) ).to.be.an('array').eql([]);
      //expect( _.flatten(func) ).to.be.an('array').eql([]);  // lodash returns [undfined] whitch is strange
      expect( _.flatten(arrIntLarge) ).to.be.an('array');

    });
    it("fromPairs", function () {
      expect( _.fromPairs([['a',1],['b',2]]) ).to.be.an('object').eql({a:1,b:2});
      expect( _.fromPairs([['a',1],['b']]) ).to.be.an('object').eql({a:1,b:undefined});
      expect( _.fromPairs([1,2,3,4]) ).to.be.an('object').eql({'undefined': undefined});
      expect( _.fromPairs(null) ).to.be.an('object').eql({});
    });
    it("head", function () {
      expect( _.head([1,2,3]) ).to.be.eql(1);
      expect( _.head('abc') ).to.be.eql('a');
      expect( _.head({a:1}) ).to.be.eql(undefined);
      expect( _.head() ).to.be.eql(undefined);
    });
    it("intersection", function () {
      expect( _.intersection([1,2],[2,2,3]) ).to.be.an('array').eql([2]);
      expect( _.intersection([1,2],[3,4,4]) ).to.be.an('array').eql([]);
      expect( _.intersection(null, null) ).to.be.an('array').eql([]);
      expect( _.intersection(arrIntLarge,arrIntLarge) ).to.be.an('array');
      if (FP) {
        expect(_.intersection([2,2,3])([1,2]) ).to.be.an('array').eql([2]);
      } else {
        expect(_.intersection([1, 2])).to.be.an('array').eql([1, 2]);
      }
    });
    it("join", function () {
      const UNDEF_SPLITTER = (FP) ? ',' : undefined
      expect( _.join([1,2,3], UNDEF_SPLITTER) ).to.be.eql('1,2,3');
      expect( _.join([1,2,3], '-') ).to.be.eql('1-2-3');
      expect( _.join('abc', UNDEF_SPLITTER) ).to.be.eql('a,b,c');
      expect( _.join('abc', '-') ).to.be.eql('a-b-c');
      expect( _.join(null,UNDEF_SPLITTER) ).to.be.eql('');
      expect( _.join(arrIntLarge,'') ).to.be.an('string');
      expect( _.join([1,2,3], undefined) ).to.be.eql('1,2,3');

      if (FP) {
        expect( _.join('-')([1,2,3]) ).to.be.eql('1-2-3');
      }
    });
    it("last", function () {
      expect( _.last([1,2,3]) ).to.be.eql(3);
      expect( _.last('abc') ).to.be.eql('c');
      expect( _.last({a:1}) ).to.be.eql(undefined);
      expect( _.last() ).to.be.eql(undefined);
    });
    it("reverse", function () {
      expect( _.reverse([1,2,3]) ).to.be.eql([3,2,1]);
      if (isChugging) {
        expect( _.reverse('abc') ).to.be.eql('cba'); // lodash crashes when trying with string
      }
      expect( _.reverse({a:1}) ).to.be.eql({a:1})
      expect( _.reverse(func) ).to.be.eql(func)
      expect( _.reverse(null) ).to.be.eql(null)
      expect( _.reverse(undefined) ).to.be.eql(undefined)
      expect( _.reverse(arrIntLarge) ).to.be.an('array');
    });
    it("slice", function () {
      const UNDEF_HIGH = (FP) ? 1000 : undefined
      expect( _.slice([1,2,3,4],3,UNDEF_HIGH) ).to.be.eql([4]);
      expect( _.slice([1,2,3,4],2,3) ).to.be.eql([3]);
      expect( _.slice([1,2,3,4],-1, UNDEF_HIGH) ).to.be.eql([4]);
      expect( _.slice(null,0, UNDEF_HIGH) ).to.be.eql([]);
      expect( _.slice(arrIntLarge,0, 100000) ).to.be.an('array')
      if (FP) {
        expect( _.slice() ).to.be.an('function');
        expect( _.slice(1) ).to.be.an('function');
        expect( _.slice(1000)(3)([1,2,3,4]) ).to.be.eql([4]);
        expect( _.slice(3,1000)([1,2,3,4]) ).to.be.eql([4]);
      }
    });
    it("tail", function () {
      expect( _.tail([1,2,3,4]) ).to.be.eql([2,3,4]);
      expect( _.tail([1]) ).to.be.eql([]);
      expect( _.tail(null,0) ).to.be.eql([]);
    });
    it("union", function () {
      expect( _.union([2], [1, 2]) ).to.be.an('array').eql([2, 1]);
      expect( _.union(arrInt, arrInt) ).to.be.an('array').eql(arrInt);
      expect( _.union(arrInt,int) ).to.be.an('array').eql(arrInt);
      expect( _.union(arrStr,str) ).to.be.an('array').eql(arrStr, 'array, str');
      expect( _.union(arrInt,func) ).to.be.an('array').eql(arrInt);
      expect( _.union(arrInt,null) ).to.be.an('array').eql(arrInt);
      expect( _.union(arrInt,NaN) ).to.be.an('array').eql(arrInt);
      expect( _.union(int,arrInt) ).to.be.an('array').eql(arrInt);
      expect( _.union(str,arrStr) ).to.be.an('array').eql(arrStr);
      expect( _.union(func,arrInt) ).to.be.an('array').eql(arrInt);
      expect( _.union(null,arrInt) ).to.be.an('array').eql(arrInt);
      expect( _.union(NaN,arrInt) ).to.be.an('array').eql(arrInt);
      expect( _.union(undefined,arrInt) ).to.be.an('array').eql(arrInt);
      expect( _.union(arrIntLarge,arrIntLarge) ).to.be.an('array');
      if (FP) {
        expect( _.union() ).to.be.an('function');
        expect( _.union(1) ).to.be.an('function');
        expect(_.union([1, 2])([2]) ).to.be.an('array').eql([2, 1]);
      } else {
        expect(_.union([1,2,3])).to.be.an('array').eql([1,2,3]);
      }
    });
    it("uniq", function () {
      expect( _.uniq([2, 1, 2]) ).to.be.an('array').eql([2, 1]);
      expect( _.uniq(str) ).to.be.an('array').eql(arrStr);
      expect( _.uniq([]) ).to.be.an('array').eql([]);
      expect( _.uniq(null) ).to.be.an('array').eql([]);
      expect( _.uniq() ).to.be.an('array').eql([]);
      expect( _.uniq(arrIntLarge) ).to.be.an('array');
    });
    it("xor", function () {
      expect( _.xor([2, 1], [2, 3]) ).to.be.an('array').eql([1, 3]);
      expect( _.xor([2, 1], [2, 2, 3]) ).to.be.an('array').eql([1, 3]);
      expect( _.xor([2,2, 1], [3, 2, 2]) ).to.be.an('array').eql([1, 3]);
      expect( _.xor(arrStr,arrStr) ).to.be.an('array').eql([]);
      // expect( _.xor(arrStr,str) ).to.be.an('array').eql([]); // lodash do not expand str to array
      // expect( _.xor(str,arrStr) ).to.be.an('array').eql([]);  // lodash do not expand str to array
      expect( _.xor(arrStr,func) ).to.be.an('array').eql(arrStr);
      expect( _.xor(arrStr,null) ).to.be.an('array').eql(arrStr);
      expect( _.xor(arrStr,undefined) ).to.be.an('array').eql(arrStr);
      expect( _.xor(func, arrStr) ).to.be.an('array').eql(arrStr);
      expect( _.xor(null, arrStr) ).to.be.an('array').eql(arrStr);
      expect( _.xor(undefined, arrStr) ).to.be.an('array').eql(arrStr);
      expect( _.xor(arrIntLarge,arrIntLarge) ).to.be.an('array').eql([]);
      if (FP) {
        expect( _.xor([2, 3])([2, 1]) ).to.be.an('array').eql([1, 3]);
      } else {
        expect( _.xor() ).to.be.an('array').eql([]);
      }
    });
    it("zipObject", function () {
      expect( _.zipObject(['a','b'], [1, 2]) ).to.be.an('object').eql({a:1,b:2});
      expect( _.zipObject(['a','b'], [1]) ).to.be.an('object').eql({a:1,b:undefined});
      expect( _.zipObject(['a','b'], []) ).to.be.an('object').eql({a:undefined,b:undefined});
      expect( _.zipObject(['a','b'], undefined) ).to.be.an('object').eql({a:undefined,b:undefined});
      expect( _.zipObject(['a','b'], '1') ).to.be.an('object').eql({a:"1",b:undefined});
      expect( _.zipObject(undefined, undefined) ).to.be.an('object').eql({});
      expect( _.zipObject(arrIntLarge, arrIntLarge) ).to.be.an('object');
      if (FP) {
        expect( _.zipObject([1, 2])(['a','b']) ).to.be.an('object').eql({a:1,b:2});
      }
    });
  })

  describe('Collection',  function () {
    it("find", function () {
      expect( _.find(people, (p)=> p.age == 40 && p.gender == 'male') ).to.be.an('object').eql(fred);
      expect( _.find(people, {age:40}) ).to.be.an('object').eql(fred);
      expect( _.find(people, ['age',40]) ).to.be.an('object').eql(fred);
      expect( _.find(characters, 'features.color') ).to.be.an('object').eql(natas);
      expect( _.find(characters, ['features.color','red']) ).to.be.an('object').eql(natas);
      expect( _.find(str, (char)=>char=='a') ).to.be.eql('a', 'string becomes characters');
      expect( _.find(null,  {age:40}) ).to.be.eql(undefined, 'null collection');
      expect( _.find(undefined,  {age:40}) ).to.be.eql(undefined, 'undefined collection');
      expect( _.find(null, null) ).to.be.eql(undefined, 'undefined collection, undefined spec');
      if (FP) {
        expect(_.find({age:40})(people)).to.be.eql(fred);
      } else {
        expect(_.find()).to.be.eql(undefined);
      }
    });
    it("filter", function () {
      expect( _.filter(people, (p)=> p.age == 40 && p.gender == 'male') ).to.be.an('array').eql([fred]);
      expect( _.filter(people, {age:40}) ).to.be.an('array').eql([fred]);
      expect( _.filter(people, ['age',40]) ).to.be.an('array').eql([fred]);
      expect( _.filter(characters, 'features.color') ).to.be.an('array').eql([natas]);
      expect( _.filter(characters, ['features.color','red']) ).to.be.an('array').eql([natas]);
      expect( _.filter('abc', (char)=>char=='a') ).to.be.an('array').eql(['a'], 'string becomes characters');
      expect( _.filter({a:1,b:2}, (v) => v==1) ).to.be.an('array').eql([1], 'object becomes values');
      expect( _.filter(null,  {age:40}) ).to.be.an('array').eql([]);
      expect( _.filter(undefined,  {age:40}) ).to.be.an('array').eql([]);
      expect( _.filter(null, null) ).to.be.an('array').eql([], 'null function');
      expect( _.filter(arrIntLarge,(v)=> v) ).to.be.an('array');
      if (FP) {
        expect( _.filter({age:40})(people) ).to.be.an('array').eql([fred]);
      } else {
        expect(_.filter()).to.be.an('array').eql([], 'undefined , undefined');
      }
    });
    it("forEach", function () {
      let count = 0;
      _.forEach([1,2,3], (v,i,a) => {
        expect(v).to.be.an('number').eql(a[i])
        count++;
      })
      expect(count).to.be.eql(3 , 'forEach array');
      count = 0;
      _.forEach('abc', (v,i,s) => {
        expect(v).to.be.an('string').eql(s[i])
        count++;
      })
      expect(count).to.be.eql(3 , 'forEach string');
      count = 0;
      _.forEach({a:1,b:2,c:3}, (v,k,o) => {
        expect(v).to.be.an('number').eql(o[k])
        count++;
      })
      expect(count).to.be.eql(3 , 'forEach object');
      if (isChugging) {
        count = 0;
        _.forEach(new Set([1, 2, 3]), (v, i, a) => {
          expect(v).to.be.an('number').eql(a[i])
          count++;
        })
        expect(count).to.be.eql(3, 'forEach set');
      }
      expect(_.forEach([1,2.3],undefined)).to.be.an('array').eql([1,2.3])
      expect(_.forEach('abc',undefined)).to.be.an('string').eql('abc')
      expect(_.forEach({a:1,b:2,c:3},undefined)).to.be.an('object').eql({a:1,b:2,c:3})
      expect(_.forEach(1,undefined)).to.be.eql(1)
      expect(_.forEach(()=>1,undefined)).to.be.an('function')
      expect(_.forEach([1,2], 3)).to.be.eql([1,2])
      expect(_.forEach(undefined,undefined)).to.be.eql(undefined)
      expect( _.forEach(arrIntLarge,(v)=> v) ).to.be.an('array');
      if (FP) {
        _.forEach((v,i,a) => {
          expect(v).to.be.an('number').eql(a[i])
        })([1,2,3])
      }
    });
    it("groupBy", function () {
      expect( _.groupBy([{a:'alfa'},{a:'beta'}], (o) => o.a) ).to.be.an('object').eql({alfa:[{a:'alfa'}],beta:[{a:'beta'}]})
      expect( _.groupBy([{a:'alfa'},{a:'beta'}], 'a') ).to.be.an('object').eql({alfa:[{a:'alfa'}],beta:[{a:'beta'}]})
      expect( _.groupBy([{a:'alfa'},1], (o) => o.a) ).to.be.an('object').eql({alfa:[{a:'alfa'}],'undefined':[1]})
      expect( _.groupBy([], (o) => o.a) ).to.be.an('object').eql({})
      expect( _.groupBy(null, (o) => o.a) ).to.be.an('object').eql({})
      expect( _.groupBy([{a:'alfa'}], undefined) ).to.be.an('object').eql({"[object Object]":[{a:'alfa'}]})
      expect( _.groupBy([{a:'alfa'}], {}) ).to.be.an('object').eql({"true":[{a:'alfa'}]})
      if (FP) {
        expect( _.groupBy('a')([{a:'alfa'},{a:'beta'}]) ).to.be.an('object').eql({alfa:[{a:'alfa'}],beta:[{a:'beta'}]})
      }
    });
    it("includes", function () {
      expect( _.includes([1,2,3], 3) ).to.be.eql(true);
      expect( _.includes('abc', 'c') ).to.be.eql(true);
      expect( _.includes({a:1,b:2},2) ).to.be.eql(true);
      if (isChugging) {
        expect( _.includes(new Set([1,2,3]), 3) ).to.be.eql(true);
      }
      expect( _.includes(null,1) ).to.be.eql(false);
      expect( _.includes(func,1) ).to.be.eql(false);
      expect( _.includes(arrIntLarge,1000) ).to.be.eql(true);
      if (FP) {
        expect( _.includes(3)([1,2,3]) ).to.be.eql(true);
      }
    });
    it("map", function () {
      expect( _.map([1,2,3],(v)=>v*2 ) ).to.be.an('array').eql([2,4,6]);
      expect( _.map('abc',(v)=>v ) ).to.be.an('array').eql(['a','b','c']);
      expect( _.map({a:1,b:2},(v)=>v ) ).to.be.an('array').eql([1,2]);
      expect( _.map(set,(v)=>v ) ).to.be.an('array').eql([]); // WTF
      expect( _.map(null,(v)=>v ) ).to.be.an('array').eql([]); // WTF
      expect( _.map([1,2,3],null ) ).to.be.an('array').eql([1,2,3]);
      expect( _.map('abc',null ) ).to.be.an('array').eql(['a','b','c']);
      expect( _.map({a:1,b:2},null ) ).to.be.an('array').eql([1,2]);
      expect( _.map(people,'age' ) ).to.be.an('array').eql([ 25, 25, 52, 40, 25, 52 ]);
      if (FP) {
        expect( _.map((v)=>v*2 )([1,2,3]) ).to.be.an('array').eql([2,4,6]);
      }
    });
    it("orderBy", function () {
      expect( _.orderBy([3,2,1] ,undefined) ).to.be.an('array').eql([1,2,3]);
      expect( _.orderBy(['c','b','a'], undefined ) ).to.be.an('array').eql(['a','b','c']);
      expect( _.orderBy([becky,john],['age'],['asc']) ).to.be.an('array').eql([john,becky]);
      expect( _.orderBy([johnny, becky,john],['gender', 'name' ],['desc','asc']) ).to.be.an('array').eql([john,johnny, becky]);
      expect( _.orderBy([10,4,7,1], [],['desc']) ).to.be.an('array').eql([ 10, 7, 4, 1 ]);
      expect( _.orderBy([10,4,7,1], [],['asc']) ).to.be.an('array').eql([ 1, 4, 7, 10 ]);
      // this lodash api call will not work as orderBy will treat strings as  => sortBy(a, 'age','desc')
      //expect( _.orderBy([becky,john],'age','desc') ).to.be.an('array').eql([becky,john]);
      expect( _.orderBy(arrIntLarge, undefined) ).to.be.an('array')
      if (isChugging) {
        expect( _.orderBy([johnny, becky,john],{gender:'desc', name:'asc'}) ).to.be.an('array').eql([john,johnny, becky]);
      }
      if (FP) {
        expect( _.orderBy({age:'asc'})([becky,john]) ).to.be.an('array').eql([john,becky]);
      }
    });
    it("reduce", function () {
      expect( _.reduce([1,2,3],(a,v,i,arr)=>a+arr[i]+v,0) ).to.be.an('number').eql(6*2);
      expect( _.reduce({a:1,b:2,c:3},(a,v,k,o)=>a+o[k]+v,0) ).to.be.an('number').eql(6*2);
      expect( _.reduce('abc',(a,v,i,s)=>a+s[i],'') ).to.be.an('string').eql('abc');
      expect( _.reduce(undefined,null,[]) ).to.be.an('array').eql([]);
      expect( _.reduce(null,null,[]) ).to.be.an('array').eql([]);
      expect( _.reduce(arrInt,null, 0) ).to.be.an('number').eql(0);
      expect( _.reduce(func,(a,v)=>a+v,[]) ).to.be.an('array').eql([]);
      expect( _.reduce(clazz,(a,v)=>a+v,[]) ).to.be.an('array').eql([]);
      expect( _.reduce(int,(a,v)=>a+v,[]) ).to.be.an('array').eql([]);
      expect( _.reduce(arrIntLarge,(a,v,i,arr)=>arr[i],0 )).to.be.an('number').eql(arrIntLarge[arrIntLarge.length-1]);
      if (isChugging) {
        expect(_.reduce(new Set([1,2,3]), (a, v) => a + v, 0)).to.be.an('number').eql(6); // not in lodash, WTF
      }
      if (FP) {
        expect( _.reduce((a, v) => a + v, 0)([1,2,3]) ).to.be.an('number').eql(6);
        expect( _.reduce(0)((a, v) => a + v)([1,2,3]) ).to.be.an('number').eql(6);
      }
    });
    it("reject", function () {
      expect( _.reject([becky,john],{age:52}) ).to.be.an('array').eql([john]);
      expect( _.reject([becky,john],'age') ).to.be.an('array').eql([]); // has age
      expect( _.reject([becky,john],'agex') ).to.be.an('array').eql([becky,john]);
      if (FP) {
        expect( _.reject({age:52})([becky,john]) ).to.be.an('array').eql([john]);
      }
    });
    it("size", function () {
      expect( _.size([3,2,1]) ).to.be.an('number').eql(3);
      expect( _.size('abc') ).to.be.an('number').eql(3);
      expect( _.size({a:1,b:2,c:3}) ).to.be.an('number').eql(3);
      expect( _.size(new Map().set('a',1)) ).to.be.an('number').eql(1);
      expect( _.size(new Set([1])) ).to.be.an('number').eql(1);
      expect( _.size( 1 ) ).to.be.an('number').eql(0);
      expect( _.size( ()=>1) ).to.be.an('number').eql(0);
      expect( _.size(null) ).to.be.an('number').eql(0);
      expect( _.size(undefined) ).to.be.an('number').eql(0);
    });
    it("sortBy", function () {
      expect( _.sortBy([3,2,1] ,undefined) ).to.be.an('array').eql([1,2,3]);
      expect( _.sortBy(['c','b','a'], undefined ) ).to.be.an('array').eql(['a','b','c']);
      expect( _.sortBy([becky,john],'age') ).to.be.an('array').eql([john,becky]);
      expect( _.sortBy([john,becky],'name') ).to.be.an('array').eql([becky, john]);
      expect( _.sortBy([bill ,becky, john],['age','name']) ).to.be.an('array').eql([john, becky, bill]);
      expect( _.sortBy([bill ,becky, john],'age','name') ).to.be.an('array').eql([john, becky, bill]);
      expect( _.sortBy(arrIntLarge, undefined) ).to.be.an('array')
      if (FP) {
        expect( _.sortBy('age')([becky,john]) ).to.be.an('array').eql([john,becky]);
      } else {
        expect(_.sortBy()).to.be.an('array').eql([]);
        const a0 = [1,2,3];
        expect(_.sortBy(a0)).to.be.an('array').eql([1, 2, 3]).not.eq(a0); // make sure it's cloned
      }
      if (isChugging) {
        expect( _.sortBy([johnny, becky,john],{gender:'desc', name:'asc'}) ).to.be.an('array').eql([john,johnny, becky]);
      }
    });
  })

  describe('Date',  function () {
    it("now",  function () {
      let start = new Date().valueOf() // Pre test
      let end = start + 30 *1000 // Test should complete within 30
      expect( _.now() ).to.be.within(start, end)
    });
  })

  describe('Function',  function () {
    it("memoize",  function () {
      let f = (arg) => { called++; return arg}
      let cashed = _.memoize(f)
      let called = 0, res1 = cashed(), res2 = cashed();
      expect( called ).to.be.eql(1)
      // call with other key
      expect( _.eq(res1,res2) ).to.be.eql(true)
      called = 0; res1 = cashed('a'); res2 = cashed('a');
      expect( called ).to.be.eql(1)
      expect( _.eq(res1,res2) ).to.be.eql(true)
      // call with key resolver
      cashed = _.memoize(f, (k)=>1) // all resolved to cache key 1
      called = 0; res1 = cashed('a'); res2 = cashed('b');
      expect( called ).to.be.eql(1)
      expect( _.eq(res1,res2) ).to.be.eql(true)
      expect( res2 ).to.be.eql('a')
    });
    it("memoize-resolve",  function () {
      // cache resolved Promise result
      cachedResolve = _.memoize(() => {called++; return Promise.resolve(called)})
      called = 0;
      count = cachedResolve('a').then(n => cachedResolve('a')); // called only once (cached)
      return expect( count ).to.eventually.be.equal(1, 'Cache resolved Promises result')
    });
    if (isChugging) {
      it("memoize-reject", function () {
        // dont cache rejected Promises result
        nonCachedReject = _.memoize(() => {
          called++;
          return Promise.reject(called)
        })
        called = 0;
        count = nonCachedReject('a').catch(n => nonCachedReject('a')).catch(n => n); // called twice
        return expect(count).to.eventually.be.equal(2, 'Dont cache rejected Promises result')
      });
    }
    it("negate",  function () {
      expect( _.negate(_.gt)(50,1) ).to.be.eql(_.lt(50,1))
      expect( _.negate(_.gt)(1,50) ).to.be.eql(_.lt(1,50))
      if (isChugging){
        expect( _.negate()(true) ).to.be.eql(false) // not suported by lodash
        expect( _.negate()(false) ).to.be.eql(true) // not suported by lodash
        expect( _.negate(1)(10) ).to.be.eql(false) // not suported by lodash
      }

    });
  })

  describe('Object',  function () {
    it("assign",  function () {
      expect( _.assign({a:1},{b:2}) ).to.be.eql({a:1,b:2})
      expect( _.assign({a:1},{a:2},{a:3}) ).to.be.eql({a:3})
      expect( _.assign(null, undefined) ).to.be.eql({})
      expect( _.assign(null, null) ).to.be.eql({})
      expect( _.assign(undefined, null) ).to.be.eql({})
    });
    it("get",  function () {
      expect( _.get({a:1}, 'a') ).to.be.eql(1, 'returns property of object')
      expect( _.get({a:{b:{c:0}}}, 'a.b.c') ).to.be.eql(0, 'returns property of object')
      expect( _.get({a:{b:{c:''}}}, 'a.b.c') ).to.be.eql('', 'returns property of object')
      expect( _.get('abc',0) ).to.be.eql('a', 'returns char of string')
      expect( _.get('abc','0') ).to.be.eql('a', 'returns char of string')
      expect( _.get(['a'],0) ).to.be.eql('a', 'returns char of string')
      expect( _.get([1],0) ).to.be.eql(1, 'returns element of array')
      expect( _.get([1],'0.1') ).to.be.eql(undefined, 'returns undfined when array out of range')
      expect( _.get({a:[1]},'a[0]') ).to.be.eql(1 , 'returns value of array')
      expect( _.get({a:[1]},'a[1]') ).to.be.eql(undefined , 'returns out of range value of array')
      expect( _.get(1,1) ).to.be.eql(undefined, 'returns undfined on numbers')
      expect( _.get(natas,'features.color') ).to.be.eql('red', 'returns deep property of object')
      expect( _.get(obj,null) ).to.be.eql(undefined, 'null property specified')
      expect( _.get(obj, undefined) ).to.be.eql(undefined, 'undefined property specified')
      expect( _.get(null,'a') ).to.be.eql(undefined, 'null object specified')
      expect( _.get(undefined,'a') ).to.be.eql(undefined, 'undefined object specified')
      expect( _.get(undefined,null) ).to.be.eql(undefined, 'undefined object specified')
      if (!FP) {
        expect(_.get()).to.be.eql(undefined, 'undefined undefined')
      }
      expect ( arrIntLarge.forEach( v => _.get({a:1},'a'))).to.be.an('undefined');
      expect ( arrIntLarge.forEach( v => _.get({a:1},'a.b'))).to.be.an('undefined'); //optimize
    });
    it("has",  function () {
      expect( _.has({a:1},'a') ).to.be.eql(true)
      expect( _.has({a:false},'a') ).to.be.eql(true)
      expect( _.has({a: {b:0}},'a.b') ).to.be.eql(true)
      expect( _.has( Object.create(null),'a.b' ) ).to.be.eql(false)
      expect( _.has({a:1},'b') ).to.be.eql(false)
      expect( _.has({a:{b:1}},'a.b') ).to.be.eql(true)
      expect( _.has({a:{b:1}},'a.c') ).to.be.eql(false)
      expect( _.has({a:{b:[0,1]}},'a.b[0]') ).to.be.eql(true)
      expect( _.has({a:{b:[0,1]}},'a.b[10]') ).to.be.eql(false)
      expect( _.has([0,1,2], '0') ).to.be.eql(true)
      expect( _.has([0,1,2], 0) ).to.be.eql(true)
      expect( _.has([0,1,2], 10) ).to.be.eql(false)
      expect( _.has({a:{b: ()=> false }},'a.b[0]') ).to.be.eql(false)
      expect( _.has([0,1,2], null) ).to.be.eql(false)
      expect( _.has(null, '10') ).to.be.eql(false)
      expect( _.has(null, null) ).to.be.eql(false)
      expect ( arrIntLarge.forEach( v => _.has({a:1},'a'))).to.be.an('undefined');
      expect ( arrIntLarge.forEach( v => _.has({a:1},'a.b'))).to.be.an('undefined'); //optimize
    });
    it("keys",  function () {
      function Foo() {this.a = 1}
      Foo.prototype.b = 2;
      expect( _.keys({a:1,b:2}) ).to.be.an('array').eql(['a','b'])
      expect( _.keys(new Foo()) ).to.be.an('array').eql(['a'])
      expect( _.keys('ab') ).to.be.an('array').eql(['0','1'])
      expect( _.keys( Object.create(null) ) ).to.be.an('array').eql([])
      expect( _.keys( ()=>1 ) ).to.have.lengthOf(0)
      expect( _.keys( 1 ) ).to.have.lengthOf(0)
      expect( _.keys( false ) ).to.have.lengthOf(0)
      expect( _.keys( 1.2 ) ).to.have.lengthOf(0)
      expect( _.keys([1,2]) ).to.be.an('array').eql(['0','1'])
      expect( _.keys( null ) ).to.be.eql([])
      expect( _.keys( undefined ) ).to.be.eql([])
      expect( _.keys(objLarge) ).to.have.lengthOf(arrIntLarge.length)
    });
    it("keysIn",  function () {
      function Foo() {this.a = 1}
      Foo.prototype.b = 2;
      expect( _.keysIn({a:1,b:2}) ).to.be.an('array').eql(['a','b'])
      expect( _.keysIn(new Foo()) ).to.be.an('array').eql(['a','b'])
      expect( _.keysIn('ab') ).to.be.an('array').eql(['0','1'])
      expect( _.keysIn( Object.create(null) ) ).to.be.an('array').eql([])
      expect( _.keysIn( ()=>1 ) ).to.have.lengthOf(0)
      expect( _.keysIn( 1 ) ).to.have.lengthOf(0)
      expect( _.keysIn( false ) ).to.have.lengthOf(0)
      expect( _.keysIn( 1.2 ) ).to.have.lengthOf(0)
      expect( _.keysIn([1,2]) ).to.be.an('array').eql(['0','1'])
      expect( _.keysIn( null ) ).to.be.eql([])
      expect( _.keysIn( undefined ) ).to.be.eql([])
      expect( _.keysIn(objLarge) ).to.have.lengthOf(arrIntLarge.length)
    });
    it("mapKeys",  function () {
      expect( _.mapKeys({a:1,b:2},(v,k)=> k+v) ).to.be.an('object').eql({a1:1,b2:2})
      if (isChugging) {
        expect( _.mapKeys({a:1,b:2},{a:'x', b:'y'}) ).to.be.an('object').eql({x:1,y:2})
        expect( _.mapKeys({a:1,b:2,c:3},{a: _.toUpper, b: _.noop}) ).to.be.an('object').eql({A:1, b:2, c:3}) // falsey func result => key unchanged
        expect( _.mapKeys({a:1,b:2},(v,k)=> undefined) ).to.be.an('object').eql({a:1,b:2}) // lodash messes up
        expect( _.mapKeys({a:1,b:2},(v,k)=> null) ).to.be.an('object').eql({a:1,b:2})  // lodash messes up
        expect( _.mapKeys({a:1,b:2}, null) ).to.be.an('object').eql({a:1,b:2}) // lodash messes up
      }
      expect( _.mapKeys( Object.create(null) ,(v,k)=> k+v) ).to.be.an('object').eql({})
      expect( _.mapKeys(null,(v,k)=> k+v) ).to.be.an('object').eql({})
      expect( _.mapKeys(undefined,(v,k)=> k+v) ).to.be.an('object').eql({})
    });
    it("mapValues",  function () {
      expect( _.mapValues({a:1,b:2},(v,k)=> v*2) ).to.be.an('object').eql({a:2,b:4})
      expect( _.mapValues({a:1,b:2},_.noop) ).to.be.an('object').eql({a:undefined,b:undefined})
      expect( _.mapValues({a:1,b:2}, undefined) ).to.be.an('object').eql({a:1,b:2})
      expect( _.mapValues({a: {age:10},b:{age:20}},'age') ).to.be.an('object').eql({a:10,b:20})
      expect( _.mapValues({a: {age:10},b:{age:20}},'x') ).to.be.an('object').eql({a:undefined,b:undefined})
      if (isChugging) {
        expect( _.mapValues({a: 1, b:2, c:3, d:4, e:5}, {a:(v)=>v*2, b: _.noop, c: false, d:null}) )
          .to.be.eql({a:2,b:undefined, c:false, d:null, e:5}
        )
      }
      expect( _.mapValues(null,(v,k)=> k+v) ).to.be.an('object').eql({})
      expect( _.mapValues(undefined,(v,k)=> k+v) ).to.be.an('object').eql({})
    });
    it("pick",  function () {
      expect( _.pick({a:1,b:2},['a','b']) ).to.be.an('object').eql({a:1,b:2}, 'returns picked (array) properties of object')
      expect( _.pick({a:1,b:2},'a','b') ).to.be.an('object').eql({a:1,b:2}, 'returns picked (strings) properties of object')
      expect( _.pick({a:1,b:2},'a') ).to.be.an('object').eql({a:1}, 'returns picked (str) properties of object')
      expect( _.pick({a:1,b:{c:3, d:4}},['a','b.c']) ).to.be.an('object').eql({a:1,b:{c:3}}, 'returns picked properties of object')
      expect( _.pick(null,'a') ).to.be.an('object').eql({}, 'return empty object on source = null')
      expect( _.pick(undefined,'a') ).to.be.an('object').eql({}, 'return empty object on source = undefined')
      expect( _.pick({a:1,b:2}, null) ).to.be.an('object').eql({}, 'return empty object on null picked props')
      expect( _.pick({a:1,b:2}, undefined) ).to.be.an('object').eql({}, 'return empty object on undefined picked props')
      expect( _.pick(func, 'a') ).to.be.an('object').eql({}, 'return empty object on source func')
      expect( _.pick(arrInt, 'a') ).to.be.an('object').eql({}, 'return empty object on source arr')
      if (!FP) {
        expect( _.pick(objLarge, "0") ).to.be.an('object').eql({"0":0}, 'Performance') // Investigate why {"0":"0"} is returned ??
      }
    });
    it("pickBy",  function () {
      expect( _.pickBy({a:1,b:2},(v,k)=> k == 'a') ).to.be.an('object').eql({a:1})
      expect( _.pickBy({a:1,b:2},(v,k)=> v == 1) ).to.be.an('object').eql({a:1})
      expect( _.pickBy({a:1,b:2}, undefined) ).to.be.an('object').eql({a:1,b:2})
      expect( _.pickBy( Object.create(null),undefined ) ).to.be.an('object').eql({})
      expect( _.pickBy(undefined, undefined) ).to.be.an('object').eql({})
    });
    it("result",  function () {
      expect( _.result({a:1},'a') ).to.eql(1)

      expect( _.result({a:1},'b') ).to.eql(undefined)
      expect( _.result({a:1},'b', null) ).to.eql(null) // result dose return default when property is undefined
      expect( _.result({a:()=>'x'},'a') ).to.eql('x')
      expect( _.result({a:()=>undefined},'a', null) ).to.eql(undefined) // result dose NOT return default when func return undefined !!!
      if (isChugging) {
        expect( _.result({a:1},'b',(v) => _.falsyTo(v,null)) ).to.eql(null)
        expect(_.result({a: (v) => v}, 'a', 'y')).to.eql('y') // If default value is specified, it's supplied as arg to func
      }
      expect( _.result(null,'a') ).to.eql(undefined)
      expect( _.result(undefined,'a') ).to.eql(undefined)
      expect( _.result({a:1}, null) ).to.eql(undefined)
      expect( _.result({a:1}, undefined) ).to.eql(undefined)
    });
    it("set",  function () {
      expect( _.set({},'a', 1) ).to.be.an('object').eql({a:1})
      expect( _.set({a:2},'a', 1) ).to.be.an('object').eql({a:1})
      expect( _.set({a: {c:2}},'a', 1) ).to.be.an('object').eql({a:1})
      expect( _.set({a: {c:2}},'a.c', 1) ).to.be.an('object').eql({a:{c:1}})
      expect( _.set({},'a.b.c', 1) ).to.be.an('object').eql({a:{b:{c:1}}})
      expect( _.set({a:{b:[1,2]}},'a.b[0]', 8) ).to.be.an('object').eql({a:{b:[8,2]}})
      expect( _.set({a:{b:[1,2]}},'a.b[3]', 8) ).to.be.an('object').eql({a:{b:[1,2,,8]}})
      expect( _.set({a:{b:[1,2]}},'a.b', 8) ).to.be.an('object').eql({a:{b:8}})
      expect( _.set({},'a.b[0]', 1) ).to.be.an('object').eql({ a: { b: [ 1 ] } })
      expect( _.set({a:null},'a.b[0]', 1) ).to.be.an('object').eql({ a: { b: [ 1 ] } })
      expect( _.set(null,'a', 1) ).to.be.eql(null)
      expect( _.set(undefined,'a', 1) ).to.be.eql(undefined)
      //expect( () =>_.set(undefined,'a', 1) ).to.throw()
      //expect( _.set({},undefined, 1) ).to.be.an('object').eql({})
      //expect( _.set({},null, 1) ).to.be.an('object').eql({})
      expect( _.set({},'a', null) ).to.be.an('object').eql({a:null})
      expect( _.set({},'a', undefined) ).to.be.an('object').eql({a:undefined})
    });
    it("toPairs",  function () {
      function Foo() {this.a = 1}
      Foo.prototype.b = 2;
      expect( _.toPairs({a:1}) ).to.be.an('array').eql([['a',1]])
      expect( _.toPairs(new Foo()) ).to.be.an('array').eql([['a',1]])
      expect( _.toPairs({a:1, b: 'x'}) ).to.be.an('array').eql([['a',1],['b','x']])
      expect( _.toPairs({a: _.noop}) ).to.be.an('array').eql([ ['a',_.noop] ])
      expect( _.toPairs([1]) ).to.be.an('array').eql([ ['0', 1] ])
      expect( _.toPairs(_.noop) ).to.be.an('array').eql([])
      expect( _.toPairs(1) ).to.be.an('array').eql([])
      expect( _.toPairs("a") ).to.be.an('array').eql([ ['0', 'a'] ])
      expect( _.toPairs(null) ).to.be.an('array').eql([])
      expect( _.toPairs(undefined) ).to.be.an('array').eql([])
    });
    it("toPairsIn",  function () {
      function Foo() {this.a = 1}
      Foo.prototype.b = 2;
      expect( _.toPairsIn({a:1}) ).to.be.an('array').eql([['a',1]])
      expect( _.toPairsIn(new Foo()) ).to.be.an('array').eql([['a',1],['b',2]])
      expect( _.toPairsIn({a:1, b: 'x'}) ).to.be.an('array').eql([['a',1],['b','x']])
      expect( _.toPairsIn({a: _.noop}) ).to.be.an('array').eql([ ['a',_.noop] ])
      expect( _.toPairsIn([1]) ).to.be.an('array').eql([ ['0', 1] ])
      expect( _.toPairsIn(_.noop) ).to.be.an('array').eql([])
      expect( _.toPairsIn(1) ).to.be.an('array').eql([])
      expect( _.toPairsIn("a") ).to.be.an('array').eql([ ['0', 'a'] ])
      expect( _.toPairsIn(null) ).to.be.an('array').eql([])
      expect( _.toPairsIn(undefined) ).to.be.an('array').eql([])
    });
    it("toPlainObject",  function () {

      function Foo() {this.a = 1}
      Foo.prototype.b = 2;

      class Bar {
        constructor() {this.a = 1}
      }
      class FooBar extends Bar {
        constructor() { super(); this.b = 2}
      }

      expect( _.toPlainObject({a:1}) ).to.be.an('object').eql({a:1})
      expect( _.toPlainObject(new Foo()) ).to.be.an('object').eql({a:1,b:2})
      expect( _.toPlainObject(new Bar()) ).to.be.an('object').eql({a:1})
      expect( _.toPlainObject(new FooBar()) ).to.be.an('object').eql({a:1,b:2})
      expect( _.isPlainObject(_.toPlainObject(new FooBar())) ).to.be.eql(true)
      expect( _.toPlainObject({a:1, b: 'x'}) ).to.be.an('object').eql({a:1, b: 'x'})
      expect( _.toPlainObject({a: _.noop}) ).to.be.an('object').eql({'a': _.noop})
      expect( _.toPlainObject([1]) ).to.be.an('object').eql( {'0': 1} )
      expect( _.toPlainObject(_.noop) ).to.be.an('object').eql({})
      expect( _.toPlainObject(1) ).to.be.an('object').eql({})
      expect( _.toPlainObject("a") ).to.be.an('object').eql({"0": 'a'})
      expect( _.toPlainObject( Object.create(null) ) ).to.be.an('object').eql({})
      expect( _.toPlainObject(null) ).to.be.an('object').eql({})
      expect( _.toPlainObject(undefined) ).to.be.an('object').eql({})
    });
    it("values",  function () {
      function Foo() {this.a = 1}
      Foo.prototype.b = 2;
      expect( _.values({a:1}) ).to.be.an('array').eql([1])
      expect( _.values(new Foo()) ).to.be.an('array').eql([1])
      expect( _.values('abc') ).to.be.an('array').eql(['a','b','c'])
      expect( _.values([1,2,3]) ).to.be.an('array').eql([1,2,3])
      expect( _.values(null) ).to.be.an('array').eql([])
      expect( _.values(undefined) ).to.be.an('array').eql([])
    });
    it("valuesIn",  function () {
      function Foo() {this.a = 1}
      Foo.prototype.b = 2;
      expect( _.valuesIn({a:1}) ).to.be.an('array').eql([1])
      expect( _.valuesIn(new Foo()) ).to.be.an('array').eql([1,2])
      expect( _.valuesIn('abc') ).to.be.an('array').eql(['a','b','c'])
      expect( _.valuesIn([1,2,3]) ).to.be.an('array').eql([1,2,3])
      expect( _.valuesIn(null) ).to.be.an('array').eql([])
      expect( _.valuesIn(undefined) ).to.be.an('array').eql([])
    });
  })

  describe('Math',  function () {
    it("max",  function () {
      expect( _.max([0,1,2]) ).to.be.eql(2)
      expect( _.max('012az') ).to.be.eql('z')
      expect( _.max({}) ).to.be.eql(undefined)
      expect( _.max(0,1) ).to.be.eql(undefined)
      expect( _.max([0,1,,,2.1]) ).to.be.eql(2.1)
      expect( _.max([0,1,null,undefined, 2]) ).to.be.eql(2)
      expect( _.max([{a:1}, {b:2}]) ).to.be.eql({a:1})
      expect( _.max(null) ).to.be.eql(undefined)
      expect( _.max(undefined) ).to.be.eql(undefined)
    });
    it("maxBy",  function () {
      expect( _.maxBy([{a:1}, null, undefined, {a:2}] ,'a') ).to.be.eql({a:2})
      expect( _.maxBy([{a:'aa'}, null, undefined, {a:'zz'}] ,'a') ).to.be.eql({a:'zz'})
      expect( _.maxBy([0,1,,2], undefined), '0' ).to.be.eql(2)
      expect( _.maxBy('012az', 'a') ).to.be.eql(undefined)
      expect( _.maxBy(1, 'a') ).to.be.eql(undefined)
      expect( _.maxBy({a:1}, 'a') ).to.be.eql(undefined)
      expect( _.maxBy(null, 'a') ).to.be.eql(undefined)
      expect( _.maxBy(undefined, 'a') ).to.be.eql(undefined)
      expect( _.maxBy(null, null) ).to.be.eql(undefined)
      expect( _.maxBy(undefined, undefined) ).to.be.eql(undefined)
    });
    it("mean",  function () {
      expect( _.mean([0,1,2]) ).to.be.eql(1)
      expect( _.mean([0,1,,3]) ).to.be.eql(1)
      expect( _.mean([1,'a',2]) ).to.be.eql(NaN)
      expect( _.mean('abc') ).to.be.eql(NaN)
      expect( _.mean([]) ).to.be.eql(NaN)
      expect( _.mean(null) ).to.be.eql(NaN) // Why NaN? max and min returnes undefined
      expect( _.mean(undefined) ).to.be.eql(NaN) // Why NaN? max and min returnes undefined
    });
    it("meanBy",  function () {
      expect( _.meanBy([{a:1},{a:undefined}, {a:2}], 'a') ).to.be.eql(1)
      expect( _.meanBy([{a:1},{a:'x'}, {a:2}], 'a') ).to.be.eql(NaN)
      expect( _.meanBy([], 'a') ).to.be.eql(NaN)
      expect( _.meanBy(null, 'a') ).to.be.eql(NaN)
      expect( _.meanBy(undefined, 'a') ).to.be.eql(NaN)
      expect( _.meanBy(undefined, undefined) ).to.be.eql(NaN)
    });
    it("min",  function () {
      expect( _.min([0,1,2]) ).to.be.eql(0)
      expect( _.min('012az') ).to.be.eql('0')
      expect( _.min({}) ).to.be.eql(undefined)
      expect( _.min(0,1) ).to.be.eql(undefined)
      expect( _.min([0,1,,,2.1]) ).to.be.eql(0)
      expect( _.min([0,1,null,undefined, 2]) ).to.be.eql(0)
      expect( _.min(null) ).to.be.eql(undefined)
      expect( _.min(undefined) ).to.be.eql(undefined)
      expect( _.min([{b:1}, {a:1}]) ).to.be.eql({b:1})

    });
    it("minBy",  function () {
      expect( _.minBy([{a:1}, null, undefined, {a:2}] ,'a') ).to.be.eql({a:1})
      expect( _.minBy([{a:'aa'}, null, undefined, {a:'zz'}] ,'a') ).to.be.eql({a:'aa'})
      expect( _.minBy([0,1,,2], undefined), '0' ).to.be.eql(0)
      expect( _.minBy('012az', 'a') ).to.be.eql(undefined)
      expect( _.minBy(1, 'a') ).to.be.eql(undefined)
      expect( _.minBy({a:1}, 'a') ).to.be.eql(undefined)
      expect( _.minBy(null, 'a') ).to.be.eql(undefined)
      expect( _.minBy(undefined, 'a') ).to.be.eql(undefined)
      expect( _.minBy(null, null) ).to.be.eql(undefined)
      expect( _.minBy(undefined, undefined) ).to.be.eql(undefined)
    });
    it("sum",  function () {
      expect( _.sum([0,1,2]) ).to.be.eql(3)
      expect( _.sum([0,1,,3]) ).to.be.eql(4)
      expect( _.sum([1,'a',2]) ).to.be.eql('1a2')  // lodash sum to string
      expect( _.sum([]) ).to.be.eql(0)
      expect( _.sum('hello') ).to.be.eql('hello')
      expect( _.sum([{a:1}]) ).to.be.eql({a:1})
      expect( _.sum(null) ).to.be.eql(0) // Why 0? max and min returnes undefined
      expect( _.sum(undefined) ).to.be.eql(0) // Why 0? max and min returnes undefined
    });
    it("sumBy",  function () {
      expect( _.sumBy([{a:1},{b:undefined}, {a:2}], 'a') ).to.be.eql(3)
      expect( _.sumBy([{a:1},{a:undefined}, {a:2}], 'b') ).to.be.eql(undefined) // WTF ??
      expect( _.sumBy([{a:1},{a:'x'}, {a:2}], 'a') ).to.be.eql('1x2')
      expect( _.sumBy([], 'a') ).to.be.eql(0)
      expect( _.sumBy(null, 'a') ).to.be.eql(0)
      expect( _.sumBy(undefined, 'a') ).to.be.eql(0)
      expect( _.sumBy(undefined, undefined) ).to.be.eql(0)
    });
  })

  describe('Number',  function () {
    it("inRange",  function () {
      expect( _.inRange(1,1,10) ).to.be.eql(true);
      expect( _.inRange(0,1,10) ).to.be.eql(false);
      expect( _.inRange(10,1,10) ).to.be.eql(false); // end exclusive
      expect( _.inRange('1',1,10) ).to.be.eql(true);
      expect( _.inRange(true,1,10) ).to.be.eql(true);  // true => 1
      expect( _.inRange(false,1,10) ).to.be.eql(false);  // false => 0
      expect( _.inRange('x',2,10) ).to.be.eql(false);
      expect( _.inRange(null,0,10) ).to.be.eql(true);  // null => 0
      expect( _.inRange(undefined,0,10) ).to.be.eql(false);
      expect( _.inRange(()=>1,0,10) ).to.be.eql(false);
      expect( _.inRange({a:1},0,10) ).to.be.eql(false);
      expect( _.inRange(1,10, undefined) ).to.be.eql(true);
      expect( _.inRange(-1,10, undefined) ).to.be.eql(false);
      expect( _.inRange(-2,1,-10) ).to.be.eql(true);
      expect( _.inRange(-11,1,-10) ).to.be.eql(false);
      expect( _.inRange(1,undefined, undefined) ).to.be.eql(false);
      expect( _.inRange(undefined,undefined, undefined) ).to.be.eql(false);

    });
  })

  describe('Seq',  function () {
    it("tap",  function () {
      let called = 0;
      expect( _.tap(false, (arg) => called++) ).to.be.eq(false,'input should be returned');
      expect( _.tap([1,2], (arg) => called++) ).to.be.eql([1,2],'input should be returned');
      expect( called ).to.be.gte(1, 'interceptor is called');
      // NOTE: lodash crashes if non function is supplied
      if (isChugging) {
        expect( _.tap([1,2], null) ).to.be.eql([1,2],'input should be returned');
      }
    });
    it("thru",  function () {
      expect( _.thru(false, (arg) => arg) ).to.be.eq(false,'func outout should be returned');
      expect( _.thru([1,2], (arg) => arg) ).to.be.eql([1,2],'func outout should be returned');
      // NOTE: lodash crashes if non function is supplied
      if (isChugging) {
        expect( _.thru([1,2], null) ).to.be.eql(undefined,'undefined on non function');
      }
    });
  })

  describe('String',  function () {
    it("endsWith",  function () {
      expect( _.endsWith('abc','c') ).to.be.an('boolean').eql(true)
      expect( _.endsWith('abc','b') ).to.be.an('boolean').eql(false)
      expect( _.endsWith('abc','bc') ).to.be.an('boolean').eql(true)
      expect( _.endsWith('abc',null) ).to.be.an('boolean').eql(false)
      expect( _.endsWith('abc',undefined) ).to.be.an('boolean').eql(false)
      expect( _.endsWith(null,'c') ).to.be.an('boolean').eql(false)
      expect( _.endsWith(undefined,'c') ).to.be.an('boolean').eql(false)
      expect( _.endsWith(null,null) ).to.be.an('boolean').eql(false)
      expect( _.endsWith(undefined,undefined) ).to.be.an('boolean').eql(false)
    });
    it("lowerFirst",  function () {
      expect( _.lowerFirst('ABC') ).to.be.eql('aBC')
      expect( _.lowerFirst('') ).to.be.eql('')
      expect( _.lowerFirst(null) ).to.be.eql('')
      expect( _.lowerFirst(undefined) ).to.be.eql('')
      expect( _.lowerFirst(()=>1) ).to.be.eql('()=>1')
      expect( _.lowerFirst({}) ).to.be.eql('[object Object]')
      expect( _.lowerFirst(true) ).to.be.eql('true')
      expect( _.lowerFirst(1) ).to.be.eql('1')
      expect( _.lowerFirst([1,2]) ).to.be.eql('1,2')

    });
    it("padStart",  function () {
      expect( _.padStart('abc',6, undefined) ).to.be.an('string').eql('   abc')
      expect( _.padStart('abc',6, '-') ).to.be.an('string').eql('---abc')
      expect( _.padStart('abc',2, '-') ).to.be.an('string').eql('abc')
      expect( _.padStart('abc',18, {}) ).to.be.an('string').eql('[object Object]abc')
      expect( _.padStart('abc',6, [1,2]) ).to.be.an('string').eql('1,2abc')
      expect( _.padStart('',1, undefined) ).to.be.an('string').eql(' ')
      expect( _.padStart(null,1, undefined) ).to.be.an('string').eql(' ')
      expect( _.padStart(undefined,1, undefined) ).to.be.an('string').eql(' ')
    });
    it("padEnd",  function () {
      expect( _.padEnd('abc',6, undefined) ).to.be.an('string').eql('abc   ')
      expect( _.padEnd('abc',6, '-') ).to.be.an('string').eql('abc---')
      expect( _.padEnd('abc',2, '-') ).to.be.an('string').eql('abc')
      expect( _.padEnd('abc',18, {}) ).to.be.an('string').eql('abc[object Object]')
      expect( _.padEnd('abc',6, [1,2]) ).to.be.an('string').eql('abc1,2')
      expect( _.padEnd('',1, undefined) ).to.be.an('string').eql(' ')
      expect( _.padEnd(null,1, undefined) ).to.be.an('string').eql(' ')
      expect( _.padEnd(undefined,1, undefined) ).to.be.an('string').eql(' ')
    });
    it("repeat",  function () {
      expect( _.repeat('abc',1) ).to.be.an('string').eql('abc')
      expect( _.repeat('abc',0, '-') ).to.be.an('string').eql('')
      expect( _.repeat('abc',1.5, '-') ).to.be.an('string').eql('abc')
      expect( _.repeat(null,1) ).to.be.an('string').eql('')
      expect( _.repeat(undefined,1) ).to.be.an('string').eql('')
      expect( _.repeat('abc',-1) ).to.be.an('string').eql('')
      expect( _.repeat('abc',1/0) ).to.be.an('string').eql('')
      expect( _.repeat('abc',NaN) ).to.be.an('string').eql('')
    });
    it("replace",  function () {
      expect( _.replace('abc','c','x') ).to.be.an('string').eql('abx')
      expect( _.replace('abc','c','') ).to.be.an('string').eql('ab')
      expect( _.replace('abccabcc',/c/g,'x') ).to.be.an('string').eql('abxxabxx')
      expect( _.replace(null,1, undefined) ).to.be.an('string').eql('')
      expect( _.replace(undefined,1, undefined) ).to.be.an('string').eql('')
      if (isChugging) {
        expect( _.replace('abc','c', null) ).to.be.an('string').eql('abc', 'Lodash fail') // WTF Lodash turns null into string 'null'
        expect( _.replace('abc','c', undefined) ).to.be.an('string').eql('abc', 'Lodash fail') // WTF Lodash turns undefined into string 'undefined'
      }
    });
    it("split",  function () {
      expect( _.split('a.b','.') ).to.be.an('array').eql(['a','b'])
      expect( _.split('ab','.') ).to.be.an('array').eql(['ab'])
      expect( _.split('','.') ).to.be.an('array').eql([''])
      expect( _.split([1,2],'.') ).to.be.an('array').eql(['1,2'])
      expect( _.split('ab', undefined) ).to.be.an('array').eql(['ab'])
      if (isChugging) {
        expect( _.split(undefined,'.') ).to.be.an('array').eql([]) // WTF lodash => ['']
        expect( _.split(null,'.') ).to.be.an('array').eql([]) // WTF lodash => ['']
        expect( _.split( Object.create(null) ,'.') ).to.be.an('array').eql([]) // WTF lodash => crash
        expect( _.split( 'arn:aws:iam::1234:role/rolename' , ['/',':']) )
          .to.be.an('array').eql(['arn','aws','iam','','1234','role', 'rolename'])
        expect( _.split( 'xxx' , [null,undefined, ()=>1]) ).to.be.an('array').eql(['xxx'])
        expect( _.split(['a','b'],['.',',']) ).to.be.an('array').eql([ 'a','b' ])

      }
    });
    it("startsWith",  function () {
      expect( _.startsWith('abc','a') ).to.be.an('boolean').eql(true)
      expect( _.startsWith('abc','b') ).to.be.an('boolean').eql(false)
      expect( _.startsWith('abc','ab') ).to.be.an('boolean').eql(true)
      expect( _.startsWith('abc',null) ).to.be.an('boolean').eql(false)
      expect( _.startsWith('abc',undefined) ).to.be.an('boolean').eql(false)
      expect( _.startsWith(null,'a') ).to.be.an('boolean').eql(false)
      expect( _.startsWith(undefined,'a') ).to.be.an('boolean').eql(false)
      expect( _.startsWith(null,null) ).to.be.an('boolean').eql(false)
      expect( _.startsWith(undefined,undefined) ).to.be.an('boolean').eql(false)
    });
    it("toLower",  function () {
      expect( _.toLower('ABC') ).to.be.an('string').eql('abc')
      expect( _.toLower('ÅÄÖ') ).to.be.an('string').eql('åäö')
      expect( _.toLower(['A','B','C']) ).to.be.an('string').eql('a,b,c')
      expect( _.toLower({a:1}) ).to.be.an('string').eql('[object object]')
      expect( _.toLower(null) ).to.be.an('string').eql('')
      expect( _.toLower(undefined) ).to.be.an('string').eql('')
    });
    it("toUpper",  function () {
      expect( _.toUpper('abc') ).to.be.an('string').eql('ABC')
      expect( _.toUpper('åäö') ).to.be.an('string').eql('ÅÄÖ')
      expect( _.toUpper(['a','b','c']) ).to.be.an('string').eql('A,B,C')
      expect( _.toUpper({a:1}) ).to.be.an('string').eql('[OBJECT OBJECT]')
      expect( _.toUpper(null) ).to.be.an('string').eql('')
      expect( _.toUpper(undefined) ).to.be.an('string').eql('')
    });
    it("trim",  function () {
      expect( _.trim(' a b c ', undefined) ).to.be.an('string').eql('a b c')
      expect( _.trim('{"b":123}','"') ).to.be.an('string').eql('{"b":123}')
      expect( _.trim('"{"b":123}"','"') ).to.be.an('string').eql('{"b":123}')
      expect( _.trim('" " x " "','" ') ).to.be.an('string').eql('x')
      expect( _.trim('\nabc\t' , undefined) ).to.be.an('string').eql('abc')
      expect( _.trim('_.abc._','_.') ).to.be.an('string').eql('abc')
      expect( _.trim(null, undefined) ).to.be.an('string').eql('')
      expect( _.trim(undefined, undefined) ).to.be.an('string').eql('')
    });
    it("trimEnd",  function () {
      expect( _.trimEnd(' a b c ', undefined) ).to.be.an('string').eql(' a b c')
      expect( _.trimEnd('{"b":123}','"') ).to.be.an('string').eql('{"b":123}')
      expect( _.trimEnd('{"b":123}"','"') ).to.be.an('string').eql('{"b":123}')
      expect( _.trimEnd(' x" " "','" ') ).to.be.an('string').eql(' x')
      expect( _.trimEnd(' abc\n', undefined) ).to.be.an('string').eql(' abc')
      expect( _.trimEnd(' abc\t', undefined) ).to.be.an('string').eql(' abc')
      expect( _.trimEnd(' abc_.', '_.') ).to.be.an('string').eql(' abc')
      expect( _.trimEnd(null, undefined) ).to.be.an('string').eql('')
      expect( _.trimEnd(undefined, undefined) ).to.be.an('string').eql('')
    });
    it("trimStart",  function () {
      expect( _.trimStart(' a b c ', undefined) ).to.be.an('string').eql('a b c ')
      expect( _.trimStart('{"b":123}','"') ).to.be.an('string').eql('{"b":123}')
      expect( _.trimStart('"{"b":123}','"') ).to.be.an('string').eql('{"b":123}')
      expect( _.trimStart('" " "x ','" ') ).to.be.an('string').eql('x ')
      expect( _.trimStart('\nabc ', undefined) ).to.be.an('string').eql('abc ')
      expect( _.trimStart('\tabc ', undefined) ).to.be.an('string').eql('abc ')
      expect( _.trimStart('_.abc ','_.') ).to.be.an('string').eql('abc ')
      expect( _.trimStart(null, undefined) ).to.be.an('string').eql('')
      expect( _.trimStart(undefined, undefined) ).to.be.an('string').eql('')
    });
    it("upperFirst",  function () {
      expect( _.upperFirst('abc') ).to.be.eql('Abc')
      expect( _.upperFirst('') ).to.be.eql('')
      expect( _.upperFirst(null) ).to.be.eql('')
      expect( _.upperFirst(undefined) ).to.be.eql('')
      expect( _.upperFirst(()=>1) ).to.be.eql('()=>1')
      expect( _.upperFirst({}) ).to.be.eql('[object Object]')
      expect( _.upperFirst(true) ).to.be.eql('True')
      expect( _.upperFirst(1) ).to.be.eql('1')
      expect( _.upperFirst([1,2]) ).to.be.eql('1,2')
    });
  })

  describe('Util',  function () {
    it("conforms",  function () {
      expect( _.conforms({a:(v)=> v == 1})({a:1,b:2}) ).to.be.eql(true);
      expect( _.conforms({a:_.isNumber, b:_.isNumber})({a:1,b:2,c:3}) ).to.be.eql(true);
      expect( _.conforms({a:(v)=> v == 2})({a:1,b:2}) ).to.be.eql(false);
      expect( _.conforms({a:_.isString, b:_.isNumber})({a:1,b:2,c:3}) ).to.be.eql(false);
      expect( _.conforms({})({a:1,b:2}) ).to.be.eql(true);
      expect( _.conforms(null)({a:1,b:2}) ).to.be.eql(true);
    });
    it("flow",  function () {
      expect( _.flow()(1) ).to.be.eql(1);
      expect( _.flow(Number)('1') ).to.be.eq(1);
      expect( _.flow(Number, (v)=>v*2)('1') ).to.be.eql(2);
      expect( _.flow( [ Number, (v)=>v*2 ] )('1') ).to.be.eql(2);
      expect( () => _.flow('hello') ).to.throw(); // not a function
      expect( () => _.flow(['hello']) ).to.throw(); // not a function
    });
    it("defaultTo",  function () {
      expect( _.defaultTo(1,null) ).to.be.eql(1);
      expect( _.defaultTo(undefined,1) ).to.be.eql(1);
      expect( _.defaultTo(NaN,1) ).to.be.eql(1);
      expect( _.defaultTo(null,1) ).to.be.eql(1);
      expect( _.defaultTo(0,1) ).to.be.eql(0);
      expect( _.defaultTo(false,1) ).to.be.eql(false);
    });
    it("identity",  function () {
      expect( _.identity('a') ).to.be.eql('a');
    });
    it("iteratee",  function () {
      expect( _.iteratee((o)=>o)('a') ).to.be.eql('a');
      expect( _.iteratee('a')({a:1}) ).to.be.eql(1);
      expect( _.iteratee({a:1})({a:1}) ).to.be.eql(true);
      expect( _.iteratee({a:1})({a:2}) ).to.be.eql(false);
      expect( _.iteratee({a:1})({a:1, b:2}) ).to.be.eql(true);
      expect( _.iteratee(['a',1])({a:1}) ).to.be.eql(true);
      expect( _.iteratee(['a.b',1])({a:{b:1}}) ).to.be.eql(true);
      expect( _.iteratee(null)({a:1}) ).to.be.eql({a:1});
      expect( _.iteratee('a')(1) ).to.be.eql(undefined);
      expect( _.iteratee(2)(1) ).to.be.eql(undefined);
      if (isChugging) {
        expect( _.iteratee({a: (v)=> v > 100 })({a:1000}) ).to.be.eql(true);
      }
    });
    it("matches",  function () {
      expect( _.matches({a:1})({a:1,b:2}) ).to.be.eql(true);
      expect( _.matches({a:1,b:2})({a:1,b:2}) ).to.be.eql(true);
      expect( _.matches({a:2,b:2})({a:1,b:2}) ).to.be.eql(false);
      expect( _.matches({a:1,b:1})({a:1,b:2}) ).to.be.eql(false);
      expect( _.matches('a')({a:1,b:2}) ).to.be.eql(false);
      expect( _.matches((o)=> o.a === 1 )({a:1,b:2}) ).to.be.eql(true);  // lodash seems to match true on any function??
      expect( _.matches({a:1})(null) ).to.be.eql(false);
      expect( _.matches(null)({a:1,b:2}) ).to.be.eql(true);
      expect( _.matches({})({a:1,b:2}) ).to.be.eql(true);
      expect( _.matches([])([1,2,3]) ).to.be.eql(true);
      expect( _.matches([1,2,3])([1,2,3]) ).to.be.eql(true);
      expect( _.matches([1,2])([1,2,3]) ).to.be.eql(true);
      expect( _.matches([1,2,4])([1,2,3]) ).to.be.eql(false);
      expect( _.matches([2,3])([1,2,3]) ).to.be.eql(false);
      if (isChugging) {
        expect( _.matches({a:(v)=> v == 1})({a:1,b:2}) ).to.be.eql(true);
        expect( _.matches({a: /^[1-9]+$/ })({a:1,b:2}) ).to.be.eql(true);
        expect( _.matches({a:_.isNumber, b:_.isNumber})({a:1,b:2,c:3}) ).to.be.eql(true);
        expect( _.matches({a:(v)=> v == 2})({a:1,b:2}) ).to.be.eql(false);
        expect( _.matches({a: /^[A-Z]+$/ })({a:1,b:2}) ).to.be.eql(false);
        expect( _.matches({a:_.isString, b:_.isNumber})({a:1,b:2,c:3}) ).to.be.eql(false);
      }
    });
    it("matchesProperty",  function () {
      expect( _.matchesProperty('a',1)({a:1}) ).to.be.eql(true);
      expect( _.matchesProperty('a',2)({a:1}) ).to.be.eql(false);
      expect( _.matchesProperty('a', {b:2})({a:{b:2}}) ).to.be.eql(true);
      expect( _.matchesProperty('a', {b:2})({a:{b:1}}) ).to.be.eql(false);
      expect( _.matchesProperty('a.b', 2)({a:{b:2}}) ).to.be.eql(true);
      expect( _.matchesProperty('a.b', 2)({a:{b:1}}) ).to.be.eql(false);
      expect( _.matchesProperty('a.b', undefined)({a:{b:1}}) ).to.be.eql(false);
      expect( _.matchesProperty('a.b', undefined)(undefined) ).to.be.eql(false);
      expect( _.matchesProperty('', undefined)(undefined) ).to.be.eql(false);
      expect( _.matchesProperty(null, 2)({a:{b:1}}) ).to.be.eql(false);
      expect( _.matchesProperty(null, null)({a:{b:1}}) ).to.be.eql(false);
      expect( _.matchesProperty('a.b', 2)(null) ).to.be.eql(false);
      expect( _.matchesProperty(['a',2])({a:1}) ).to.be.eql(false);
      expect( _.matchesProperty({a:1})({a:1}) ).to.be.eql(false);
      expect( _.matchesProperty(0,1)([1,2]) ).to.be.eql(true);
      expect( _.matchesProperty(3,1)([1,2]) ).to.be.eql(false);
      expect( _.matchesProperty(25)({a:1}) ).to.be.eql(false);
      if (isChugging) {
        expect( _.matchesProperty('a',(v)=> v === 1)({a:1}) ).to.be.eql(true);
        expect( _.matchesProperty('a',(v)=> v === 2)({a:1}) ).to.be.eql(false);
      }
    });
    it("noop",  function () {
      expect( _.noop('a') ).to.be.eql(undefined);
    });
    it("over",  function () {
      expect( _.over([Math.max, Math.min])(1, 2, 3, 4) ).to.be.eql([4,1]);
      expect( _.over(Math.max, Math.min)(1, 2, 3, 4) ).to.be.eql([4,1]);
      expect( _.over()(1, 2, 3, 4) ).to.be.eql([]);
      expect( _.over('a')(1, 2, 3, 4) ).to.be.eql([undefined]); //  Will call get(first arg = 1 , 'a') => undefined
      expect( _.over(1)(1, 2, 3, 4) ).to.be.eql([undefined]); //  Will call get(first arg = 1, '1') => undefined
      expect( _.over(null)(1, 2, 3, 4) ).to.be.eql([1]);  // Will call identity(first arg = 1) => 1
      expect( _.over(undefined)(1, 2, 3, 4) ).to.be.eql([1]); // Will call identity(first arg = 1) => 1
    });
    it("overEvery",  function () {
      expect( _.overEvery([()=> true])([1,2,3]) ).to.be.eql(true);
      expect( _.overEvery([ ()=> true, ()=> true ])([1,2,3]) ).to.be.eql(true);
      expect( _.overEvery([ ()=> true, ()=> false ])([1,2,3]) ).to.be.eql(false);
      expect( _.overEvery([ ((...args) => (args.length == 4)) ])(0,1,2,3) ).to.be.eql(true);
      expect( _.overEvery([ Boolean, _.isNumber ])(1) ).to.be.eql(true);
      expect( _.overEvery(Boolean, _.isNumber )(1) ).to.be.eql(true);
      expect( _.overEvery(undefined)('a') ).to.be.eql(true);
      expect( _.overEvery(undefined)(1) ).to.be.eql(true);
      expect( _.overEvery(undefined)(undefined) ).to.be.eql(false);
    });
    it("overSome",  function () {
      expect( _.overSome([()=>true, ()=> false])([0,1,2,3]) ).to.be.eql(true);
      expect( _.overSome([()=>1, ()=> false])([0,1,2,3]) ).to.be.eql(true);
      expect( _.overSome([ ((v) => (v.length == 4)) ])([0,1,2,3]) ).to.be.eql(true);
      expect( _.overSome([ ((...args) => (args.length == 4)) ])(0,1,2,3) ).to.be.eql(true);
      expect( _.overSome([()=>false, ()=> false ])([0,1,2,3]) ).to.be.eql(false);
      expect( _.overSome([_.isString, _.isFunction])('a') ).to.be.eql(true);
      expect( _.overSome([_.isFunction])('a') ).to.be.eql(false);
      expect( _.overSome(_.isString, _.isFunction)('a') ).to.be.eql(true);
      expect( _.overSome([()=>true, ()=> true ])(undefined) ).to.be.eql(true);
      expect( _.overSome(undefined)(undefined) ).to.be.eql(false);
    });
    it("property",  function () {
      expect( _.property('a')({a:1,b:2}) ).to.be.eql(1);
      expect( _.property('b')({a:1,b:2}) ).to.be.eql(2);
      expect( _.property('c')({a:1,b:2}) ).to.be.eql(undefined);
      expect( _.property('a')(null) ).to.be.eql(undefined);
      expect( _.property(null)({a:1,b:2}) ).to.be.eql(undefined);
      expect( _.property(null)(null) ).to.be.eql(undefined);
    });
    it("range",  function () {
      expect( _.range(0,3,1) ).to.be.eql([0,1,2], 'all params specified');
      expect( _.range(3) ).to.be.eql([0,1,2], 'Just end');
      expect( _.range(1,4) ).to.be.eql([1,2,3], 'Start at 1, step default');
      expect( _.range(-1,2) ).to.be.eql([-1,0,1], 'Start at -1');
      expect( _.range(-1,4,2) ).to.be.eql([-1,1,3], 'Step 2');
      expect( _.range(3,0,-1) ).to.be.eql([3,2,1], 'Step -1');
      expect( _.range(3,-1,-3) ).to.be.eql([ 3, 0 ], 'Minus minus => 2 elements');
      expect( _.range(3,-1,-4) ).to.be.eql([ 3 ], 'Minus minus => 1 element');
      expect( _.range(3,0,0) ).to.be.eql([], '0 elements case');
      expect( _.range(1,3,0) ).to.be.eql([1,1], 'Repeated start');
      expect( _.range('a','z') ).to.be.eql([], 'Non numer');
      expect( _.range(3,2,null) ).to.be.eql([], 'Null step with invalid range');
      expect( _.range(NaN,2,NaN) ).to.be.eql([0,0], 'NaN start & step, valid stop');
      expect( _.range(2,3,null) ).to.be.eql([2], 'Null step with valid range');
      expect( _.range(null,null,1) ).to.be.eql([], 'start & stop non numeric, valid step');
      expect( _.range(null,2,1) ).to.be.eql([0,1], 'non numeric start, valid stop & step');
      expect( _.range(NaN,2,1) ).to.be.eql([0,1], 'NaN start, valid stop & step');
      expect( _.range(NaN,NaN,1) ).to.be.eql([], 'NaN start & stop, valid step');
      expect( _.range(largeArrSize) ).to.have.lengthOf(largeArrSize, 'Performance');

    });
    it("toPath",  function () {
      expect( _.toPath('a.b.c') ).to.be.eql(['a', 'b', 'c'], '1');
      expect( _.toPath('a[0].b.c') ).to.be.eql(['a', '0', 'b', 'c'], '2');
      expect( _.toPath(['a', 'b']) ).to.be.eql(['a', 'b'], '3');
      expect( _.toPath('a[0].b[1]') ).to.be.eql(['a', '0', 'b', '1'], '4');
      expect( _.toPath('[0][1]') ).to.be.eql(['0', '1'], '4');
      expect( _.toPath(['a','b']) ).to.be.eql(['a','b'], '5');
      //expect( _.toPath({a:1, b:2}) ).to.be.eql(['object Object'], '5');
      expect( _.toPath(0) ).to.be.eql(["0"], '6');
      expect( _.toPath(0,1) ).to.be.eql(["0"], '7');
      expect( _.toPath([0,1]) ).to.be.eql(["0","1"], '8');
      expect( _.toPath(null) ).to.be.eql([], '9');
      expect( _.toPath(undefined) ).to.be.eql([], '10');
      const d = new Date();
      // Test uncashable path elements
      let i = 0;
      let j = largeArrSize + 1
      expect ( arrIntLarge.forEach( v => _.toPath((j--) +'.'+(i++)) )).to.be.an('undefined');
      // Test cashable path elements
      expect ( arrIntLarge.forEach( v => _.toPath( 'alfa.beta.delta[9]' ) )).to.be.an('undefined');

    });
  })

  if (isChugging) {
    describe('Extentions', function () {
      it("argsToCacheKey", function () {
        expect( _.argsToCacheKey('a') ).to.be.eql('a');
        expect( _.argsToCacheKey('a', {a:1}) ).to.be.eql('a{"a":1}');
        expect( _.argsToCacheKey('a', {a:1}, [1,2]) ).to.be.eql('a{"a":1}[1,2]');
      });
      it("by", function () {
        // Only testing that basic function is availible, all details tested by sortBy and orderBy
        expect( [3,2,1].sort(_.by() ) ).to.be.eql([1,2,3]);
        expect( [1,2,3,11].sort(_.by([],['desc']) ) ).to.be.eql([11,3,2,1]);
        expect( [1,2,3,11].sort(_.by((v)=>v) ) ).to.be.eql([1,2,3,11]);
        expect( [1,2,3,11].sort(_.by(null, null) ) ).to.be.eql([1,2,3,11]);

      });
      it("compareValues", function () {
        // -1 :  value 1 before value 2
        expect(_.compareValues(-Infinity, Infinity)).to.be.eql(-1);
        expect(_.compareValues(-Infinity, -1)).to.be.eql(-1);
        expect(_.compareValues(1, 2)).to.be.eql(-1);
        expect(_.compareValues(0, 1)).to.be.eql(-1);
        expect(_.compareValues(-1, 0)).to.be.eql(-1);
        expect(_.compareValues(0, 'a')).to.be.eql(-1);
        expect(_.compareValues(0, null)).to.be.eql(-1);
        expect(_.compareValues(0, undefined)).to.be.eql(-1);
        expect(_.compareValues(0, NaN)).to.be.eql(-1);
        expect(_.compareValues(0, {a:1})).to.be.eql(-1); // obj will [object Object]
        expect(_.compareValues({a:1},'a')).to.be.eql(-1); // obj will [object Object]
        expect(_.compareValues('a', 'b')).to.be.eql(-1);
        expect(_.compareValues('', 'a')).to.be.eql(-1);
        expect(_.compareValues('a', null)).to.be.eql(-1);
        expect(_.compareValues('a', undefined)).to.be.eql(-1);
        expect(_.compareValues('a', NaN)).to.be.eql(-1);
        expect(_.compareValues(null, undefined)).to.be.eql(-1);
        expect(_.compareValues(null, NaN)).to.be.eql(-1);
        // 1 :  value 2 before value 1
        expect(_.compareValues(Infinity,-Infinity)).to.be.eql(1);
        expect(_.compareValues(Infinity,1)).to.be.eql(1);
        expect(_.compareValues(2, 1)).to.be.eql(1);
        expect(_.compareValues(1, 0)).to.be.eql(1);
        expect(_.compareValues(0, -1)).to.be.eql(1);
        expect(_.compareValues('a', 1)).to.be.eql(1);
        expect(_.compareValues(null, 0)).to.be.eql(1);
        expect(_.compareValues(undefined, 0)).to.be.eql(1);
        expect(_.compareValues(NaN, 0)).to.be.eql(1);
        expect(_.compareValues({a:1},0)).to.be.eql(1); // obj will [object Object]
        expect(_.compareValues('a',{a:1})).to.be.eql(1); // obj will [object Object]
        expect(_.compareValues('b', 'a')).to.be.eql(1);
        expect(_.compareValues('a', '')).to.be.eql(1);
        expect(_.compareValues(null, 'a')).to.be.eql(1);
        expect(_.compareValues(undefined, 'a')).to.be.eql(1);
        expect(_.compareValues(NaN, 'a')).to.be.eql(1);
        expect(_.compareValues(undefined, null)).to.be.eql(1);
        expect(_.compareValues(NaN, null)).to.be.eql(1);
        // Descening = true: reverse for values but undefined, null and NaN still last
        expect(_.compareValues(1, 2, true)).to.be.eql(1);
        expect(_.compareValues('a', 'b', true)).to.be.eql(1);
        expect(_.compareValues(0, null, true)).to.be.eql(-1);
        expect(_.compareValues(0, undefined, true)).to.be.eql(-1);
        expect(_.compareValues(0, NaN, true)).to.be.eql(-1);
        // Falsey Descening => asc
        expect(_.compareValues(1, 2, false)).to.be.eql(-1); // asc
        expect(_.compareValues(1, 2, null)).to.be.eql(-1); // asc
        expect(_.compareValues(1, 2, undefined)).to.be.eql(-1); // asc
        expect(_.compareValues(1, 2, 0)).to.be.eql(-1); // asc
        // Truthy Descening => desc
        expect(_.compareValues(1, 2, true)).to.be.eql(1); // desc
        expect(_.compareValues(1, 2, 'true')).to.be.eql(1); // desc
        expect(_.compareValues(1, 2, 1)).to.be.eql(1); // desc
        // 0 :  equal value
        expect(_.compareValues(0, 0)).to.be.eql(0);
        expect(_.compareValues(+0, -0)).to.be.eql(0);
        expect(_.compareValues('a', 'a')).to.be.eql(0);
        expect(_.compareValues(null, null)).to.be.eql(0);
        expect(_.compareValues(undefined, undefined)).to.be.eql(0);
        expect(_.compareValues({}, {})).to.be.eql(0);
        expect(_.compareValues(NaN, NaN)).to.be.eql(0);
      });
      it("curate", function () {
        expect( _.curate({a:1}, 'a', [_.toString]) ).to.be.eql('1');
        expect( _.curate({a:'a'}, 'a', [_.toUpper, _.toLower]) ).to.be.eql('a');
      });
      it("falsyTo", function () {
        expect( _.falsyTo(null,'falsy') ).to.be.eql('falsy');
        expect( _.falsyTo(undefined,'falsy') ).to.be.eql('falsy');
        expect( _.falsyTo(0,'falsy') ).to.be.eql('falsy');
        expect( _.falsyTo('','falsy') ).to.be.eql('falsy');
        expect( _.falsyTo(NaN,'falsy') ).to.be.eql('falsy');
        expect( _.falsyTo({},'falsy') ).to.be.eql({});
        expect( _.falsyTo(100,'falsy') ).to.be.eql(100);
        expect( _.falsyTo('a','falsy') ).to.be.eql('a');
      });
      it("hours", function () {
        const hours = _.toDate(_.hours())
        expect( hours.getHours() ).to.be.an('number').eql(_.toDate().getHours());
      });
      it("isPromise", function () {
        expect(_.isPromise(Promise.resolve(1)) ).to.be.an('boolean').eql(true);
        expect(_.isPromise( new Promise((resolve,reject)=>resolve(1)) ) ).to.be.an('boolean').eql(true);
        expect(_.isPromise( ()=>1 ) ).to.be.an('boolean').eql(false);
        expect(_.isPromise( [] ) ).to.be.an('boolean').eql(false);
        expect(_.isPromise( {} ) ).to.be.an('boolean').eql(false);
        expect(_.isPromise( 1 )  ).to.be.an('boolean').eql(false);
        expect(_.isPromise( 'a' ) ).to.be.an('boolean').eql(false);
        expect(_.isPromise( null ) ).to.be.an('boolean').eql(false);
        expect(_.isPromise( undefined ) ).to.be.an('boolean').eql(false);
      });
      it("push", function () {
        expect(_.push([], int)).to.be.an('array').eql([int]);
        expect(_.push(null, int)).to.be.an('array').eql([int]);
        expect(_.push(undefined, int)).to.be.an('array').eql([int]);
        expect(_.push({a: 1}, int)).to.be.an('array').eql([1, int]);
        expect(_.push(func, int)).to.be.an('array').eql([int]);
        expect(_.push([], null)).to.be.an('array').eql([null]);
        expect(_.push([], undefined)).to.be.an('array').eql([undefined]);
        expect(_.push([], boolFalse)).to.be.an('array').eql([boolFalse]);
      });
      it("toDate", function () {
        expect(_.toDate(null)).to.be.an('date').eql(new Date(0));
        expect(_.isToday(_.toDate('now'))).to.be.eql(true);
        expect(_.toDate('today')).to.be.an('date').eql(new Date((new Date().setHours(0,0,0,0))));
        expect(_.toDate('tomorrow')).to.be.an('date').eql(new Date(_.tomorrow()));
        expect(_.isToday(_.toDate()) ).to.be.eql(true);
        const date = new Date()
        expect(_.isToday(_.toDate(date))).to.be.eql(true);
        const invalidDate =  _.toDate('fail')
        expect(invalidDate.toISOString()).to.be.eql('');

      });
      it("toISOString", function () {
        expect(_.toISOString(0)).to.be.an('string').eql('1970-01-01T00:00:00.000Z');
      });
      it("toEpoch", function () {
        expect(_.toEpoch(0)).to.be.an('number').eql(0);
      });
      it("isToday", function () {
        expect(_.isToday(_.today())).to.be.an('boolean').eql(true);
        expect(_.isToday(_.tomorrow())).to.be.an('boolean').eql(false);
        expect(_.isToday(_.toEpoch(_.today()) -1 )).to.be.an('boolean').eql(false);
      });
      it("minutes", function () {
        const minute = _.toDate(_.minutes())
        expect( minute.getMinutes() ).to.be.an('number').eql(_.toDate().getMinutes());
      });
      it("nilTo", function () {
        expect( _.nilTo(null,'falsy') ).to.be.eql('falsy');
        expect( _.nilTo(undefined,'falsy') ).to.be.eql('falsy');
        expect( _.nilTo(0,'falsy') ).to.be.eql(0);
        expect( _.nilTo('','falsy') ).to.be.eql('');
        expect( _.nilTo(NaN,'falsy') ).to.be.eql(NaN);
        expect( _.nilTo({},'falsy') ).to.be.eql({});
        expect( _.nilTo(100,'falsy') ).to.be.eql(100);
        expect( _.nilTo('a','falsy') ).to.be.eql('a');
      });
      it("undefinedTo", function () {
        expect( _.undefinedTo(undefined,'falsy') ).to.be.eql('falsy');
        expect( _.undefinedTo(null,'falsy') ).to.be.eql(null);
        expect( _.undefinedTo(0,'falsy') ).to.be.eql(0);
        expect( _.undefinedTo('','falsy') ).to.be.eql('');
        expect( _.undefinedTo(NaN,'falsy') ).to.be.eql(NaN);
        expect( _.undefinedTo({},'falsy') ).to.be.eql({});
        expect( _.undefinedTo(100,'falsy') ).to.be.eql(100);
        expect( _.undefinedTo('a','falsy') ).to.be.eql('a');
      });
      it("toJSON", function () {
        expect( _.toJSON(1) ).to.be.eql('1');
        expect( _.toJSON('a') ).to.be.eql('"a"');
        expect( _.toJSON({a:1}) ).to.be.eql('{"a":1}');
        expect( _.toJSON(null) ).to.be.eql('null');
        expect( _.toJSON(undefined) ).to.be.eql(undefined);
        expect( _.toJSON(()=>1) ).to.be.eql(undefined);
      });
      it("rejectIfNil", function () {
        expect( _.rejectIfNil(1, 'Fail') ).to.be.eql(1);
        expect( _.isPromise(_.rejectIfNil(null,'fail')) ).to.be.eql(true);
        expect( _.isPromise(_.rejectIfNil(undefined,'fail')) ).to.be.eql(true);
      });
      it("today", function () {
        let start = (new Date().valueOf() - (24 * 3600 * 1000)) // 24 hours back
        let end = new Date().valueOf() // NOW
        expect(_.today()).to.be.within(start, end)
      });
      it("tomorrow", function () {
        let start = new Date().valueOf() // NOW
        let end = start + 24 * 3600 * 1000 // + 24 h
        expect(_.tomorrow()).to.be.within(start, end)
      });

    })

    describe('Internals', function () {
    })
  }

})