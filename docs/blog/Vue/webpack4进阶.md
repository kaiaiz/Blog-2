# webpack4 进阶

## 十六、打包自定义函数库

[demo16 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo16)

新建 **index.js**、**math.js**、**string.js**

```js
// index.js
import * as math from './math'
import * as string from './string'

export default { math, string }

// math.js
export function add(a, b) {
  return a + b
}

export function minus(a, b) {
  return a - b
}

export function multiply(a, b) {
  return a * b
}

export function division(a, b) {
  return a / b
}

// string.js
export function join(a, b) {
  return a + ' ' + b
}
```

代码写完，使用 webpack 打包，安装 webpack，-D 表示 --save-dev 的简写

```bash
npm i webpack webpack-cli -D
```

修改 package.json

```json
{
  "name": "library",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack"
  },
  "keywords": [],
  "author": "xh",
  "license": "MIT",
  "devDependencies": {
    "webpack": "^4.29.6",
    "webpack-cli": "^3.3.0"
  }
}
```

`"license": "MIT"`表示完全开源的协议，`name` 表示你的组件库的名称

新建 webpack.config.js 并配置

```js
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library.js'
  }
}
```

运行打包命令，生成 library.js 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321153115.png)

这个文件就可以在项目中用了，但是我们现在是要做一个开源库，是给别人用的，别人可能会这么用

```js
// ES module
import library from 'library'

// CommonJS
const library = require('library')

// AMD
require(['library'], function() {})
```

如果我们要支持这三种形式的使用，可以在 webpack 里配置，加上 **libraryTarget** 参数

```js {9}
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library.js',
    libraryTarget: 'umd'
  }
}
```

当然，如果你希望用户还可以使用 script 标签的形式引入

`<script src="library.js"></script>`

用户希望可以通过 library 全局变量来使用，比如 library.math 要怎么办

可以再配置一个参数，叫 **library**

```js {9}
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library.js',
    library: 'root', // root 可以随便更换，不是固定值
    libraryTarget: 'umd'
  }
}
```

umd 是支持前面三种语法，但是不支持全局变量这种用法，如果配置了 library，打包之后就会将代码挂载到 **root** 这个全局变量上，通过 **script** 来引入 library，现在来打包一下，打包完之后来测试用 script 标签来引入我们写的库

在 dist 目录下新建个 index.html 文件，并打开页面

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>自定义库</title>
    <script src="./library.js"></script>
  </head>
  <body></body>
</html>
```

在控制台中输入 root，回车，就能看到我们前面封装的函数了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321154920.png)

`libraryTarget: 'umd'` 如果将 **umd** 改为 **this**

再去打包，在控制台输入 **this.root** 也能看到效果

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321155409.png)

`libraryTarget` 也可以填 **window**，如果在 node 环境下也可以使用 **global**

**不过一般我们都是使用 umd**

还有一种情况要注意，我们现在写的 string.js 我觉得写的不好，lodash 写的更好，我要引入这个第三方库，来代替我写的一些功能

`npm install lodash`

```js
// string.js
import _ from 'lodash'

export function join(a, b) {
  return _.join([a, b], ' ')
}
```

重新打包，体积为 70kb，因为我们也把 lodash 也打包进去了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321160054.png)

别人要使用我们的库的话，需要这样 `import library from 'library'`，也许别人也会用到 lodash 库，结果变成了这样：

```js
import _ from 'lodash'
import library from 'library'
```

最终用户的代码中就会存在**两份** lodash 的代码，这种情况就要再去更改一下我们的 webpack 配置

```js {6}
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  externals: ['lodash'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library.js',
    library: 'root',
    libraryTarget: 'umd'
  }
}
```

[externals](https://webpack.js.org/configuration/externals) 会在打包的过程中，如果遇到了 lodash 这个库，就不会打包进去，可以写成**数组**形式也可以是**字符串**，更改完后再次打包

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321160507.png)

可以发现我们库里使用的 lodash 并没有被打包进去，体积只有 1kb

这个时候别人再次使用我们的 library 这个库，**如果不引入 lodash，则会失败**，别人在使用 library 之前要先引入 lodash

如果改为 `externals: 'lodash'`，则使用的时候为，`import lodash from lodash`，而不能用 _ 下划线来代替 lodash， `import _ from lodash`

如果要让别人使用你的库，其实就是使用你打包后的文件，需要先在 package.json，将 main: index.js 改为 main: ./dist/library.js，通过 **npm** **发布**之前，你要确保你的库的 name 不会和别人上线的 name 冲突，改一个有特点的 name，来确保能发布成功，如 `library-xh-2019`，感兴趣的可以自己去研究一下如何通过 npm 发布

```json {2,5}
{
  "name": "library-xh-2019",
  "version": "1.0.0",
  "description": "",
  "main": "./dist/library.js",
  "scripts": {
    "build": "webpack"
  },
  "keywords": [],
  "author": "xh",
  "license": "MIT",
  "devDependencies": {
    "webpack": "^4.29.6",
    "webpack-cli": "^3.3.0"
  },
  "dependencies": {
    "lodash": "^4.17.11"
  }
}
```

## 十七、PWA 配置

[demo17 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo17)

本节使用 [demo15](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo15) 的代码为基础

我们来模拟平时开发中，将打包完的代码防止到服务器上的操作，首先打包代码 `npm run build`

然后安装一个插件 `npm i http-server -D`

在 package.json 中配置一个 script 命令

```json {3}
{
  "scripts": {
    "start": "http-server dist",
    "dev": "webpack-dev-server --open --config ./build/webpack.dev.conf.js",
    "build": "webpack --config ./build/webpack.prod.conf.js"
  }
}
```

运行 `npm run start`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321171751.png)

现在就起了一个服务，端口是 8080，现在访问 **http://127.0.0.1:8080** 就能看到效果了

:::warning 注意

如果你有在跑别的项目，端口也是 8080，端口就冲突，记得先关闭其他项目的 8080 端口，再 `npm run start`

:::

我们按 ctrl + c 关闭 http-server 来模拟**服务器挂了**的场景，再访问 **http://127.0.0.1:8080** 就会是这样

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321172023.png)

页面访问不到了，因为我们服务器挂了，PWA 是什么技术呢，它可以在你第一次访问成功的时候，做一个缓存，当服务器挂了之后，你依然能够访问这个网页

首先安装一个插件：**workbox-webpack-plugin**

```bash
npm i workbox-webpack-plugin -D
```

只有要上线的代码，才需要做 PWA 的处理，打开 **webpack.prod.conf.js**

```js
const WorkboxPlugin = require('workbox-webpack-plugin') // 引入 PWA 插件

