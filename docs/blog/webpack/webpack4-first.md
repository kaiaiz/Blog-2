# webpack4 (一)

## 前言

此项目前 15 节基于 [Webpack4 渐进式教程](https://godbmw.com/passages/2019-03-04-please-mark/) 为基础，加上自己的实践和理解得出，感谢 **[godbmw](https://godbmw.com/)** 😄

前 15 节在 [Webpack4 渐进式教程](https://godbmw.com/passages/2018-07-29-webpack-demos-introduction/) 的基础上升级：

- 使用 **babel7**
- 配置 **.browserslistrc** 文件
- 使用 **mini-css-extract-plugin** 替代 **extract-text-webpack-plugin**
- 使用 **optimize-css-assets-webpack-plugin** 压缩 **css**
- 使用 **postcss** 为 **css** 加上各个浏览器前缀
- 使用 **image-webpack-loader** 处理图片

随后的章节以 **mooc** 网 [手把手带你掌握新版 Webpack4.0](https://coding.imooc.com/class/316.html) 整理的学习笔记，感谢 **DellLee** 老师 😄

:::tip 环境

OS: 「win10」

node: 「10.5.0」

npm: 「6.1.0」

webpack: 「4.29.6」

webpack-cli: 「3.2.3」

:::

每一个章节对应一个 demo 👉 [源码地址](https://github.com/ITxiaohao/webpack4-learn), clone 源码后注意运行 `npm install` 安装依赖

有错误请在**最底部留言**或者**发邮件**给我(**281885961@qq.com**)

## 一、搭建项目并打包 JS 文件

[demo1 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo01)

创建空文件夹，通过运行以下命令初始化 **package.json**

```bash
npm init -y
```

:::tip
npm init  用来初始化生成一个新的  package.json  文件。它会向用户提问一系列问题，如果你觉得不用修改默认配置，一路回车就可以了。
如果使用了 -y（代表 yes），则跳过提问阶段，直接生成一个新的  package.json  文件。
:::

引入 webpack4：

```bash
npm i webpack --save-dev
```

还需要  webpack-cli ，作为一个单独的包引入，如果不装 webpack-cli 是无法在命令行里使用 webpack 的

```bash
npm i webpack-cli --save-dev
```

此项目 webpack 版本如下：

```json
"webpack": "^4.29.6",
"webpack-cli": "^3.2.3"
```

现在打开  package.json  并添加一个  build(构建) 脚本：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164215.png)

尝试运行看看会发生什么：

```bash
npm run build
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164344.png)

在 webpack4 以前的版本中，必须在名为 webpack.config.js 的配置文件中 通过  entry  属性定义 entry point(入口点)，就像这样：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164413.png)

从 webpack4 开始，不再必须定义 entry point(入口点) ：它将默认为 **./src/index.js**

测试这个新功能，首先创建 ./src/index.js 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164918.png)

再运行 `npm run build` 试试

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303165055.png)

打包成功，并在当前的根目录中得到打包后的文件夹，也就是 **dist** 文件夹

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303165232.png)

它将查找 **./src/index.js** 作为默认入口点。 而且，它会在 **./dist/main.js** 中输出模块包，目前代码量小，可以格式化看效果

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305093607.png)

至此，打包 JS 结束

参考：[webpack 官网入门](https://webpack.js.org/guides/getting-started)

## 二、生产和开发模式

[demo2 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo02)

拥有 2 个配置文件在 webpack 中是的常见模式。

一个典型的项目可能有：

- 用于开发的配置文件，配置热更新、跨域配置、端口设置等
- 用于生产的配置文件，配置 js 压缩、代码拆分等

虽然较大的项目可能仍然需要 2 个配置文件，但在 webpack4 中，你可以在没有一行配置的情况下完成

webpack4 引入了  production(生产)  和  development(开发)  模式。

细心的朋友会发现在 `npm run build` 打包后会有一段报警提示

:::warning
'mode' 选项尚未设置，webpack 将回退到 'production'。 将 “mode” 选项设置为 'development' 或 'production' 以启用每个环境的默认值。
您还可以将其设置为 'none' 以禁用任何默认行为。 [了解更多](https://webpack.js.org/concepts/mode/)
:::

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305105906.png)

1. 打开 package.json 并填充 script  部分，如下所示：

```json
"dev": "webpack --mode development",
"build": "webpack --mode production"
```

2. 运行 `npm run dev`

打开 ./dist/main.js 文件，是一个 bundle(包) 文件，并没有压缩！

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305111034.png)

3. 运行 `npm run build`

可以看到 ./dist/main.js 文件已经被压缩了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190318110052.png)

其实在终端里也能发现，看构建完的大小， dev 模式下文件大小是 3.8 KB， prod 模式下文件大小仅为 960 字节

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305111311.png)

production mode(生产模式)  可以开箱即用地进行各种优化。 包括压缩，作用域提升，tree-shaking 等。

另一方面，development mode(开发模式) 针对速度进行了优化，仅仅提供了一种不压缩的 bundle

在 webpack4 中，可以在没有一行配置的情况下完成任务！ 只需定义 –mode 参数即可获得所有内容！

<!-- 在 vue 中也可以使用 -mode 来做相应处理，感兴趣的朋友可以看看 [vue-cli3 axios 封装](http://localhost:8080/blog/Vue/Vue-Cli3.html#axios-%E5%B0%81%E8%A3%85-api)，在这一节里通过配置 mode 来配置不同的跨域前缀 -->

## 三、覆盖默认 entry/output

[demo3 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo03)

**1. 检验 webpack 规范支持**

webpack 支持 ES6, CommonJS, AMD 规范

创建 vendor 文件夹，其中 minus.js、multi.js 和 sum.js 分别用 CommonJS、AMD 和 ES6 规范编写

```js
// minus.js
module.exports = function(a, b) {
  return a - b
}

// multi.js
define(function(require, factory) {
  'use strict'
  return function(a, b) {
    return a * b
  }
})

// sum.js
export default function(a, b) {
  return a + b
}
```

在 **app.js** 文件中引入以上三个 js 文件

```js
/**
 * webpack 支持 ES6、CommonJs 和 AMD 规范
 */

// ES6
import sum from './vendor/sum'
console.log('sum(1, 2) = ', sum(1, 2))

// CommonJs
var minus = require('./vendor/minus')
console.log('minus(1, 2) = ', minus(1, 2))

// AMD
require(['./vendor/multi'], function(multi) {
  console.log('multi(1, 2) = ', multi(1, 2))
})
```

**2. 编写配置文件覆盖 entry/output**

webpack.config.js 是 webpack **默认**的配置文件名，在根目录下创建

```js
const path = require('path')

module.exports = {
  entry: {
    app: './app.js' // 需要打包的文件入口
  },
  output: {
    publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: 'bundle.js' // 打包后生产的 js 文件
  }
}
```

`path.resolve()` 方法会把一个路径或路径片段的序列解析为一个绝对路径。

`__dirname`: 当前模块的文件夹名称。

可以使用 `console.log` 输出一下就明白了

```js
const path = require('path')

console.log('__dirname: ', __dirname)
console.log('path.resolve: ', path.resolve(__dirname, 'dist'))

module.exports = {
  entry: {
    app: './app.js' // 需要打包的文件入口
  },
  output: {
    publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: 'bundle.js' // 打包后生产的 js 文件
  }
}
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190318112611.png)

执行 `npm run build` 打包 js 文件

会发现生成了 dist 文件夹，并生成了两个打包后的文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305171516.png)

这跟 AMD 的引入方式有关，如果在 app.js 中注释掉 AMD 的写法，则只会打包出一个 bundle.js 文件

:::tip
在实际写代码的时候，最好使用 ES6 和 CommonJS 的规范来写
:::

当你注释 AMD 后，打包完 dist 中有多个文件，这是因为打包的时候，**没有先删除 dist 文件，再打包**，我们需要使用一个插件来帮我们实现，GitHub 链接：👉 [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional)

① 安装插件

```bash
npm install clean-webpack-plugin --save-dev
```

② 修改 webpack 配置文件

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    app: './app.js' // 需要打包的文件入口
  },
  output: {
    publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: 'bundle.js' // 打包后生产的 js 文件
  },
  plugins: [
    new CleanWebpackPlugin() // 默认情况下，此插件将删除 webpack output.path目录中的所有文件，以及每次成功重建后所有未使用的 webpack 资产。
  ]
}
```

之后再执行 `npm run build` 就可以了

打包后的 js 文件会按照我们的配置放在 dist 目录下，**创建一个 html 文件，引用打包好的 js 文件**，打开 F12 就能看到效果了

#### 参考文章

[webpack4 系列教程 (一): 打包 JS](https://godbmw.com/passages/2018-07-30-webpack-pack-js/)

[Webpack4 教程：从零配置到生产模式](https://www.valentinog.com/blog/webpack-tutorial/)

## 四、用 Babel 7 转译 ES6

[demo4 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo04)

#### (一) 了解 Babel 及生态

现代 Javascript 主要是用 ES6 编写的。但并非每个浏览器都知道如何处理 ES6。 我们需要某种转换，这个转换步骤称为 transpiling(转译)。transpiling(转译) 是指采用 ES6 语法，转译为旧浏览器可以理解的行为。

Webpack 不知道如何进行转换但是有 **loader(加载器)** ：将它们视为转译器。

**babel-loader** 是一个 webpack 的 loader(加载器)，用于将 ES6 及以上版本转译至 ES5

要开始使用 **loader** ，我们需要安装一堆依赖项，以下已 **Babel7** 为主，[升级建议](https://babeljs.io/docs/en/v7-migration)

- [@babel/core](https://babeljs.io/docs/en/babel-core)
- [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env): 包含 ES6、7 等版本的语法转化规则
- [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime/): 避免 polyfill 污染全局变量，减小打包体积
- [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill): ES6 内置方法和函数转化垫片
- babel-loader: 负责 ES6 语法转化

:::warning 注意!!!
如果是用 babel7 来转译，需要安装 **@babel/core**、**@babel/preset-env** 和 **@babel/plugin-transform-runtime**，而不是 babel-core、babel-preset-env 和 babel-plugin-transform-runtime，它们是用于 babel6 的
:::

:::tip 使用 @babel/plugin-transform-runtime 的原因
Babel 使用非常小的助手来完成常见功能。默认情况下，这将添加到需要它的每个文件中。**这种重复有时是不必要的**，尤其是当你的应用程序分布在多个文件上的时候。

**transform-runtime** 可以重复使用 Babel 注入的程序代码来**节省代码，减小体积**。
:::

:::tip 使用 @babel/polyfill 的原因
Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 **API**，比如 **Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象**，以及一些定义在全局对象上的方法（比如 **Object.assign**）都不会转码。必须使用 **@babel/polyfill**，为当前环境提供一个垫片。

所谓垫片也就是垫平不同浏览器或者不同环境下的差异
:::

#### (二) 安装依赖并配置

① 安装依赖

```bash
npm i @babel/core babel-loader @babel/preset-env @babel/plugin-transform-runtime --save-dev
```

```bash
npm i @babel/polyfill @babel/runtime
```

② 在项目的根目录中创建名为 **.babelrc** 的新文件来配置 **Babel**:

```js
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-transform-runtime"]
}

