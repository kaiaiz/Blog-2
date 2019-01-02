# JavaScript 的基本操作

## 深浅拷贝

基本数据类型保存在`栈内存`，引用类型保存在`堆内存`中

如果是基本数据类型，赋值的时候，会在栈内存中重新开辟一块空间，两者修改后互不影响

```js
let a = 1

let b = a

a = 2

console.log(a) // 2
console.log(b) // 1
```

而赋值引用类型的时候，修改其中一个则会影响到另一个

以下是对象

```js
let a = {
  age: 1
}

let b = a
a.age = 2

console.log('a.age', a.age) // 2
console.log('b.age', b.age) // 2
```

以下是数组

```js
let arr = [1, 2, 3]

let brr = arr

arr.push(4) // 使用 push、splic、pop、shift、unshift 均会更改

console.log(arr) // [ 1, 2, 3, 4 ]
console.log(brr) // [ 1, 2, 3, 4 ]
```

因为 a 和 b 都指向同一个引用，所以将 a 更改后，b 也跟着更改

![](./image/js/copy1.png)

在开发中会遇到既要保留原始数据，又要更改新数据，如果只是单纯的改变值，我们可以使用浅拷贝

### 浅拷贝

对象的解决方法：

1、通过 `Object.assign()` 来解决

```js{5}
let a = {
  age: 1
}

let b = Object.assign({}, a)

a.age = 2
console.log('a.age', a.age) // 2
console.log('b.age', b.age) // 1
```

2、通过 ES6 的展开运算符 `{...}`

```js{5}
let a = {
  age: 1
}

let b = { ...a }

a.age = 2
console.log('a.age', a.age) // 2
console.log('b.age', b.age) // 1
```

数组的解决方法：

1、通过 `concat()` 来解决

**concat** 方法不会改变 **this** 或任何作为参数提供的数组，而是返回一个**浅拷贝**，它包含与原始数组相结合的相同元素的副本，原始数组的元素将复制到**新数组**中。[MDN 上对 concat 的描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)

```js{3}
let arr = [1, 2, 3]

let brr = arr.concat()

arr.push(4)
console.log(arr) // [ 1, 2, 3, 4 ]
console.log(brr) // [ 1, 2, 3 ]
```

2、通过 `slice()` 来解决

`slice()` 方法返回一个新的数组对象，这一对象是一个由 **begin** 和 **end**（不包括 end）决定的原数组的**浅拷贝**,原始数组不会被改变。[MDN 上对 slice 的描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

```js{3}
let arr = [1, 2, 3]

let brr = arr.slice()

arr.push(4)
console.log(arr) // [ 1, 2, 3, 4 ]
console.log(brr) // [ 1, 2, 3 ]
```

其实这两种方法都是返回一个新的数组，所以改变其中一个数组并不会影响另一个

浅拷贝只能解决一层引用的问题，如果是多层则会失败

```js{8,10}
let a = {
  age: 1,
  city: {
    name: 'fz'
  }
}

let b = Object.assign({}, a)

a.city.name = 'sz'

console.log('a.city.name', a.city.name) // sz
console.log('b.city.name', b.city.name) // sz
```

有多层引用的时候就要使用深拷贝

### 深拷贝

通常可以使用 JSON.parse(JSON.stringify(object)) 来解决

```js{8,13}
let a = {
  age: 1,
  city: {
    name: 'fz'
  }
}

let b = JSON.parse(JSON.stringify(a))

a.city.name = 'sz'

console.log('a.city.name', a.city.name) // sz
console.log('b.city.name', b.city.name) // fz
```

但是该方法也是有局限性的：

- 会忽略 undefined
- 会忽略 symbol
- 不能序列化函数
- 不能解决循环引用的对象

```js
let a = {
  w: function() {},
  x: undefined,
  y: Object,
  z: Symbo
let b = JSON.stringify(a)
console.log(b) // '{}'

JSON.stringify([undefined, Object, Symbol('')])
// '[null,null,null]'
```

undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）

[MDN 上对 JSON.stringify 的描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

不过这种解决方案可以解决大部分问题，并且该函数是内置函数中处理深拷贝性能最快的

如果想实现更好的深拷贝，可以使用 **lodash** 函数库

```js
var obj1 = {
  a: 1,
  b: { f: { g: 1 } },
  c: [1, 2, 3]
}
var obj2 = _.cloneDeep(obj1)
console.log(obj1.b.f === obj2.b.f) // false
```

也可以手动递归拷贝（较为麻烦）

```js
var obj1 = {
  a: 1,
  b: {
    f: {
      g: 1
    }
  },
  c: [1, 2, 3]
}

function getType(obj) {
  // tostring 会返回对应不同的标签的构造函数
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  // 判断是否为 DOM 元素
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

function deepClone(data) {
  var type = getType(data)
  var obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    //不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

let obj2 = deepClone(obj1)
obj1.b.f.g = 2
console.log(obj2) // 不会改变
```