const prodConfig = {
  plugins: [
    // 配置 PWA
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ]
}
```

重新打包，在 dist 目录下会多出 `service-worker.js` 和 `precache-manifest.js` 两个文件，通过这两个文件就能使我们的网页支持 PWA 技术，**service-worker.js** 可以理解为另类的缓存

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321172747.png)

还需要去业务代码中使用 **service-worker**

在 app.js 中加上以下代码

```js
// 判断该浏览器支不支持 serviceWorker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('service-worker registed')
      })
      .catch(error => {
        console.log('service-worker registed error')
      })
  })
}
```

重新打包，然后运行 `npm run start` 来模拟服务器上的操作，最好用无痕模式打开 **http://127.0.0.1:8080** ，打开控制台

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321174122.png)

现在文件已经被缓存住了，现在 ctrl + c 关闭服务，再次刷新页面也还是能显示的

## 十八、TypeScript 配置

[demo18 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo18)

[TypeScript](https://www.tslang.cn/) 是 JavaScript 类型的超集，它可以编译成纯 JavaScript

新建文件夹，`npm init -y`，`npm i webpack webpack-cli -D`，新建 src 目录，创建 **index.ts** 文件，这段代码在浏览器上是运行不了的，需要我们打包编译，转成 js

```ts
class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
  greet() {
    return 'Hello, ' + this.greeting
  }
}

let greeter = new Greeter('world')

alert(greeter.greet())
```

```bash
npm i ts-loader typescript -D
```

新建 webpack.config.js 并配置

```js {9}
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

在 package.json 中配置 script

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

运行 `npm ruh build`，报错了，缺少 **tsconfig.json** 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322095022.png)

:::tip

当打包 typescript 文件的时候，需要在项目的根目录下创建一个 tsconfig.json 文件

:::

以下为简单配置，更多详情看[官网](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

```json
{
  "compileerOptions": {
    "outDir": "./dist", // 写不写都行
    "module": "es6", // 用 es6 模块引入 import
    "target": "es5", // 打包成 es5
    "allowJs": true // 允许在 ts 中也能引入 js 的文件
  }
}
```

再次打包，打开 bundle.js 文件，**将代码全部拷贝到浏览器控制台上**，使用这段代码，可以看到弹窗出现 Hello,world，说明 ts 编译打包成功

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322100409.png)

#### 引入第三方库

```bash
npm i lodash
```

```js {9}
import _ from 'lodash'

class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
  greet() {
    return _.join()
  }
}

let greeter = new Greeter('world')

alert(greeter.greet())
```

lodash 的 join 方法需要我们传递参数，但是现在我们什么都没传，也没有报错，我们使用 typescript 就是为了类型检查，在引入第三方库的时候也能如此，可是现在缺并没有报错或者提示

我们还要安装一个 lodash 的 typescript 插件，这样就能识别 lodash 方法中的参数，一旦使用的不对就会报错出来

```bash
npm i @types/lodash -D
```

安装完以后可以发现下划线 \_ 报错了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322101450.png)

需要改成 `import * as _ from 'lodash'`，将 join 方法传递的参数删除，还可以发现 join 方法的报错，这就体现了 typescript 的优势，同理，引入 jQuery 也要引入一个 jQuery 对应的类型插件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322101701.png)

**如何知道使用的库需要安装对应的类型插件呢?**