```

③ webpack 配置 loader(加载器)

```js
module: {
  rules: [
    {
      test: /\.js$/, // 使用正则来匹配 js 文件
      exclude: /nodes_modules/, // 排除依赖包文件夹
      use: {
        loader: 'babel-loader' // 使用 babel-loader
      }
    }
  ]
}
```

webpack.config.js 最终配置：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190318165630.png)

④ 在 app.js 全局引入 `@babel/polyfill` 并写入 ES6 语法，并执行 `npm run build` 打包

```js {2}
// 全局引入
import '@babel/polyfill'

// 测试 ES6 语法是否通过 babel 转译
const array = [1, 2, 3]
const isES6 = () => console.log(...array)

isES6()

const arr = [new Promise(() => {}), new Promise(() => {})]

arr.map(item => {
  console.log(item)
})
```

<!-- ![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190306134849.png) -->

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190402161557.png)

⑤ 打包完之后**使用 IE 浏览器**打开 index.html 文件，看控制台是否有输出，如果是新版的 chrome，是可以使用 es6 语法的，所以要用 **IE** 这个**万恶之源**试试

全局引入 `@babel/polyfill` 的这种方式可能会导入代码中不需要的 polyfill，从而使打包体积更大

更改 `.babelrc`，只转译我们使用到的

```js {6}
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage"
      }
    ]
  ],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

