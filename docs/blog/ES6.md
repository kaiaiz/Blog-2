---
comments: true
---

# ES6

## var、let 和 const 的区别

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

Promise 有三种状态：`pending（进行中）`、`fulfilled（已成功）`和 `rejected（已失败）`

在 `new Promise` 的时候就是处于 `pending` 状态，通过 `reslove` 和 `reject` 把一个进行中的 `promise` 修改为**已成功**或者**已失败**的状态

一旦将状态修改为已成功或者已失败， **promise** 的状态就凝固了，不能再改变

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
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

`Promise` 实现了链式调用，也就是说每次调用 `then` 之后返回的都是一个 `Promise`，并且是一个**全新**的 `Promise`，原因也是因为状态不可变。如果你在 `then` 中 使用了 `return`，那么 `return` 的值会被 `Promise.resolve()` 包装

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

then 方法可以传递两个函数，一个是成功后的回调函数，一个是失败后的回调

`Promise.prototype.then(onFulfilled, onRejected);`

:::warning
onFulfilled 将接收一个参数，参数值由当前 Promise 实例内部的 resolve() 方法传值决定

onRejected 将接收一个参数，参数值由当前 Promise 实例内部的 reject() 方法传值决定。
:::

```js
const p = function() {
  let num = Math.random()
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num > 0.8 ? resolve(num) : reject(num)
    }, 1000)
  })
}

p().then(
  val => {
    console.info(`Status switches to fulfilled, and the value is ${val}`)
  },
  err => {
    console.info(`Status switches to reject, and the value is ${err}`)
  }
)
```

上面的例子是创建一个随机数，如果大于 0.8 则返回 resolve() 成功，否则 reject() 失败

下面是一个用 promise 对象实现 Ajax 操作的例子

```js {8,10}
const getJSON = function(url) {
  const promise = new Promise((resolve, reject) => {
    const handler = function() {
      if (this.readyState !== 4) {
        return
      }
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    const client = new XMLHttpRequest()
    client.open('GET', url)
    client.onreadystatechange = handler
    client.responseType = 'json'
    client.setRequestHeader('Accept', 'application/json')
    client.send()
  })

  return promise
}

getJSON('/posts.json').then(
  function(json) {
    console.log('Contents: ' + json)
  },
  function(error) {
    console.error('出错了', error)
  }
)
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

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214173313.png)

接口返回的结果：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214173345.png)

将之前 `this.setData` 绑定操作全部整合在一起

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/Vue/20190214174043.png)

promise 还有 `.race` 的竞争方法，当某个 promise 率先完成后就触发，放在实际请求中就是当某个请求率先完成后就触发回调函数

promise 的 catch 方法，用于指定发生错误时的回调函数

```js
getJSON('/posts.json')
  .then(function(posts) {
    // ...
  })
  .catch(function(error) {
    // 处理 getJSON 和 前一个回调函数运行时发生的错误
    console.log('发生错误！', error)
  })
```

上面代码中，`getJSON` 方法返回一个 `Promise` 对象，如果该对象状态变为 `resolved`，则会调用 `then` 方法指定的回调函数；**如果异步操作抛出错误**，状态就会变为 `rejected`，就会调用 `catch` 方法指定的回调函数，处理这个错误

将之前随机数的例子进行改造

```js
const p = function() {
  let num = Math.random()
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num > 0.8 ? resolve(num) : reject(num)
    }, 1000)
  })
}

p()
  .then(
    val => {
      console.info(`Status switches to fulfilled, and the value is ${val}`)
    },
    err => {
      console.info(`Status switches to reject, and the value is ${err}`)
    }
  )
  .catch(err => {
    console.log('catch', err)
  })
```

如果这样写，则不会触发 catch 方法，而是返回 then 中的 err 回调

```js
const p = function() {
  let num = Math.random()
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num > 0.8 ? resolve(num) : reject(num)
    }, 1000)
  })
}

p()
  .then(val => {
    console.info(`Status switches to fulfilled, and the value is ${val}`)
  })
  .catch(err => {
    console.log('catch', err)
  })
```

如果将 then 中的 err 回调去掉，则会被 catch 方法捕获

一般在实战中，调用后端接口的时候，如果只是一个接口，就可以使用 .then().catch() 这种方式来捕获接口报错的异常，因为全部堆在 .then() 中会把代码变得很冗余，写在 .catch() 中也比较直观

一般来说，不要在 then 方法里面定义 Reject 状态的回调函数（即 then 的第二个参数），总是使用 `catch` 方法。

```js
// bad
promise.then(
  function(data) {
    // success
  },
  function(err) {
    // error
  }
)

// good
promise
  .then(function(data) {
    //cb
    // success
  })
  .catch(function(err) {
    // error
  })