打开[TypeSearch](https://microsoft.github.io/TypeSearch/)，在这里对应的去搜索你想用的库有没有类型插件，如果有只需要 `npm i @types/jquery -D` 即可

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322102406.png)

## 十九、Eslint 配置

[demo19 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo19)

创建一个空文件夹，`npm init -y`，`npm webpack webpack-cli -D` 起手式，之后安装 eslint 依赖

```bash
npm i eslint -D
```

使用 npx 运行此项目中的 eslint 来初始化配置，`npx eslint --init`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322112303.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322141216.png)

这里会有选择是 React/Vue/JavaScript，我们统一都先选择 JavaScript。选完后会在项目的根目录下新建一个 `.eslintrc.js` 配置文件

```js
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: 'eslint:recommended',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {}
}
```

里面就是 eslint 的一些规范，也可以定义一些规则，具体看 [eslint 配置规则](https://cn.eslint.org/docs/user-guide/configuring)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322140558.png)

在 index.js 中随便写点代码来测试一下 eslint

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322141304.png)

eslint 报错提示，变量定义后却没有使用，如果在编辑器里没出现报错提示，需要在 vscode 里先安装一个 eslint 扩展，它会根据你当前目录的下的 `.eslintrc.js` 文件来做作为校验的规则

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322141853.png)

也可以通过命令行的形式，让 eslint 校验整个 src 目录下的文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322141416.png)

如果你觉得某个规则很麻烦，想屏蔽掉某个规则的时候，可以这样，根据 eslint 的报错提示，比如上面的 `no-unused-vars`，将这条规则复制一下，在 `.eslintrc.js` 中的 rules 里配置一下，`"no-unused-vars": 0`，0 表示禁用，保存后，就不会报错了，但是这种方式是适用于**全局的配置**，如果你只想在某一行代码上屏蔽掉 eslint 校验，可以这样做

```js
/* eslint-disable no-unused-vars */
let a = '1'
```

这个 eslint 的 vscode 扩展和 webpack 是没有什么关联的，我们现在要讲的是如何在 webpack 里使用 eslint，首先安装一个插件

```bash
npm i eslint-loader -D
```

在 webpack.config.js 中进行配置

```js {16}
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    app: './src/index.js' // 需要打包的文件入口
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 使用正则来匹配 js 文件
        exclude: /nodes_modules/, // 排除依赖包文件夹
        use: {
          loader: 'eslint-loader' // 使用 eslint-loader
        }
      }
    ]
  },
  output: {
    // eslint-disable-next-line no-undef
    publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: 'bundle.js' // 打包后生产的 js 文件
  }
}
```

由于 webpack 配置文件也会被 eslint 校验，这里我先写上注释，关闭校验

如果你有使用 babel-loader 来转译，则 loader 应该这么写

`loader: ['babel-loader', 'eslint-loader']`

rules 的执行顺序是从右往左，从下往上的，先经过 eslint 校验判断代码是否符合规范，然后再通过 babel 来做转移

配置完 webpack.config.js，我们将 index.js 还原回之前报错的状态，不要使用注释关闭校验，然后运行打包命令，记得去 package.json 配置 script

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322144101.png)

会在打包的时候，提示代码不合格，不仅仅是生产环境，开发环境也可以配置，可以将 eslint-loader 配置到 webpack 的公共模块中，这样更有利于我们检查代码规范

如：设置 fix 为 true，它会帮你自动修复一些错误，不能自动修复的，还是需要你自己手动修复

```js
{
 loader: 'eslint-loader', // 使用 eslint-loader
  options: {
    fix: true
  }
}
```

关于 eslint-loader，webpack 的官网也给出了[配置](https://webpack.js.org/loaders/eslint-loader)，感兴趣的朋友自己去看一看

## 二十、使用 DLLPlugin 加快打包速度

[demo20 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo20)

本节使用 [demo15](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo15) 的代码为基础

我们先安装一个 lodash 插件 `npm i lodash`，并在 app.js 文件中写入

```js
import _ from 'lodash'
console.log(_.join(['hello', 'world'], '-'))
```

在 build 文件夹下新建 webpack.dll.js 文件

```js {11}
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    vendors: ['lodash', 'jquery']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]'
  }
}
```

这里使用 **library**，忘记的朋友可以回顾一下第十六节，自定义函数库里的内容，定义了 library 就相当于挂载了这个全局变量，只要在控制台输入全局变量的名称就可以显示里面的内容，比如这里我们是 `library: '[name]'` 对应的 name 就是我们在 entry 里定义的 **vendors**

在 package.json 中的 script 再新增一个命令

```json {5}
{
  "scripts": {
    "dev": "webpack-dev-server --open --config ./build/webpack.dev.conf.js",
    "build": "webpack --config ./build/webpack.prod.conf.js",
    "build:dll": "webpack --config ./build/webpack.dll.js"
  }
}
```

运行 `npm run build:dll`，会生成 dll 文件夹，并且文件为 `vendors.dll.js`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322160815.png)

打开文件可以发现 lodash 已经被打包到了 dll 文件中

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322160654.png)