同时，将全局引入这段代码注释掉，再次打包

```js
// 全局引入
// import '@babel/polyfill'
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190402162042.png)

体积就减小了很多，但是更多的情况是我们并不确切的知道项目中引发兼容问题的具体原因，所以**还是全局引入比较好**

#### (三) 了解 .browserslistrc 配置文件

[browserslistrc](https://github.com/browserslist/browserslist) 用于在不同前端工具之间共享目标浏览器和 Node.js 版本的配置

可以看看 browserslist [兼容浏览器的页面](https://browserl.ist/)

当您将以下内容添加到 `package.json` 时，所有工具都会自动找到目标浏览器：

```json
"browserslist": [
  "> 1%",
  "last 2 version",
  "not ie <= 8"
]
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190318160833.png)

也可以创建 `.browserslist` 文件夹单独写配置

```txt
# 所支持的浏览器版本

> 1% # 全球使用情况统计选择的浏览器版本

last 2 version # 每个浏览器的最后两个版本

not ie <= 8 # 排除小于 ie8 以下的浏览器
```

该项目还是使用**单独创建配置文件**的方式，便于理解，如果觉得配置文件不好，也可以写在 `package.json` 中

#### 参考文章

[webpack4 系列教程 (二): 编译 ES6](https://godbmw.com/passages/2018-07-31-webpack-compile-ES6/)

[babel 7 的使用的个人理解](https://www.jianshu.com/p/cbd48919a0cc)

[babel 7 升级建议](https://babeljs.io/docs/en/v7-migration)

[browserslist](https://github.com/browserslist/browserslist)

## 五、Code Splitting

[demo5 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo05)

`package.json` 文件所用依赖，npm install 安装：

```json
{
  "scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
  "devDependencies": {
    "clean-webpack-plugin": "^2.0.0",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3"
  },
  "dependencies": {
    "lodash": "^4.17.11"
  }
}
```

我们在 src/ 文件夹下创建 index.js 文件

```js
import _ from 'lodash'

console.log(_.join(['a', 'b', 'c']))
```

目录结构为：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320185632.png)

**2. 配置 webpack.config.js 文件**

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  plugins: [new CleanWebpackPlugin()]
}
```

运行 `npm run build` 打包

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320185603.png)

在 index.html 中使用打包后的文件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>代码分割</title>
  </head>

  <body>
    <script src="./dist/main.bundle.js"></script>
  </body>
</html>
```

使用浏览器打开 `index.html` 文件，进入控制台，可以看到如下信息：`a,b,c`

如果我们再改动业务代码，将 index.js 中的代码改为

```js
import _ from 'lodash'

console.log(_.join(['a', 'b', 'c'], '***'))
```

再打包，刷新页面可以看到 `a***b*****c**`

**我们引用的第三方框架和我们的业务代码一起被打包，这样会有一个什么问题?**

假设 lodash 为 1M，业务代码也为 1M，打包后假设为 2M

浏览器每次打开页面，都要先加载 2M 的文件，才能显示业务逻辑，这样会使得加载时间变长，

业务代码更新会比较**频繁**，第三方代码基本不会更改，这样重新打包后，假设为 2M，用户重新打开网页后，又会再加载 2M 文件

浏览器是有**缓存**的，如果文件没变动的话，就不用再去发送 http 请求，而是直接从缓存中取，这样在刷新页面或者第二次进入的时候可以加快网页加载的速度。

怎么解决呢，可以利用 webpack 中的代码分割

在 webpack4 之前是使用 **commonsChunkPlugin** 来拆分公共代码，v4 之后被**废弃**，并使用 **splitChunksPlugins**

在使用 splitChunksPlugins 之前，首先要知道 splitChunksPlugins 是 webpack 主模块中的一个细分模块，**无需 npm 引入**

现在我们来配置 **webpack.config.js** 文件

```js {15,16,17,18}
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [new CleanWebpackPlugin()]
}
```

上面高亮的代码段就是告诉 webpack，要做代码分割了，这里的 `chunks: 'all'` 是分割所有代码，包括同步代码和异步代码，webpack 默认是 `chunks: 'async'` 分割**异步**代码

我们使用 `npm run dev` 来打包开发环境下的代码，这样代码就**不会压缩**，方便我们来观察，可以看到代码被分割成两个文件了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320190013.png)

打开 **dist/main.bundle.js** 文件，在最底部可以看到 src/index.js 文件，里面放的是业务逻辑的代码，但是并没有 lodash 的代码

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320190124.png)

