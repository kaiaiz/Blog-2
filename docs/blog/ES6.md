# ES6

## var、let 和 const 的区别

那么最后我们总结下这小节的内容：

函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
var 存在提升，我们能在声明之前使用。let、const 因为暂时性死区的原因，不能在声明前使用
var 在全局作用域下声明变量会导致变量挂载在 window 上，其他两者不会
let 和 const 作用基本一致，但是后者声明的变量不能再次赋值

## callback、promise 和 async await

callback 回调都知道，什么是回调地狱呢，如下：

```js
function callBack(cb) {
  setTimeout(() => {
    console.log('hello')
    cb()
  }, 2000)
}
// 回调地狱
callBack(() => {
  console.log('world')
  callBack(() => {
    console.log('JavaScript')
    callBack(() => {
      console.log('Vue')
    })
  })
})
```

比较容易产生回调地狱现象的是在调用后端接口的时候，等一个接口请求返回后再调用第二个接口，以此类推就成了回调地狱，嵌套地狱，无论是后期维护还是审阅代码都非常头疼

当然，回调函数还存在着别的几个缺点，比如不能使用 try catch 捕获错误，不能直接 return。

#### Promise

优势：多个异步等待合并，可以解决回调地狱的问题，可以 return

Promise 是一个对象，不是一个函数，对象是可以保存状态的

Promise 有三种状态，`pending` `fulfilled` `rejected` ，进行中、已成功、已失败

在 `new Promise` 的时候就是处于 `pending` 状态，通过 `reslove` 和 `reject` 把一个进行中的 `promise` 修改为**已成功**或者**已失败**的状态

一旦将状态修改为已成功或者已失败， **promise** 的状态就凝固了，不能再改变

```js
new Promise((resolve, reject) => {
  resolve('success')
  reject('reject') // 无效
})
```

当我们在构造 `Promise` 的时候，构造函数内部的代码是**立即执行**的

```js
new Promise((resolve, reject) => {
  console.log('new Promise')
  resolve('success')
})
console.log('finifsh')
// 先输出 new Promise 再输出 finifsh
```

`Promise` 实现了链式调用，也就是说每次调用 `then` 之后返回的都是一个 `Promise`，并且是一个全新的 `Promise`，原因也是因为状态不可变。如果你在 `then` 中 使用了 `return`，那么 `return` 的值会被 `Promise.resolve()` 包装

```js
function promiseTest(val) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove(val)
    }, 1000)
  })
}

promiseTest('JavaScript')
  .then(val => {
    console.log(val)
    return promiseTest('Vue')
  })
  .then(val => {
    console.log(val)
    return promiseTest('React')
  })
  .then(val => {
    console.log(val)
  })
```

`Promise` 通过链式调用很好地解决了回调地狱的问题

`Promise` 还有一些方法很好用

promise.all ：等待所有 promise 完成之后才会触发回调函数

```js
function promiseTest(val) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove(val)
    }, 2000)
  })
}

Promise.all([
  promiseTest('JavaScript'),
  promiseTest('Vue'),
  promiseTest('React')
]).then(val => {
  console.log(val)
})
// [ 'JavaScript', 'Vue', 'React' ]
```

在小程序中使用 promise.all 的具体实例：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214173313.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214173313.png)</a>

接口返回的结果：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214173345.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214173345.png)</a>

将之前 `this.setData` 绑定操作全部整合在一起

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214174043.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214174043.png)</a>

promise 还有 `.race` 的竞争方法，当某个 promise 率先完成后就触发，放在实际请求中就是当某个请求率先完成后就触发回调函数

但是 `Promise` 也有缺点，比如错误需要通过回调函数捕获

#### async 及 await

一个函数如果加上 `async` ，那么该函数就会返回一个 `Promise`

```js
async function test() {
  return '1'
}
console.log(test()) // -> Promise {<resolved>: "1"}
```

`async` 就是将函数返回值使用 `Promise.resolve()` 包裹了下，和 `then` 中处理返回值一样，并且 `await` 只能配套 `async` 使用

```js
function promiseTest(val) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      console.log(val)
      reslove(val)
    }, 1000)
  })
}

async function test() {
  await promiseTest('JavaScript')
  console.log(1)
  await promiseTest('Vue')
  console.log(2)
  await promiseTest('React')
  console.log(3)
}

test()

/*
JavaScript
1
Vue
2
React
3
*/
```

`async` 和 `await` 相比直接使用 `Promise` 来说，优势在于处理 `then` 的调用链，能够更清晰准确的写出代码。

缺点在于滥用 `await` 可能会导致**性能问题**，因为 `await` 将异步代码改造成了同步代码，如果多个异步代码没有**依赖性**却使用了 `await` 会导致性能上的降低