```

那么如果调用多个接口，使用到了多个 .then() 方法来处理，该怎么办？

Promise 对象的错误具有 “冒泡” 性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 catch 语句捕获。

```js
getJSON('/post/1.json')
  .then(function(post) {
    return getJSON(post.commentURL)
  })
  .then(function(comments) {
    // some code
  })
  .catch(function(error) {
    // 处理前面三个 Promise 产生的错误
  })
```

另外，then 方法指定的回调函数，如果运行中抛出错误，也会被 catch 方法捕获。

```js
p.then(val => console.log('fulfilled:', val)).catch(err =>
  console.log('rejected', err)
)

// 等同于
p.then(val => console.log('fulfilled:', val)).then(null, err =>
  console.log('rejected:', err)
)
```

**.catch 其实是一个语法糖**

```js {2}
Promise.prototype.catch = function(fn) {
  return this.then(null, fn)
}
```

在之前的随机数例子中改造一下

```js
const p = function() {
  let num = Math.random()
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num > 0.1 ? resolve(num) : reject(num)
    }, 1000)
  })
}

const p1 = function() {
  let num = Math.random()
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num > 0.5 ? resolve(num) : reject(num)
    }, 2000)
  })
}

const p2 = function() {
  let num = Math.random()
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      num > 0.2 ? resolve(num) : reject(num)
    }, 3000)
  })
}

p()
  .then(val => {
    console.info(`P is fulfilled, and the value is ${val}`)
    return p1()
  })
  .then(val => {
    console.info(`P1 is fulfilled, and the value is ${val}`)
    return p2()
  })
  .then(val => {
    console.info(`P2 is fulfilled, and the value is ${val}`)
  })
  .catch(err => {
    console.log('catch', err)
  })