打开 **dist/vendors~main.js** 文件，在最上面可以看到 lodash 模块

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320190254.png)

再次打开页面，控制台也输出了内容，这样就实现了 **Code Splitting**(代码分割)

其实没有 webpack 的时候，也是有代码分割的，不过是需要我们自己手动的分割，而现在使用了 webpack，通过这种配置项的方式，它会自动帮我们去做代码分割

仔细看分割完的代码名称，`vendors~main.js`，我们对分割完的名称进行更改

还是在 `splitChunks` 的配置项中，添加 `cacheGroups` 对象

```js
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendors: {
        name: 'vendors'
      }
    }
  }
}
```

再次打包就可以看到效果了，**cacheGroups** 的默认配置会定义 **vendors** 和 **default**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320213839.png)

`test: /[\\/]node_modules[\\/]/,` 使用正则过滤，只有 **node_modules** 引入的第三方库会被分割

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320213704.png)

为了验证默认配置，我们将 splitChunks 属性设置为空对象，再次打包

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320214642.png)

打包完发现只有一个文件，这是为什么?

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320220233.png)

因为 `chunks` 默认为 `async`，只会分割**异步**的代码，而之前我们写的都是同步的代码，先 import lodash，再去写业务逻辑，现在使用异步的方式来做，将 index.js 中的代码改为以下：

```js
function getComponent() {
  // 使用 异步的形式导入 lodash，default: _ 表示用 _ 代指 lodash
  return import('lodash').then(({ default: _ }) => {
    var element = document.createElement('div')
    element.innerHTML = _.join(['hello', 'world'], '-')
    return element
  })
}

getComponent().then(element => {
  document.body.appendChild(element)
})
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320224930.png)

这里分割出了 `0.js` 和 `main.bundle.js`，0 是以 id 为编号来命名

所以一般我们设置 chunks 为 all，异步、同步代码都打包

现在我们将 webpack 官网上的默认配置拷贝到我们的 webpack.config.js 中来分析一下

```js
optimization: {
  splitChunks: {
    chunks: 'async',
    minSize: 30000,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
  }
}
```

webpack 代码分割的配置是这样的，比如我们要分割 jQuery 和 lodash 这样的第三方库，它会先经过 `chunks、minSize、maxSize、minChunks` 等等，满足条件后生成 jQuery 和 lodash 两个文件，然后放入 **cacheGroup** 中缓存着，再根据你在 **cacheGroup** 中配置的**组**来决定是将两个文件整合到一个文件打包，还是单独分开打包，比如上面代码中的 **vendors**，就是将 `node_modules` 中所有的第三方库都打包到 **vendors.js** 文件中，如果你还想继续分割可以这么做

```js {2,3,4,5,6}
cacheGroups: {
  lodash: {
    name: 'loadsh',
    test: /[\\/]node_modules[\\/]lodash[\\/]/,
    priority: 5  // 优先级要大于 vendors 不然会被打包进 vendors
  },
  vendors: {
    test: /[\\/]node_modules[\\/]/,
    priority: -10
  },
  default: {
    minChunks: 2,
    priority: -20,
    reuseExistingChunk: true
  }
}
```

再次打包，就可以看到 lodash 被分割出来了，以后使用第三方库都可以用这种配置来单独分割成一个 js 文件，比如 **element-ui**，**注意**设置 **priority** 的值很重要，优先级越高的会越先被打包

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320221643.png)

如果 index.js 引入了 A.js 和 B.js，同时 A、B 又引入了 common，common 被引入了两次，可以被称为公共模块

目录结构为：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320225754.png)

代码如下：

```js
// a,js
import './common'
console.log('A')
export default 'A'

// b.js
import './common'
console.log('B')
export default 'B'

// common.js
console.log('公共模块')
export default 'common'

// index.js
import './a.js'
import './b.js'

// 异步代码
function getComponent() {
  // 使用异步的形式导入 lodash，default: _ 表示用 _ 代指 lodash
  return import('lodash').then(({ default: _ }) => {
    var element = document.createElement('div')
    element.innerHTML = _.join(['hello', 'world'], '-')
    return element
  })
}