那我们要如何使用这个 vendors.dll.js 文件呢

需要再安装一个依赖 `npm i add-asset-html-webpack-plugin`，它会将我们打包后的 dll.js 文件注入到我们生成的 index.html 中

在 webpack.base.conf.js 文件中引入

```js
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

module.exports = {
  plugins: [
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '../dll/vendors.dll.js') // 对应的 dll 文件路径
    })
  ]
}
```

使用 `npm run dev` 来打开网页

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322161305.png)

现在我们已经把第三方模块单独打包成了 dll 文件，并使用

但是现在使用第三方模块的时候，要用 **dll** 文件，而不是使用 **/node_modules/** 中的库，继续来修改 **webpack.dll.js** 配置

```js
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    vendors: ['lodash', 'jquery']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      // 用这个插件来分析打包后的这个库，把库里的第三方映射关系放在了这个 json 的文件下，这个文件在 dll 目录下
      path: path.resolve(__dirname, '../dll/[name].manifest.json')
    })
  ]
}
```

保存后重新打包 dll，`npm run build:dll`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322162313.png)

修改 webpack.base.conf.js 文件，添加 **webpack.DllReferencePlugin** 插件

```js
module.exports = {
  plugins: [
    // 引入我们打包后的映射文件
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '../dll/vendors.manifest.json')
    })
  ]
}
```

之后再 webpack 打包的时候，就可以结合之前的全局变量 **vendors** 和 这个新生成的 **vendors.manifest.json** 映射文件，然后来对我们的源代码进行分析，一旦分析出使用第三方库是在 **vendors.dll.js** 里，就会去使用 **vendors.dll.js**，不会去使用 **/node_modules/** 里的第三方库了

再次打包 `npm run build`，可以把 **webpack.DllReferencePlugin** 模块注释后再打包对比一下

注释前 4000ms 左右，注释后 4300ms 左右，虽然只是快了 300ms，但是我们目前只是实验性的 demo，实际项目中，比如拿 vue 来说，vue，vue-router，vuex，element-ui，axios 等第三方库都可以打包到 dll.js 里，那个时候的打包速度就能提升很多了

还可以继续拆分，修改 webpack.dll.js 文件

```js {7,8}
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    lodash: ['lodash'],
    jquery: ['jquery']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, '../dll/[name].manifest.json') // 用这个插件来分析打包后的这个库，把库里的第三方映射关系放在了这个 json 的文件下，这个文件在 dll 目录下
    })
  ]
}
```

运行 `npm run build:dll`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322165539.png)

可以把之前打包的 **vendors.dll.js** 和 **vendors.manifest.json** 映射文件给删除掉

然后再修改 webpack.base.conf.js

```js
module.exports = {
  plugins: [
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '../dll/lodash.dll.js')
    }),
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '../dll/jquery.dll.js')
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '../dll/lodash.manifest.json')
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '../dll/jquery.manifest.json')
    })
  ]
}
```

保存后运行 `npm run dev`，看看能不能成功运行

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322165928.png)

这还只是拆分了两个第三方模块，就要一个个配置过去，有没有什么办法能简便一点呢? 有!

这里使用 node 的 api，fs 模块来读取文件夹里的内容，创建一个 plugins 数组用来存放公共的插件

```js
const fs = require('fs')

const plugins = [
  // 开发环境和生产环境二者均需要的插件
  new HtmlWebpackPlugin({
    title: 'webpack4 实战',
    filename: 'index.html',
    template: path.resolve(__dirname, '..', 'index.html'),
    minify: {
      collapseWhitespace: true
    }
  }),
  new webpack.ProvidePlugin({ $: 'jquery' })
]

const files = fs.readdirSync(path.resolve(__dirname, '../dll'))
console.log(files)
```

写完可以先输出一下，把 plugins 给注释掉，`npm run build` 打包看看输出的内容，可以看到文件夹中的内容以数组的形式被打印出来了，之后我们对这个数组做一些循环操作就行了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190322171146.png)

完整代码：

```js
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

// 存放公共插件
const plugins = [
  // 开发环境和生产环境二者均需要的插件
  new HtmlWebpackPlugin({
    title: 'webpack4 实战',
    filename: 'index.html',
    template: path.resolve(__dirname, '..', 'index.html'),
    minify: {
      collapseWhitespace: true
    }
  }),
  new webpack.ProvidePlugin({ $: 'jquery' })
]

// 自动引入 dll 中的文件
const files = fs.readdirSync(path.resolve(__dirname, '../dll'))
files.forEach(file => {
  if (/.*\.dll.js/.test(file)) {
    plugins.push(
      new AddAssetHtmlWebpackPlugin({
        filepath: path.resolve(__dirname, '../dll', file)
      })
    )
  }
  if (/.*\.manifest.json/.test(file)) {
    plugins.push(
      new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, '../dll', file)
      })
    )
  }
})

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 1000, // size <= 1KB
              outputPath: 'images/'
            }
          },
          // img-loader for zip img
          {
            loader: 'image-webpack-loader',
            options: {
              // 压缩 jpg/jpeg 图片
              mozjpeg: {
                progressive: true,
                quality: 65 // 压缩率
              },
              // 压缩 png 图片
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:5].min.[ext]',
            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
            publicPath: 'fonts/',
            outputPath: 'fonts/'
          }
        }
      }
    ]
  },
  plugins,
  performance: false
}
```

使用 `npm run dev` 打开网页也没有问题了，这样自动注入 dll 文件也搞定了，之后还要再打包第三方库只要添加到 **webpack.dll.js** 里面的 `entry` 属性中就可以了

## 二十一、多页面打包配置

本节使用 [demo20](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo20) 的代码为基础

在 src 目录下新建 list.js 文件，里面写 `console.log('这里是 list 页面')`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190323132604.png)

在 webpack.base.conf.js 中配置 entry，配置两个入口

```js
module.exports = {
  entry: {
    app: './src/app.js',
    list: './src/list.js'
  }
}
```

如果现在我们直接 `npm run build` 打包，在打包自动生成的 index.html 文件中会发现 list.js 也被引入了，说明多入口打包成功，但并没有实现**多个页面**的打包，我想打包出 **index.html** 和 **list.html** 两个页面，并且在 index.html 中引入 **app.js**，在 list.html 中引入 **list.js**，该怎么做?

为了方便演示，先将 `webpack.prod.conf.js` 中 `cacheGroups` 新增一个 `default` 属性，自定义 name

```js
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      jquery: {
        name: 'jquery', // 单独将 jquery 拆包
        priority: 15,
        test: /[\\/]node_modules[\\/]jquery[\\/]/
      },
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors'
      },
      default: {
        name: 'code-segment'
      }
    }
  }
}
```

打开 `webpack.base.conf.js` 文件，将 `HtmlWebpackPlugin` 拷贝一份，使用 `chunks` 属性，将需要打包的模块对应写入

```js {7,13}
// 存放公共插件
const plugins = [
  new HtmlWebpackPlugin({
    title: 'webpack4 实战',
    filename: 'index.html',
    template: path.resolve(__dirname, '..', 'index.html'),
    chunks: ['app', 'vendors', 'code-segment', 'jquery', 'lodash']
  }),
  new HtmlWebpackPlugin({
    title: '多页面打包',
    filename: 'list.html',
    template: path.resolve(__dirname, '..', 'index.html'),
    chunks: ['list', 'vendors', 'code-segment', 'jquery', 'lodash']
  }),
  new CleanWebpackPlugin(),
  new webpack.ProvidePlugin({ $: 'jquery' })
]
```

打包后的 dist 目录下生成了两个 html

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190325144542.png)

打开 index.html 可以看到引入的是 app.js，而 list.html 引入的是 list.js，这就是 `HtmlWebpackPlugin` 插件的 `chunks` 属性，自定义引入的 js

如果要打包三个页面，再去 copy `HtmlWebpackPlugin`，通过在 entry 中配置，如果有四个，五个，这样手动的复制就比较麻烦了，可以写个方法自动生成 `HtmlWebpackPlugin` 配置

修改 `webpack.base.conf.js`

```js
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const makePlugins = configs => {
  // 基础插件
  const plugins = [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({ $: 'jquery' })
  ]

  // 根据 entry 自动生成 HtmlWebpackPlugin 配置，配置多页面
  Object.keys(configs.entry).forEach(item => {
    plugins.push(
      new HtmlWebpackPlugin({
        title: '多页面配置',
        template: path.resolve(__dirname, '..', 'index.html'),
        filename: `${item}.html`,
        chunks: [item, 'vendors', 'code-segment', 'jquery', 'lodash']
      })
    )
  })

  // 自动引入 dll 中的文件
  const files = fs.readdirSync(path.resolve(__dirname, '../dll'))
  files.forEach(file => {
    if (/.*\.dll.js/.test(file)) {
      plugins.push(
        new AddAssetHtmlWebpackPlugin({
          filepath: path.resolve(__dirname, '../dll', file)
        })
      )
    }
    if (/.*\.manifest.json/.test(file)) {
      plugins.push(
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, '../dll', file)
        })
      )
    }
  })

  return plugins
}

const configs = {
  entry: {
    index: './src/app.js',
    list: './src/list.js'
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 1000, // size <= 1KB
              outputPath: 'images/'
            }
          },
          // img-loader for zip img
          {
            loader: 'image-webpack-loader',
            options: {
              // 压缩 jpg/jpeg 图片
              mozjpeg: {
                progressive: true,
                quality: 65 // 压缩率
              },
              // 压缩 png 图片
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:5].min.[ext]',
            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
            publicPath: 'fonts/',
            outputPath: 'fonts/'
          }
        }
      }
    ]
  },
  performance: false
}

makePlugins(configs)

configs.plugins = makePlugins(configs)

module.exports = configs
```

再次打包后效果相同，如果还要增加页面，只要在 entry 中再引入一个 js 文件作为入口即可

:::tip

多页面配置其实就是定义多个 entry，配合 htmlWebpackPlugin 生成多个 html 页面

:::

## 二十二、编写 loader

新建文件夹，`npm init -y`，`npm i webpack webpack-cli -D`，新建 src/index.js，写入 `console.log('hello world')`

新建 `loaders/replaceLoader.js` 文件

```js
module.exports = function(source) {
  return source.replace('world', 'loader')
}
```

source 参数就是我们的源代码，这里是将源码中的 world 替换成 loader

新建 `webpack.config.js`

```js
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: [path.resolve(__dirname, './loaders/replaceLoader.js')] // 引入自定义 loader
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
}
```

目录结构：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190325165912.png)

打包后打开 dist/main.js 文件，在最底部可以看到 world 已经被改为了 loader，一个最简单的 loader 就写完了

添加 optiions 属性

```js
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: [
          {
            loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
            options: {
              name: 'xh'
            }
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
}
```

修改 replaceLoader.js 文件，保存后打包，输出看看效果

```js
module.exports = function(source) {
  console.log(this.query)
  return source.replace('world', this.query.name)
}
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190325170458.png)

打包后生成的文件也改为了 options 中定义的 name

更多的配置见官网 [API](https://webpack.js.org/api/loaders/#examples)，找到 Loader Interface，里面有个 this.query

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190325171141.png)

如果你的 options 不是一个对象，而是按字符串形式写的话，可能会有一些问题，这里官方推荐使用 [loader-utils](https://github.com/webpack/loader-utils#getoptions) 来获取 options 中的内容

安装 `npm i loader-utils -D`，修改 replaceLoader.js

```js
const loaderUtils = require('loader-utils')

module.exports = function(source) {
  const options = loaderUtils.getOptions(this)
  console.log(options)
  return source.replace('world', options.name)
}
```

`console.log(options)` 与 `console.log(this.query)` 输出内容一致

如果你想传递额外的信息出去，return 就不好用了，官网给我们提供了 [this.callback](https://webpack.js.org/api/loaders/#thiscallback) API，用法如下

```js
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
)
```

修改 replaceLoader.js

```js
const loaderUtils = require('loader-utils')

module.exports = function(source) {
  const options = loaderUtils.getOptions(this)
  const result = source.replace('world', options.name)

  this.callback(null, result)
}
```

目前没有用到 sourceMap(必须是此模块可解析的源映射)、meta(可以是任何内容(例如一些元数据)) 这两个可选参数，只将 result 返回回去，保存重新打包后，效果和 return 是一样的

如果在 loader 中写异步代码，会怎么样

```js
const loaderUtils = require('loader-utils')

module.exports = function(source) {
  const options = loaderUtils.getOptions(this)

  setTimeout(() => {
    const result = source.replace('world', options.name)
    return result
  }, 1000)
}
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326093218.png)

报错 loader 没有返回，这里使用 [this.async](https://webpack.js.org/api/loaders/#thisasync) 来写异步代码

```js {6}
const loaderUtils = require('loader-utils')

module.exports = function(source) {
  const options = loaderUtils.getOptions(this)

  const callback = this.async()

  setTimeout(() => {
    const result = source.replace('world', options.name)
    callback(null, result)
  }, 1000)
}
```

模拟一个同步 loader 和一个异步 loader

新建一个 `replaceLoaderAsync.js` 文件，将之前写的异步代码放入，修改 `replaceLoader.js` 为同步代码

```js
// replaceLoaderAsync.js

const loaderUtils = require('loader-utils')
module.exports = function(source) {
  const options = loaderUtils.getOptions(this)
  const callback = this.async()
  setTimeout(() => {
    const result = source.replace('world', options.name)
    callback(null, result)
  }, 1000)
}

// replaceLoader.js
module.exports = function(source) {
  return source.replace('xh', 'world')
}
```

修改 `webpack.config.js`，loader 的执行顺序是从下到上，先执行异步代码，将 world 改为 xh，再执行同步代码，将 xh 改为 world

```js
module: {
  rules: [
    {
      test: /.js/,
      use: [
        {
          loader: path.resolve(__dirname, './loaders/replaceLoader.js')
        },
        {
          loader: path.resolve(__dirname, './loaders/replaceLoaderAsync.js'),
          options: {
            name: 'xh'
          }
        }
      ]
    }
  ]
}
```

保存后打包，在 mian.js 中可以看到已经改为了 `hello world`，使用多个 loader 也完成了

如果有多个自定义 loader，每次都通过 `path.resolve(__dirname, xxx)` 这种方式去写，有没有更好的方法？

使用 `resolveLoader`，定义 modules，当你使用 loader 的时候，会先去 `node_modules` 中去找，如果没找到就会去 `./loaders` 中找

```js {8,9,10}
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  resolveLoader: {
    modules: ['node_modules', './loaders']
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: [
          {
            loader: 'replaceLoader.js'
          },
          {
            loader: 'replaceLoaderAsync.js',
            options: {
              name: 'xh'
            }
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
}
```

## 二十三、编写 plugin

首先新建一个文件夹，npm 起手式操作一番，具体的在前几节已经说了，不再赘述

在根目录下新建 plugins 文件夹，新建 `copyright-webpack-plugin.js`，一般我们用的都是 `xxx-webpack-plugin`，所以我们命名也按这样来，plugin 的定义是一个类

```js
class CopyrightWebpackPlugin {
  constructor() {
    console.log('插件被使用了')
  }
  apply(compiler) {}
}

module.exports = CopyrightWebpackPlugin
```

在 webpack.config.js 中使用，所以每次使用 plugin 都要使用 **new**，因为本质上 plugin 是一个类

```js
const path = require('path')
const CopyrightWebpackPlugin = require('./plugins/copyright-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  plugins: [new CopyrightWebpackPlugin()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
}
```

保存后打包，插件被使用了，只不过我们什么都没干

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326110404.png)

如果我们要传递参数，可以这样

```js
new CopyrightWebpackPlugin({
  name: 'xh'
})
```

同时在 `copyright-webpack-plugin.js` 中接收

```js
class CopyrightWebpackPlugin {
  constructor(options) {
    console.log('插件被使用了')
    console.log('options = ', options)
  }
  apply(compiler) {}
}

module.exports = CopyrightWebpackPlugin
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326110525.png)

我们先把 **constructor** 注释掉，在即将要把打包的结果，**放入 dist 目录之前**的这个时刻，我们来做一些操作

`apply(compiler) {}` compiler 可以看作是 webpack 的实例，具体见官网 [compiler-hooks](https://webpack.js.org/api/compiler-hooks)

hooks 是钩子，像 vue、react 的生命周期一样，找到 `emit` 这个时刻，将打包结果放入 dist 目录前执行，这里是个 `AsyncSeriesHook` 异步方法

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326111345.png)

```js {7}
class CopyrightWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'CopyrightWebpackPlugin',
      (compilation, cb) => {
        console.log(11)
        cb()
      }
    )
  }
}

module.exports = CopyrightWebpackPlugin
```

因为 **emit** 是**异步**的，可以通过 **tapAsync** 来写，当要把代码放入到 dist 目录之前，就会触发这个钩子，走到我们定义的函数里，如果你用 **tapAsync** 函数，记得最后要用 **cb()** ，tapAsync 要传递两个参数，第一个参数传递我们定义的插件名称

保存后再次打包，我们写的内容也输出了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326112156.png)

**compilation** 这个参数里存放了这次打包的所有内容，可以输出一下 `compilation.assets` 看一下

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326112425.png)

返回结果是一个对象，`main.js` 是 key，也就是打包后生成的文件名及文件后缀，我们可以来仿照一下

```js
class CopyrightWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'CopyrightWebpackPlugin',
      (compilation, cb) => {
        // 生成一个 copyright.txt 文件
        compilation.assets['copyright.txt'] = {
          source: function() {
            return 'copyright by xh'
          },
          size: function() {
            return 15 // 上面 source 返回的字符长度
          }
        }
        console.log('compilation.assets = ', compilation.assets)
        cb()
      }
    )
  }
}

module.exports = CopyrightWebpackPlugin
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326112915.png)

在 dist 目录下生成了 `copyright.txt` 文件

之前介绍的是异步钩子，现在使用同步钩子

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326135159.png)

```js
class CopyrightWebpackPlugin {
  apply(compiler) {
    // 同步钩子
    compiler.hooks.compile.tap('CopyrightWebpackPlugin', compilation => {
      console.log('compile')
    })

    // 异步钩子
    compiler.hooks.emit.tapAsync(
      'CopyrightWebpackPlugin',
      (compilation, cb) => {
        compilation.assets['copyright.txt'] = {
          source: function() {
            return 'copyright by xh'
          },
          size: function() {
            return 15 // 字符长度
          }
        }
        console.log('compilation.assets = ', compilation.assets)
        cb()
      }
    )
  }
}

module.exports = CopyrightWebpackPlugin
```

`chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/d3928cd4-4060-4f99-9bb8-91e6928b6e1a`

## 二十四、编写 Bundle

在 src 目录下新建三个文件 `word.js`、`message.js`、`index.js`，对应的代码：

```js
// word.js
export const word = 'hello'

// message.js
import { word } from './word.js'

const message = `say ${word}`

export default message

// index.js
import message from './message.js'

console.log(message)
```

新建 `bundle.js`

```js
const fs = require('fs')

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, 'utf-8')
  console.log(content)
}

moduleAnalyser('./src/index.js')
```

使用 node 的 **fs** 模块，读取文件信息，并在控制台输出，这里全局安装一个插件，来显示代码高亮，`npm i cli-highlight -g`，运行 `node bundle.js | highlight`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190326151614.png)

index.js 中的代码已经被输出到控制台上，而且代码有高亮，方便阅读，读取入口文件信息就完成了

现在我们要读取 index.js 文件中使用的 message.js 依赖，`import message from './message.js'`

安装一个第三方插件 `npm i @babel/parser`

[@babel/parser](https://babeljs.io/docs/en/babel-parser) 是 Babel 中使用的 JavaScript 解析器。

官网也提供了相应的示例代码，根据示例代码来仿照，修改我们的文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190327094416.png)

```js
const fs = require('fs')
const parser = require('@babel/parser')

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, 'utf-8')
  console.log(
    parser.parse(content, {
      sourceType: 'module'
    })
  )
}

moduleAnalyser('./src/index.js')
```

我们使用的是 es6 的 module 语法，所以 `sourceType: 'module'`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190327094244.png)

保存后运行，输出了 [AST (抽象语法树)](https://segmentfault.com/a/1190000016231512)，里面有一个 body 字段，我们输出这个字段

```js
const fs = require('fs')
const parser = require('@babel/parser')

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  console.log(ast.program.body)
}

moduleAnalyser('./src/index.js')
```

打印出了两个 Node 节点，第一个节点的 type 是 **ImportDeclaration**(引入的声明)，对照我们在 index.js 中写的 `import message from './message.js'`，第二个节点的 type 是 **ExpressionStatement** (表达式的声明)，对照我们写的 `console.log(message)`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190327101614.png)

使用 babel 来帮我们生成抽象语法树，我们再导入 `import message1 from './message1.js'` 再运行

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190327101753.png)

抽象语法树将我们的 js 代码转成了对象的形式，现在就可以遍历抽象语法树生成的节点对象中的 type，是否为 `ImportDeclaration`，就能找到代码中引入的依赖了

再借助一个工具 `npm i @babel/traverse`

```js
const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  traverse(ast, {
    ImportDeclaration({ node }) {
      console.log(node)
    }
  })
}

moduleAnalyser('./src/index.js')
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190327102638.png)

只打印了两个 **ImportDeclaration**，遍历结束，我们只需要取到依赖的文件名，在打印的内容中，每个节点都有个 `source` 属性，里面有个 `value` 字段，表示的就是文件路径及文件名

```js
const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  const dependencise = []
  traverse(ast, {
    ImportDeclaration({ node }) {
      dependencise.push(node.source.value)
    }
  })
  console.log(dependencise)
}

moduleAnalyser('./src/index.js')
```

保存完重新运行，输出结果：

```js
;['./message.js', './message1.js']
```

这样就对入口文件的依赖分析就分析出来了，现在把 index.js 中引入的 `message1.js` 的依赖给删除，这里有个注意点，打印出来的文件路径是相对路径，相对于 `src/index.js` 文件，但是我们打包的时候不能是入口文件(index.js)的相对路径，而应该是根目录的相对路径，借助 node 的 api，引入一个 path

```js
const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  const dependencise = []
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename)
      console.log(dirname)
      dependencise.push(node.source.value)
    }
  })
  // console.log(dependencise)
}

moduleAnalyser('./src/index.js')
```

输出为 `./src`，继续修改

```js
ImportDeclaration({ node }) {
  const dirname = path.dirname(filename)
  const newFile = path.join(dirname, node.source.value)
  console.log(newFile)
  dependencise.push(node.source.value)
}
```

输出为 `src\message.js`

:::warning

windows 和 类 Unix(linux/mac)，路径是有区别的。windows 是用反斜杠 \ 分割目录或者文件的，而在类 Unix 的系统中是用的 /。

:::

由于我是 windows 系统，所以这里输出为 `src\message.js`，而类 Unix 输出的为 `src/message.js`

`.\src\message.js` 这个路径是我们真正打包时要用到的路径

```bash
newFile .\src\message.js
[ '.\\src\\message.js' ]
```

既存一个相对路径，又存一个绝对路径

```js
const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  const dependencise = {}
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename)
      const newFile = '.\\' + path.join(dirname, node.source.value)
      console.log('newFile', newFile)
      dependencise[node.source.value] = newFile
    }
  })
  console.log(dependencise)
  return {
    filename,
    dependencise
  }
}

moduleAnalyser('./src/index.js')
```

```js
newFile .\src\message.js
{ './message.js': '.\\src\\message.js' }
```

因为我们写的代码是 es6，浏览器无法识别，还是需要 babel 来做转换

`npm i @babel/core @babel/preset-env`

```js
'use strict'

var _message = _interopRequireDefault(require('./message.js'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

console.log(_message.default)
```

```js
const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

const moduleAnalyser = filename => {
  const content = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  const dependencise = {}
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename)
      const newFile = '.\\' + path.join(dirname, node.source.value)
      dependencise[node.source.value] = newFile
    }
  })
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })
  return {
    filename,
    dependencise,
    code
  }
}

const moduleInfo = moduleAnalyser('./src/index.js')
console.log(moduleInfo)
```

```bash
{ filename: './src/index.js',
  dependencise: { './message.js': '.\\src\\message.js' },
  code:
   '"use strict";\n\nvar _message = _interopRequireDefault(require("./message.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log(_message.default);' }
```

分析入口文件
