# ES6 语法

这是写 ES6

## JavaScript 的基本操作

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

```js{3}
let arr = [1, 2, 3]

let brr = arr.concat()

arr.push(4)
console.log(arr) // [ 1, 2, 3, 4 ]
console.log(brr) // [ 1, 2, 3 ]
```

浅拷贝只能解决一层引用的问题，如果是多层则会失败

```js{8,10}
let a = {
  age: 1,
  city: {
    name: 'fz'
  }
}

let b = { ...a }

a.city.name = 'sz'

console.log('a.city.name', a.city.name) // sz
console.log('b.city.name', b.city.name) // sz
```

这个时候就要使用深拷贝了

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
- 不能序列化函数
- 不能解决循环引用的对象