getComponent().then(element => {
  document.body.appendChild(element)
})
```

修改 **splitChunks** 中的配置，重点在配置 common 公共模块上，**将 minChunks 设置为 1**

```js {3,17,18,19,20,21,22,23}
optimization: {
  splitChunks: {
    chunks: 'all',
    minSize: 30000,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
      lodash: {
        name: 'loadsh',
        test: /[\\/]node_modules[\\/]lodash[\\/]/,
        priority: 10
      },
      commons: {
        name: 'commons',
        minSize: 0, //表示在压缩前的最小模块大小,默认值是 30kb
        minChunks: 1, // 最小公用次数
        priority: 5, // 优先级
        reuseExistingChunk: true // 公共模块必开启
      },
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
  }
},
```

再次打包，可以发现公共模块被分割了

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320225922.png)

在 index.html 中引入打包后的文件，这里只要引入 main.bundle.js **入口文件**即可，并打开 index.html 文件，控制台也能正确输出

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>代码分割</title>
  </head>

  <body>
    <script src="./dist/main.bundle.js"></script>
  </body>
</html>
```

上面那种**异步**的写法可能比较绕，现在精简一下，并且 webpack 对**异步代码**通过**注释**可以直接修改打包后的名称，以下代码全部以异步的形式引入

```js
// 异步代码
import(/* webpackChunkName: 'a'*/ './a').then(function(a) {
  console.log(a)
})

import(/* webpackChunkName: 'b'*/ './b').then(function(b) {
  console.log(b)
})

import(/* webpackChunkName: 'use-lodash'*/ 'lodash').then(function(_) {
  console.log(_.join(['1', '2']))
})
```

**将 minChunks 设置为 2，最小公用 2 次才分割**

```js {20}
optimization: {
  splitChunks: {
    chunks: 'all',
    minSize: 30000,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
      lodash: {
        name: 'loadsh',
        test: /[\\/]node_modules[\\/]lodash[\\/]/,
        priority: 10
      },
      commons: {
        name: 'commons',
        minSize: 0, //表示在压缩前的最小模块大小,默认值是 30kb
        minChunks: 2, // 最小公用次数
        priority: 5, // 优先级
        reuseExistingChunk: true // 公共模块必开启
      },
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
  }
}
```

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321103007.png)

这里分割出了 `lodash` 和我们在注释中定义的 `use-lodash`，前者是第三库，后者是使用第三库写的业务代码，也能被分割出来

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321103211.png)

常用的配置项在下面的表格中，更多配置详情见[官网](https://webpack.js.org/plugins/split-chunks-plugin/)

| 配置项             | 说明                                                         | 示例                                                        |
| ------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| chunks             | 匹配的块的类型                                               | initial（初始块），async（按需加载的异步块），all（所有块） |
| name               | 用以控制分离后代码块的命名                                   | chunk-libs                                                  |
| test               | 用于规定缓存组匹配的文件位置                                 | /[\\/]node_modules[\\/]/                                    |
| priority           | 分离规则的优先级，优先级越高，则优先匹配                     | priority: 20                                                |
| minSize            | 超过多少大小就进行压缩                                       | minSize: 30000 默认值是 30kb                                |
| minChunks          | 分割前必须共享模块的最小块数                                 | minChunks: 2                                                |
| reuseExistingChunk | 如果当前块已从主模块拆分出来，则将**重用**它而不是生成新的块 | true                                                        |

#### 参考文章

[webpack4 系列教程 (三): 多页面解决方案 -- 提取公共代码](https://godbmw.com/passages/2018-08-06-webpack-mutiple-pages/)

[webpack 官网](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunks-cachegroups-cachegroup-reuseexistingchunk)

## 六、Lazy Loading、Prefetching

[demo6 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo06)

在 demo5 的基础上修改 index.js 文件，并删除了多余的 js 文件

```js
document.addEventListener('click', function() {
  import(/* webpackChunkName: 'use-lodash'*/ 'lodash').then(function(_) {
    console.log(_.join(['3', '4']))
  })
})
```

这段代码表示的是，当点击页面的时候，异步加载 lodash 并输出内容，打包后打开 index.html 文件，演示如下：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/%E6%87%92%E5%8A%A0%E8%BD%BD.gif)

第一次进入页面的时候，并没有加载 lodash 和 use-lodash，当我点击网页的时候，浏览器再去加载，并且控制台输出内容，这就是代码**懒加载**，如果有用过 **vue-router** 的朋友应该会知道**路由懒加载**，并且官方也推荐使用懒加载的写法，就是为了结合 webpack，下图是 vue-cli3 生成的项目

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321110641.png)

其实懒加载就是通过 **import** 去异步的加载一个模块，具体什么时候加载，这个要根据业务来写，比如弹窗组件，模态框组件等等，都是点击按钮后再出现。

懒加载能加快网页的加载速度，如果你把详情页、弹窗等页面全部打包到一个 js 文件中，用户如果只是访问首页，只需要首页的代码，不需要其他页面的代码，加入多余的代码只会使加载时间变长，所以我们可以对路由进行懒加载，只有当用户访问到对应路由的时候，再去加载对应模块

:::tip
懒加载并不是 webpack 里的概念，而是 ES6 中的 **import** 语法，webpack 只是能够识别 import 语法，能进行代码分割而已。

import 后面返回的是一个 then，说明这是一个 **promise** 类型，一些低端的浏览器**不支持** promise，比如 **IE** ，如果要使用这种异步的代码，就要使用 **babel** 以及 **babel-polyfill** 来做转换，因为我使用的是 73 版本的 **chrome** 浏览器，对 ES6 语法是支持的，所以我并没有安装 babel 也能使用
:::