```js
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch(url)
  await fetch(url1)
  await fetch(url2)
}
```

下面来看一个使用 `await` 的代码。

```js
var a = 0
var b = async () => {
  a = a + (await 10)
  console.log('2', a) // -> '2' 10
  a = (await 10) + a
  console.log('3', a) // -> '3' 20
}
b()
a++
console.log('1', a) // -> '1' 1

/*
1 1
2 10
3 20
*/
```

这里说明下原理

1. 首先函数 b 先执行，在执行到 await 10 之前变量 a 还是 0，因为在 await 内部实现了 generators ，generators 会保留堆栈中东西，所以这时候 a = 0 被保存了下来
2. 因为 `await` 是异步操作，后来的表达式不返回 `Promise` 的话，就会包装成 `Promise.reslove(返回值)`，然后会去执行函数外的同步代码，所以会**先执行 console.log('1', a)**
3. 这时候**同步代码执行完毕，开始执行异步代码**，将保存下来的值拿出来使用，这时候 a = 10

:::tip
上述解释中提到了 `await` 内部实现了 `generator`，其实 `await` 就是 `generator` 加上 `Promise` 的语法糖，且内部实现了自动执行 `generator`
:::

## Proxy

Proxy 是 ES6 中新增的功能，可以理解成，在目标对象之前架设一层 **「拦截」**，外界对该对象的访问，都必须先通过这层**拦截**，因此提供了一种机制，可以对外界的访问进行**过滤**和**改写**。

Proxy 这个词的原意是代理，用在这里表示由它来 **「代理」** 某些操作，可以译为 **「代理器」**

```js {4,8}
var obj = new Proxy(
  {},
  {
    get: function(target, key, receiver) {
      console.log(`getting ${key}!`)
      return Reflect.get(target, key, receiver)
    },
    set: function(target, key, value, receiver) {
      console.log(`setting ${key}!`)
      return Reflect.set(target, key, value, receiver)
    }
  }
)

obj.count = 1
//  setting count!
++obj.count
//  getting count!
//  setting count!
console.log(obj.count)
//  getting count!
//  2
```

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110725.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110725.png)</a>

往下走

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110743.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110743.png)</a>

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110754.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110754.png)</a>

**key** 表示的是要进行设置的属性

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110805.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110805.png)</a>

**value** 表示要设置的值

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110816.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110816.png)</a>

**receiver** 将 **count: 1** 设置到 **Proxy** 对象中

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110831.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110831.png)</a>

之后运行 `++obj.count`

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110854.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110854.png)</a>

要运行 **++** 之前，先要**读取**到 **obj.count** 属性的值，所以这里触发了 **get** 方法

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110934.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110934.png)</a>

这时的 **target** 目标对象中，**count** 的属性值为 **1**

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110956.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110956.png)</a>

get 方法**读取**到 count 的值之后，就执行 **++** 操作，就触发了 set 方法，同时可以发现，在 set 方法里的 value 参数从 1 变为了 2

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111023.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111023.png)</a>

往后走，到了 console.log ，输出 obj.count 的值，这时就触发了 get 方法，**只要读取值就会被 get 方法代理拦截**

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111048.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111048.png)</a>

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111058.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111058.png)</a>

这就是一个简单的 Proxy 代理器，上面的代码对一个空对象架设了一层拦截，重定义了属性的读取（get）和设置（set）行为，ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

`var proxy = new Proxy(target, handler);`

Proxy 对象的所有用法，都是上面这种形式，不同的只是 handler 参数的写法。

其中，**new Proxy()** 表示生成一个 Proxy 实例，**target** 参数表示所要拦截的**目标对象**，**handler** 参数也是一个对象，用来**定制拦截行为**。

下面是一个拦截读取属性的例子

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111111.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111111.png)</a>

这里我们在 get 方法中全部返回 35

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111124.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111124.png)</a>

> 只要是访问 proxy 对象下的属性，都会触发 get 方法拦截

所以这里访问 proxy 下的任何属性全部返回 35

:::warning
注意，要使得 Proxy 起作用，必须针对 Proxy 实例（上例是 proxy 对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。

如果 handler 没有设置任何拦截，那就等同于直接通向原对象。
:::

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111138.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111138.png)</a>

上面代码中，**handler 是一个空对象，没有任何拦截效果**，访问 proxy 就等同于访问 target

一个技巧是将 Proxy 对象，设置到 object.proxy 属性，从而可以在 object 对象上调用

具体详情看 [ES6 入门](https://es6.ruanyifeng.com/#docs/proxy)

如果要实现一个 Vue 中的响应式，还要在 get 中做**收集依赖**，在 set 里**派发更新**

:::tip
**proxy** 可以监听到任何方式的数据改变，唯一缺陷可能就是浏览器的 **兼容性** 不好了
:::