```

:::warning
如果第一个 then 出错，抛出错误，则会被 catch 捕获，之后第二个 then 和第三个 then 则不会执行，如果调用后端请求 API 接口也是这样，则需要谨慎测试
:::

但是 `Promise` 也有缺点，比如错误需要通过回调函数捕获，无法取消 Promise，一旦新建它就会立即执行，无法中途取消。

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

## 定时器函数

异步编程肯定少不了定时器，常用的定时器分别是：`setTimeout`，`setInterval`，`requestAnimationFrame`。

setTimeout ：很多人认为 setTimeout 是延时多久，那就应该是多久后执行。

其实这个观点是错误的，因为 `JS` 是单线程执行的，如果前面的代码影响了性能，就会导致 `setTimeout` 不会按期执行

`setInterval` :这个函数作用和 setTimeout 基本一直，只是该函数是每隔一段时间执行一次回调函数

通常来说不建议使用 setInterval ，第一，它和 setTimeout 一样，不能保证在预期的时间执行任务。第二，它存在执行累积的问题，请看以下代码：

```js
function demo() {
  setInterval(function() {
    console.log(2)
  }, 1000)
  sleep(2000)
}
demo()
```

以上代码在浏览器环境中，如果定时器执行过程中出现了**耗时操作**，**多个回调函数**会在耗时操作结束以后**同时执行**，这样可能就会带来性能上的问题。

如果你有循环定时器的需求，其实完全可以通过 `requestAnimationFrame` 来实现

大多数电脑显示器的刷新频率是 60Hz，大概相当于每秒钟重绘 60 次。大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会有提升。因此，最平滑动画的最佳循环间隔是 **1000ms/60**，约等于 **16.6ms**

requestAnimationFrame 自带函数节流功能，基本可以保证在 16.6 毫秒内只执行一次（不掉帧的情况下），并且该函数的延时效果是精确的

而 `setTimeout` 和 `setInterval` 的问题是，它们都不精确。它们的内在运行机制决定了时间间隔参数实际上只是指定了把动画代码添加到浏览器 UI 线程队列中以等待执行的时间。如果队列前面已经加入了其他任务，那动画代码就要等前面的任务完成后再执行

`requestAnimationFrame` 采用系统时间间隔，保持最佳绘制效率，不会因为间隔时间过短，造成过度绘制，增加开销；也不会因为间隔时间太长，使用动画卡顿不流畅，让各种网页动画效果能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果

requestAnimationFrame 使用：

requestAnimationFrame 使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。**它返回一个整数，表示定时器的编号**，这个值可以传递给 `cancelAnimationFrame` 用于**取消**这个函数的执行

`requestID = requestAnimationFrame(callback)`

具体在浏览器中运行的实例：

```js
//控制台输出 1 和 'a'
var timer = window.requestAnimationFrame(function() {
  console.log('a')
})
console.log(timer) //1
```

`cancelAnimationFrame` 方法用于取消定时器:

```js
//控制台什么都不输出
var timer = requestAnimationFrame(function() {
  console.log('a')
})
cancelAnimationFrame(timer)
```

也可以直接使用返回值进行取消

```js
// 默认从 1 开始
var timer = requestAnimationFrame(function() {
  console.log(0)
})
cancelAnimationFrame(1)
```

兼容性问题：IE9 - 浏览器不支持该方法，可以使用 setTimeout 来兼容

「严格兼容」

```js
if (!window.requestAnimationFrame) {
  var lastTime = 0
  window.requestAnimationFrame = function(callback) {
    var currTime = new Date().getTime()
    var timeToCall = Math.max(0, 16.7 - (currTime - lastTime))
    var id = window.setTimeout(function() {
      callback(currTime + timeToCall)
    }, timeToCall)
    lastTime = currTime + timeToCall
    return id
  }
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id)
  }
}
```

应用：现在分别使用 setInterval、setTimeout 和 requestAnimationFrame 这三个方法制作一个简单的进制度效果

1. setInterval

```js
<div id="myDiv" style="background-color: lightblue;width: 0;height: 20px;line-height: 20px;">0%</div>
<button id="btn">run</button>
<script>
var timer;
btn.onclick = function(){
    clearInterval(timer);
    myDiv.style.width = '0';
    timer = setInterval(function(){
        if(parseInt(myDiv.style.width) < 500){
            myDiv.style.width = parseInt(myDiv.style.width) + 5 + 'px';
            myDiv.innerHTML = parseInt(myDiv.style.width)/5 + '%';
        }else{
            clearInterval(timer);
        }
    },16);
}
</script>
```

2. setTimeout

```js
<div id="myDiv" style="background-color: lightblue;width: 0;height: 20px;line-height: 20px;">0%</div>
<button id="btn">run</button>
<script>
var timer;
btn.onclick = function(){
    clearTimeout(timer);
    myDiv.style.width = '0';
    timer = setTimeout(function fn(){
        if(parseInt(myDiv.style.width) < 500){
            myDiv.style.width = parseInt(myDiv.style.width) + 5 + 'px';
            myDiv.innerHTML = parseInt(myDiv.style.width)/5 + '%';
            timer = setTimeout(fn,16);
        }else{
            clearTimeout(timer);
        }
    },16);
}
</script>
```

3. requestAnimationFrame

```js
<div id="myDiv" style="background-color: lightblue;width: 0;height: 20px;line-height: 20px;">0%</div>
<button id="btn">run</button>
<script>
var timer;
btn.onclick = function(){
    myDiv.style.width = '0';
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn(){
        if(parseInt(myDiv.style.width) < 500){
            myDiv.style.width = parseInt(myDiv.style.width) + 5 + 'px';
            myDiv.innerHTML = parseInt(myDiv.style.width)/5 + '%';
            timer = requestAnimationFrame(fn);
        }else{
            cancelAnimationFrame(timer);
        }
    });
}
</script>
```

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

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110725.png)

往下走

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110743.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110754.png)

**key** 表示的是要进行设置的属性

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110805.png)

**value** 表示要设置的值

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110816.png)

**receiver** 将 **count: 1** 设置到 **Proxy** 对象中

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110831.png)

之后运行 `++obj.count`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110854.png)

要运行 **++** 之前，先要**读取**到 **obj.count** 属性的值，所以这里触发了 **get** 方法

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110934.png)

这时的 **target** 目标对象中，**count** 的属性值为 **1**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123110956.png)

get 方法**读取**到 count 的值之后，就执行 **++** 操作，就触发了 set 方法，同时可以发现，在 set 方法里的 value 参数从 1 变为了 2

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111023.png)

往后走，到了 console.log ，输出 obj.count 的值，这时就触发了 get 方法，**只要读取值就会被 get 方法代理拦截**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111048.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111058.png)

这就是一个简单的 Proxy 代理器，上面的代码对一个空对象架设了一层拦截，重定义了属性的读取（get）和设置（set）行为，ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

`var proxy = new Proxy(target, handler);`

Proxy 对象的所有用法，都是上面这种形式，不同的只是 handler 参数的写法。

其中，**new Proxy()** 表示生成一个 Proxy 实例，**target** 参数表示所要拦截的**目标对象**，**handler** 参数也是一个对象，用来**定制拦截行为**。

下面是一个拦截读取属性的例子

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111111.png)

这里我们在 get 方法中全部返回 35

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111124.png)

> 只要是访问 proxy 对象下的属性，都会触发 get 方法拦截

所以这里访问 proxy 下的任何属性全部返回 35

:::warning
注意，要使得 Proxy 起作用，必须针对 Proxy 实例（上例是 proxy 对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。

如果 handler 没有设置任何拦截，那就等同于直接通向原对象。
:::

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/designMode/20190123111138.png)

上面代码中，**handler 是一个空对象，没有任何拦截效果**，访问 proxy 就等同于访问 target

一个技巧是将 Proxy 对象，设置到 object.proxy 属性，从而可以在 object 对象上调用

具体详情看 [ES6 入门](https://es6.ruanyifeng.com/#docs/proxy)

如果要实现一个 Vue 中的响应式，还要在 get 中做**收集依赖**，在 set 里**派发更新**

:::tip
**proxy** 可以监听到任何方式的数据改变，唯一缺陷可能就是浏览器的 **兼容性** 不好了
:::