更改 index.js 文件

```js
document.addEventListener('click', function() {
  const element = document.createElement('div')
  element.innerHTML = 'Hello World'
  document.body.appendChild(element)
})
```

重新打包，并打开 index.html ，打开浏览器控制台，按 `ctrl + shift + p` ，输入 `coverage`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321121513.png)

就能看到当前页面加载的 js 代码使用率，红色区域表示未被使用的代码段

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321141020.png)

演示：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/coverage1.gif)

打开 `coverage` 如果没出现分析的文件，记得刷新一下

这里一开始红色区域的代码未被使用，当我点击了页面后，变成绿色，页面出现了 `Hello World`，说明代码被使用了

页面刚加载的时候，异步的代码根本就不会执行，但是我们却把它下载下来，实际上就会浪费页面执行性能，webpack 就希望像这样交互的功能，应该把它放到一个异步加载的模块去写

新建一个 click.js 文件

```js
function handleClick() {
  const element = document.createElement('div')
  element.innerHTML = 'Dell Lee'
  document.body.appendChild(element)
}

export default handleClick
```

并且将 index.js 文件改为异步的加载模块：

```js
document.addEventListener('click', () => {
  import('./click.js').then(({ default: func }) => {
    func()
  })
})
```

重新打包，使用 **coverage** 分析

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321142418.png)

演示：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/coverage2.gif)

当加载页面的时候，没有加载业务逻辑，当点击网页的时候，才会加载 1.js 模块，也就是我们在 index.js 中异步引入的 click.js

这么去写代码，才是使页面加载最快的一种方式，写高性能前端代码的时候，**不关是考虑缓存，还要考虑代码使用率**

所以 webpack 在打包过程中，是希望我们多写这种异步的代码，才能提升网站的性能，这也是为什么 webpack 的 splitChunks 中的 chunks 默认是 async，异步的

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190321143146.png)

异步能提高你网页打开的性能，而同步代码是增加一个缓存，对性能的提升是非常有限的，因为缓存一般是**第二次打开网页或者刷新页面**的时候，缓存很有用，但是网页的性能一般是用户**第一次打开网页**，看首屏的时候。

当然，这也会出现另一个问题，就是当用户点击的时候，才去加载业务模块，如果业务模块比较大的时候，用户点击后并没有立马看到效果，而是要等待几秒，这样体验上也不好，怎么去解决这种问题

一：如果访问首页的时候，不需要加载详情页的逻辑，等用户首页加载完了以后，页面展示出来了，页面的带宽被释放出来了，网络空闲了，再「偷偷」的去加载详情页的内容，而不是等用户去点击的时候再去加载

这个解决方案就是依赖 webpack 的 [Prefetching/Preloading](https://webpack.js.org/guides/code-splitting#prefetchingpreloading-modules) 特性

修改 index.js

```js
document.addEventListener('click', () => {
  import(/* webpackPrefetch: true */ './click.js').then(({ default: func }) => {
    func()
  })
})
```

`webpackPrefetch: true` 会等你主要的 JS 都加载完了之后，网络带宽空闲的时候，它就会预先帮你加载好

重新打包后刷新页面，注意看 **Network**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/prefetch.gif)

当网页打开的时候，main.bundle.js 被加载完了，网络空闲了，就会预先加载 1.js 耗时 14ms，等我去点击页面的时候，Network 又多了一个 1.js，耗时 2ms，这是因为第一次加载完了 1.js，被浏览器给缓存起来了，等我点击的时候，浏览器直接从缓存中取，响应速度非常快

这里我们使用的是 `webpackPrefetch`，还有一种是 `webpackPreload`

:::tip 区别：
与 prefetch 相比，Preload 指令有很多**不同之处**：

**Prefetch** 会等待核心代码加载完之后，有空闲之后再去加载。Preload 会和核心的代码并行加载，还是不推荐
:::

:::tip 总结：

针对优化，不仅仅是局限于缓存，缓存能带来的代码性能提升是非常有限的，而是如何让代码的**使用率**最高，有一些交互后才用的代码，可以写到异步组件里面去，通过懒加载的形式，去把代码逻辑加载进来，这样会使得页面访问速度变的更快，如果你觉得懒加载会影响用户体验，可以使用 Prefetch 这种方式来预加载，不过在某些游览器**不兼容**，会有兼容性的问题，重点不是在 Prefetch 怎么去用，而是在做前端代码性能优化的时候，**缓存不是最重要的点，最重要的是代码使用的覆盖率上(coverage)**

:::

## 七、自动生成 HTML 文件

[demo7 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo07)

经过上面几个小节的操作，有没有觉得每次要去更改 index.html 中引入 js 文件很麻烦，一旦打包的名字变更后，也要对应的去修改 index.html 引入的 js 名称，这个时候就要使用一个插件来帮助我们，打包完之后**自动生成 HTML 文件**，**并自动引入打包后的 js 文件**

#### (一) 安装依赖

```bash
npm i html-webpack-plugin html-loader --save-dev
```

package.json 如下：

```json
{
  "scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
  "devDependencies": {
    "clean-webpack-plugin": "^2.0.0",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3"
  },
  "dependencies": {
    "lodash": "^4.17.11"
  }
}
```

#### (二) 更改配置文件

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: 'index.html', // 生成后的文件名
      template: 'index.html' // 根据此模版生成 HTML 文件
    })
  ]
}
```

**HtmlWebpackPlugin** 是在 plugin 这个选项中配置的。常用参数含义如下：

- title: 打包后生成 html 的 title
- filename：打包后的 html 文件名称
- template：模板文件（例子源码中根目录下的 index.html）
- chunks：和 entry 配置中相匹配，支持多页面、多入口
- minify：压缩选项

由于使用了 `title` 选项，则需要在 `template` 选项对应的 html 的 title 中加入 `<%= htmlWebpackPlugin.options.title %>`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102044.png)

```js {4， 18}
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 引入插件

module.exports = {
  entry: {
    page: './src/page.js'
  },
  output: {
    publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: 'index.html', // 生成后的文件名
      template: 'index.html' // 根据此模版生成 HTML 文件
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        lodash: {
          name: 'chunk-lodash', // 单独将 lodash 拆包
          priority: 10, // 优先级要大于 commons 不然会被打包进 commons
          test: /[\\/]node_modules[\\/]lodash[\\/]/
        },
        commons: {
          name: 'chunk-commons',
          minSize: 1, //表示在压缩前的最小模块大小,默认值是 30kb
          minChunks: 2, // 最小公用次数
          priority: 5, // 优先级
          reuseExistingChunk: true // 公共模块必开启
        }
      }
    }
  }
}
```

#### (三) 打包并测试

运行 `npm run build`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102242.png)

打开 dist 文件夹里自动生成的 index.html

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102402.png)

在浏览器中打开 index.html 文件，打开控制台也发现有输出，OK，自动生成 HTML 文件成功

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102521.png)

细心的朋友可能会发现一个问题，生成后的 HTML 文件引入的 JS 为**绝对路径**，但是真实的项目打完包之后都是部署在服务器上，用绝对路径肯定不行，因为你本地电脑的绝对路径放在服务器上肯定找不到

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102901.png)

我们要将引入的 js 文件**从绝对路径改为相对路径**

修改 webpack.config.js 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307103015.png)

找到 output 输出配置，更改 publicPath 公共路径，修改为 `./` 绝对路径

```js
  output: {
    publicPath: './', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
```

再次打包，看打包后的 index.html 文件，打开浏览器测试，也是没问题的

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307103244.png)

## 八、处理 CSS/SCSS 文件

[demo8 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo08)

#### (一) 准备工作

CSS 在 HTML 中的常用引入方法有 `<link>` 标签和 `<style>` 标签两种，所以这次就是结合 webpack 特点实现以下功能：

- 将 css 通过 link 标签引入
- 将 css 放在 style 标签里

下图展示了这次的目录代码结构：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307160530.png)

这次我们需要用到 `css-loader`，`style-loader` 等 loader，跟 babel 一样，webpack 不知道将 CSS 提取到文件中。需要使用 loader 来加载对应的文件

css-loader:负责解析 CSS 代码，主要是为了处理 CSS 中的依赖，例如 @import 和 url() 等引用外部文件的声明

style-loader 会将 css-loader 解析的结果转变成 JS 代码，运行时**动态插入 style 标签**来让 CSS 代码生效。

#### (二) 安装依赖

```bash
npm i css-loader style-loader --save-dev
```

`package.json` 如下：

```json
{
  "scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
  "devDependencies": {
    "clean-webpack-plugin": "^2.0.0",
    "css-loader": "^2.1.0",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.5.0",
    "style-loader": "^0.23.1",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3"
  }
}
```

更改配置文件

```js {6}
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // 针对 .css 后缀的文件设置 loader
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
```

配置 module 中的 rules 属性，和配置 babel 一样，首先在 test 中使用正则来过滤 `.css` 文件，对 `.css` 文件使用 loader，`'style-loader', 'css-loader'`

在 base.css 中写入样式

```css
*,
body {
  margin: 0;
  padding: 0;
}
html {
  background: red;
}
```

**并在 app.js 中引入 base.css**

```js
import style from './css/base.css'
```

配置文件完整代码:

```js (20)
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 引入插件

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    publicPath: './', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 针对 .css 后缀的文件设置 loader
        use: ['style-loader', 'css-loader'] // 使用 loader
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: 'index.html', // 生成后的文件名
      template: 'index.html', // 根据此模版生成 HTML 文件
      chunks: ['app'] // entry中的 app 入口才会被打包
    })
  ]
}
```

项目打包，查看 dist 文件夹

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307112924.png)

发现并**没有生成 CSS 文件**，但是打开 index.html 是有样式的

原因是：`style-loader`, `css-loader` 两个 loader 的处理后，CSS 代码会转变为 JS，和 index.js 一起打包

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307144121.png)

可以发现是通过 `<style>` 标签注入的 css

如果需要单独把 CSS 文件分离出来，我们需要使用 **mini-css-extract-plugin** 插件。

之前是使用 `extract-text-webpack-plugin` 插件，此插件与 webpack4 不太匹配，现在使用 `mini-css-extract-plugin`

:::warning 注意!!!
确保将 webpack 更新到 **4.2.0** 版及以上。否则 **mini-css-extract-plugin** 将无效！

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190320112208.png)

目前还**不支持热更新**，也就是在开发环境下更改了 css，需要手动的刷新页面才会看到效果，目前这个插件一般在生产环境中使用，开发环境下还是使用 'style-loader'，具体见[官网配置](https://webpack.js.org/plugins/mini-css-extract-plugin/)
:::

```bash
npm i mini-css-extract-plugin --save-dev
```

更改配置文件：

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // 针对 .css 后缀的文件设置 loader
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
}
```

完整代码：

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    publicPath: './', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 针对 .css 后缀的文件设置 loader
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: 'index.html', // 生成后的文件名
      template: 'index.html', // 根据此模版生成 HTML 文件
      chunks: ['app'] // entry中的 app 入口才会被打包
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
}
```

这样只是生成了单独的 css 文件，但是并没有压缩，引入 [optimize-css-assets-webpack-plugin](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307144057.png) 插件来实现 css 压缩

```bash
npm install optimize-css-assets-webpack-plugin --save-dev
```

完整代码：

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩 css

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    publicPath: './', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 针对 .css 后缀的文件设置 loader
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: 'index.html', // 生成后的文件名
      template: 'index.html', // 根据此模版生成 HTML 文件
      chunks: ['app'] // entry中的 app 入口才会被打包
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS 处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    })
  ]
}
```

再打开 css 文件可以发现已经被压缩了，并且打开 index.html 也是有样式的

#### (三) 处理 SCSS 文件

安装 sass 依赖：

```bash
npm i node-sass sass-loader --save-dev
```

在 src 文件夹下新增 scss 文件夹及 main.scss 文件

main.scss 引入样式

```scss
$bgColor: black !default;
*,
body {
  margin: 0;
  padding: 0;
}
html {
  background-color: $bgColor;
}
```

在 app.js 中引入 main.scss 文件

```js
import './css/base.css'
import './scss/main.scss'
```

修改配置文件

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩 css

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    publicPath: './', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/, // 针对 .scss 或者 .css 后缀的文件设置 loader
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader' // 使用 sass-loader 将 scss 转为 css
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '自动生成 HTML',
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      filename: 'index.html', // 生成后的文件名
      template: 'index.html', // 根据此模版生成 HTML 文件
      chunks: ['app'] // entry中的 app 入口才会被打包
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS 处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    })
  ]
}
```

:::warning 注意!!!
module.rules.use 数组中，loader 的位置。根据 webpack 规则：**放在最后的 loader 首先被执行，从上往下写的话是下面先执行，从左往右写的话是右边先执行**。

```md
['style-loader', 'css-loader', 'sass-loader']
```

执行顺序为 **sass-loader --> css-loader --> style-loader**

**首先应该利用 sass-loader 将 scss 编译为 css**，剩下的配置和处理 css 文件相同。
:::

打包后再打开 index.html 文件会发现样式已经被 main.scss 中写的覆盖了，处理 scss 成功

#### 为 CSS 加上浏览器前缀

安装 [postcss-loader](https://github.com/postcss/postcss-loader) 和 [autoprefixer](https://github.com/postcss/autoprefixer) 依赖

```bash
npm install postcss-loader autoprefixer --save-dev
```

给 `src/scss/main.css` 中添加这段代码

```css
.example {
  display: grid;
  transition: all 0.5s;
  user-select: none;
  background: linear-gradient(to bottom, white, black);
}
```

有两种方式来配置 **postcss**，第一种是直接写在 webpack.config.js 中

```js
module: {
  rules: [
    {
      test: /\.(sa|sc|c)ss$/, // 针对 .sass .scss 或者 .css 后缀的文件设置 loader
      use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
        'css-loader',
        'sass-loader', // 使用 sass-loader 将 scss 转为 css
        // 使用 postcss 为 css 加上浏览器前缀
        {
          loader: 'postcss-loader',
          options: {
            plugins: [require('autoprefixer')]
          }
        }
      ]
    }
  ]
}
```

打包完之后，查看 dist/app.css 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309212322.png)

第二种方式，在 webpack.config.js 同级目录下，新建 postcss.config.js 配置文件

```js
module.exports = {
  plugins: [require('autoprefixer')]
}
```

同时在 webpack.config.js 中

```js
module: {
  rules: [
    {
      test: /\.(sa|sc|c)ss$/, // 针对 .sass .scss 或者 .css 后缀的文件设置 loader
      use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
        'css-loader',
        'sass-loader', // 使用 sass-loader 将 scss 转为 css
        'postcss-loader' // 使用 postcss 为 css 加上浏览器前缀
      ]
    }
  ]
},
```

:::tip 提示
由于 module 中的 rules 是倒着执行的，以上的执行顺序是 `postcss-loader` -> `sass-loader` -> `css-loader` -> `MiniCssExtractPlugin.loader`

`postcss-loader` 要放在最下面，也就是第一个执行的 loader
:::

#### 补充

在 css-loader 中使用 importLoader 属性

```js
module: {
  rules: [
    {
      test: /\.(sa|sc|c)ss$/, // 针对 .sass .scss 或者 .css 后缀的文件设置 loader
      use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
        {
          loader: css - loader,
          options: {
            importLoader: 2
          }
        },
        'sass-loader', // 使用 sass-loader 将 scss 转为 css
        'postcss-loader' // 使用 postcss 为 css 加上浏览器前缀
      ]
    }
  ]
}
```

**importLoader: 2** 表示：在一个 css 中引入了另一个 css，也会执行之前两个 loader，即 postcss-loader 和 sass-loader

参考：[webpack 官网指南](https://webpack.js.org/guides/asset-management#setup)
