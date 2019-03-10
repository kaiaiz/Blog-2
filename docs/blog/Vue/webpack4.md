# webpack4 系列

此项目基于 👉 [Webpack4 渐进式教程](https://godbmw.com/passages/2019-03-04-please-mark/) ，以此为基础加上自己的理解和实践得出，感谢原作者😊，博客地址为：[godbmw](https://godbmw.com/)

**该项目使用的 node 版本为 10.5.0，npm 版本为 6.1.0**

每一个章节对应一个 demo 👉[源码地址](https://github.com/ITxiaohao/webpack4-learn)

## 一、搭建项目并打包 JS 文件

创建空文件夹，通过运行以下命令初始化  package.json

```bash
npm init -y
```

:::tip
npm init  用来初始化生成一个新的  package.json  文件。它会向用户提问一系列问题，如果你觉得不用修改默认配置，一路回车就可以了。
如果使用了 -y（代表 yes），则跳过提问阶段，直接生成一个新的  package.json  文件。
:::

引入 webpack 4：

```bash
npm i webpack --save-dev
```

还需要  webpack-cli ，作为一个单独的包引入

```bash
npm i webpack-cli --save-dev
```

此项目 webpack 版本如下：

```json
"webpack": "^4.29.6",
"webpack-cli": "^3.2.3"
```

现在打开  package.json  并添加一个  build(构建) 脚本：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164215.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164215.png)</a>

尝试运行看看会发生什么：

```bash
npm run build
```

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164344.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164344.png)</a>

在以前版本的 webpack 中，必须在名为  webpack.config.js  的配置文件中 通过  entry  属性定义 entry point(入口点) 。就像这样：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164413.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164413.png)</a>

但是   从 webpack 4 开始，不再必须定义 entry point(入口点) ：它将默认为  ./src/index.js ！

测试这个新功能，首先创建 ./src/index.js 文件

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164918.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303164918.png)</a>

再运行 `npm run build` 试试

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303165055.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303165055.png)</a>

打包成功，并在当前的根目录中得到打包后的文件夹，也就是 dist 文件夹

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303165232.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190303165232.png)</a>

它将查找  ./src/index.js  作为默认入口点。 而且，它会在  ./dist/main.js  中输出模块包，目前代码量小，可以格式化看效果

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305093607.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305093607.png)</a>

至此，打包 JS 结束

## 二、生产和开发模式

拥有 2 个配置文件在 webpack 中是的常见模式。

一个典型的项目可能有：

- 用于开发的配置文件，用于定义 webpack dev server 和其他东西
- 用于生产的配置文件，用于定义 UglifyJSPlugin，sourcemaps 等

虽然较大的项目可能仍然需要 2 个配置文件，但在 webpack4 中，你可以在没有一行配置的情况下完成

webpack 4 引入了  production(生产)  和  development(开发)  模式。

细心的朋友会发现在打包后会有一段报警提示

:::warning
'mode' 选项尚未设置，webpack 将回退到此值的 'production'。 将 “mode” 选项设置为 “development” 或 “production” 以启用每个环境的默认值。
您还可以将其设置为 “无” 以禁用任何默认行为。 了解更多：https：//webpack.js.org/concepts/mode/
:::

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305105906.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305105906.png)</a>

1. 打开  package.json 并填充  script  部分，如下所示：

```json
"dev": "webpack --mode development",
"build": "webpack --mode production"
```

2. 运行 `npm run dev`

打开 ./dist/main.js 文件，是一个 bundle(包) 文件，并没有压缩！

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305111034.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305111034.png)</a>

3. 运行 `npm run build`

可以看到 ./dist/main.js 文件已经被压缩了

其实在终端里也能发现，看构建完的大小， dev 模式下文件大小是 3.8 KB， prod 模式下文件大小仅为 960 字节

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305111311.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305111311.png)</a>

production mode(生产模式)  可以开箱即用地进行各种优化。 包括压缩，作用域提升，tree-shaking 等。

另一方面，development mode(开发模式) 针对速度进行了优化，仅仅提供了一种不压缩的 bundle 。

在 webpack 4 中，可以在没有一行配置的情况下完成任务！ 只需定义 –mode 参数即可获得所有内容！

在 vue 中也可以使用 -mode 来做相应处理，具体的后续会讲

## 三、覆盖默认 entry/output

1. 检验 webpack 规范支持

webpack 支持 es6, CommonJS, AMD。

创建 vendor 文件夹，其中 minus.js、multi.js 和 sum.js 分别用 CommonJS、AMD 和 ES6 规范编写。

在 app.js 文件中引入以上三个 js 文件

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

2. 编写配置文件覆盖 entry/output

webpack.config.js 是 webpack 默认的配置文件名，在根目录下创建

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

执行 `npm run build` 打包 js 文件

会发现生成了 dist 文件夹，并生成了两个打包后的文件

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305171516.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190305171516.png)</a>

这跟 AMD 的引入方式有关，如果在 app.js 中注释掉 AMD 的写法，则只会打包出一个 bundle.js 文件

:::tip
在实际写代码的时候，最好使用 ES6 和 CommonJS 的规范来写
:::

当你注释 AMD 后，打包完 dist 中还是有两个文件，这是因为打包的时候，没有先删除 dist 文件，再打包，我们需要使用一个插件来实现，GitHub 链接：👉 [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional)

① 安装插件

```bash
npm install --save-dev clean-webpack-plugin
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

打包后的 js 文件会按照我们的配置放在 dist 目录下，创建一个 html 文件，引用打包好的 js 文件，打开 F12 就能看到效果了

#### 参考文章

[webpack4 系列教程 (一): 打包 JS](https://godbmw.com/passages/2018-07-30-webpack-pack-js/)

[Webpack4 教程：从零配置到生产模式](https://www.valentinog.com/blog/webpack-tutorial/)

## 四、用 Babel 7 转译 ES6

#### (一) 了解 Babel 及生态

现代 Javascript 主要是用 ES6 编写的。但并非每个浏览器都知道如何处理 ES6。 我们需要某种转换，这个转换步骤称为 transpiling(转译)。transpiling(转译) 是指采用 ES6 语法，转译为旧浏览器可以理解的行为。

Webpack 不知道如何进行转换但是有 **loader(加载器)** ：将它们视为转译器。

**babel-loader** 是一个 webpack 的 loader(加载器)，用于将 ES6 及以上版本转译至 ES5

要开始使用 **loader** ，我们需要安装一堆依赖项，以下已 Babel7 为主，[升级建议](https://babeljs.io/docs/en/v7-migration)

- @babel/core
- [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env): 包含 es6、7 等版本的语法转化规则
- [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/babel-plugin-transform-runtime/): 避免 polyfill 污染全局变量，减小打包体积
- [@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill): es6 内置方法和函数转化垫片
- babel-loader: 负责 es6 语法转化

:::warning 注意
如果是用 babel7 来转译，需要安装 **@babel/core**、**@babel/preset-env** 和 **@babel/plugin-transform-runtime**，而不是 babel-core、babel-preset-env 和 babel-plugin-transform-runtime，它们是用于 babel6 的
:::

:::tip 使用 @babel/plugin-transform-runtime 的原因
Babel 使用非常小的助手来完成常见功能\_extend。默认情况下，这将添加到需要它的每个文件中。**这种重复有时是不必要的**，尤其是当您的应用程序分布在多个文件上时。

**transform-runtime** 可以重复使用 Babel 注入的程序代码来**节省代码，减小体积**。
:::

:::tip 使用 @babel/polyfill 的原因
Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 **API**，比如 **Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象**，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。必须使用 **@babel/polyfill**，为当前环境提供一个垫片。

所谓垫片也就是垫平不同浏览器或者不同环境下的差异
:::

#### (二) 安装依赖并配置

① 安装依赖

```bash
npm i @babel/core babel-loader @babel/preset-env @babel/plugin-transform-runtime --save-dev
```

```bash
npm i --save  @babel/polyfill @babel/runtime
```

② 在项目的根目录中创建名为 **.babelrc** 的新文件来配置 Babel:

```js
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-transform-runtime"]
}

```

③ webpack 配置 loader(加载器)

```js
modules: {
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

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190306003209.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190306003209.png)</a>

④ 在 app.js 全局引入 `@babel/polyfill` 并写入 ES6 语法，并执行 `npm run build` 打包

```js {2}
// 全局引入
import '@babel/polyfill'

// 测试 ES6 语法是否通过 babel 转译
const array = [1, 2, 3]
const isES6 = () => console.log(...array)

isES6()
```

全局引入 `@babel/polyfill` 的这种方式可能会导入代码中不需要的 polyfill，从而使打包体积更大，但是更多的情况是我们并不确切的知道项目中引发兼容问题的具体原因，所以**还是全局引入比较好**

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190306134849.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190306134849.png)</a>

⑤ 打包完之后打开 index.html 文件，看控制台是否有输出

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

也可以创建 `.browserslist` 文件夹单独写配置

```md
# 所支持的浏览器版本

> 1% # 全球使用情况统计选择的浏览器版本

last 2 version # 每个浏览器的最后两个版本

not ie <= 8 # 排除小于 ie8 以下的浏览器
```

该项目还是使用**单独创建配置文件**的方式，便于理解，如果觉得配置文件不好，也可以写在 `package.json` 中

#### 参考文章

[webpack4 系列教程 (二): 编译 ES6](https://godbmw.com/passages/2018-07-31-webpack-compile-es6/)

[babel 7 的使用的个人理解](https://www.jianshu.com/p/cbd48919a0cc)

[babel 7 升级建议](https://babeljs.io/docs/en/v7-migration)

[browserslist](https://github.com/browserslist/browserslist)

## 五、多页面打包 —— 提取公共代码段

在 webpack4 之前是使用 commonsChunkPlugin 来拆分公共代码，v4 之后被废弃，并使用 **splitChunksPlugins**

在使用 splitChunksPlugins 之前，首先要知道 splitChunksPlugins 是 webpack 主模块中的一个细分模块，无需 npm 引入

#### (一) 准备工作

我们在 src/ 文件夹下创建 `pageA.js` 和 `pageB.js` 分别作为两个入口文件。

同时，这两个入口文件同时引用 `subPageA.js` 和 `subPageB.js`，而 `subPageA.js` 和 `subPageB.js` 又同时引用 `common.js` 文件。

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307000808.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307000808.png)</a>

`common.js`:

```js
console.log('公共模块')
export default 'common'
```

`subPageA.js`:

```js
import './common'
console.log('subPageA')
export default 'subPageA'
```

`subPageB.js`:

```js
import './common'
console.log('subPageB')
export default 'subPageB'
```

`subPageA.js` 和 `subPageB.js` 同时引用 `common.js`

最后，我们封装入口文件。而为了让情况更真实，这两个入口文件又同时引用了 `lodash` 这个第三方库。

```bash
npm i lodash
```

`package.json` 文件中：

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

`pageA.js`:

```js
import './subPageA'
import './subPageB'

import * as _ from 'lodash'
console.log('在 A 页面 :', _)

export default 'pageA'
```

`pageB.js`:

```js
import './subPageA'
import './subPageB'

import * as _ from 'lodash'
console.log('在 B 页面 :', _)

export default 'pageB'
```

以上，需要编写的代码已经完成

#### (二) 配置 webpack.config.js 文件

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  // 多入口打包
  entry: {
    pageA: './src/pageA.js',
    pageB: './src/pageB.js'
  },
  output: {
    publicPath: __dirname + '/dist/', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  plugins: [
    new CleanWebpackPlugin() // 默认情况下，此插件将删除 webpack output.path 目录中的所有文件，以及每次成功重建后所有未使用的 webpack 资产。
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

着重来看 **optimization.splitChunks** 配置。我们将需要打包的代码放在 **cacheGroups** 属性中。

叫做 cacheGroup 的原因是 webpack 会将规则放置在 cache 流中，为对应的块文件匹配对应的流，从而生成分离后的块


| 配置项             | 说明                                                     | 示例                                                        |
| ------------------ | -------------------------------------------------------- | ----------------------------------------------------------- |
| chunks             | 匹配的块的类型                                           | initial（初始块），async（按需加载的异步块），all（所有块） |
| name               | 用以控制分离后代码块的命名                               | chunk-libs                                                  |
| test               | 用于规定缓存组匹配的文件位置                             | /[\\/]node_modules[\\/]/                                    |
| priority           | 分离规则的优先级，优先级越高，则优先匹配                 | priority: 20                                                |
| minSize            | 超过多少大小就进行压缩                                   | minSize: 30000 默认值是 30kb                                |
| minChunks          | 分割前必须共享模块的最小块数                             | minChunks: 3                                                |
| reuseExistingChunk | 如果当前块已从主模块拆分出来，则将重用它而不是生成新的块 | true                                                        |

其他配置具体详情见[官网](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunks-cachegroups-cachegroup-reuseexistingchunk)

:::warning
值得注意的是，针对第三方库（例如 lodash）通过设置 **priority** 来让其**先被打包提取**，最后再提取剩余代码。
:::

#### (三) 打包和引用

运行 `npm run build` 打包，可以看到已经把代码拆分出来

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307000849.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307000849.png)</a>

最后，打包的结果在 dist/ 文件夹下面，我们要在 index.html 中引用打包好的 js 文件，index.html 代码如下：


```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    <script src="./dist/chunk-lodash.js"></script>
    <script src="./dist/chunk-commons.js"></script>
    <script src="./dist/pageA.bundle.js"></script>
    <script src="./dist/pageB.bundle.js"></script>
  </body>
</html>
```

使用浏览器打开 `index.html` 文件，进入控制台，可以看到如下信息：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307000916.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307000916.png)</a>

可以看到，`公共模块，subPageA，subPageB` 输出的 js 文件为 `chunk-common.js` 符合预期

`在 A 页面 :` 输出的 js 文件为 `pageA.bundle.js`

`在 B 页面 :` 输出的 js 文件为 `pageB.bundle.js`

#### 参考文章

[webpack4 系列教程 (三): 多页面解决方案 -- 提取公共代码](https://godbmw.com/passages/2018-08-06-webpack-mutiple-pages/)

[webpack 官网](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunks-cachegroups-cachegroup-reuseexistingchunk)

## 六、单页面应用 —— 代码懒加载

#### (一) 准备工作

其中，page.js 是入口文件，subPageA.js 和 subPageB.js 共同引用 common.js。下面，我们按照代码引用的逻辑，从底向上展示代码：

`common.js`:

```js
console.log('公共模块')
export default 'common'
```

`subPageA.js`:

```js
import './common'
console.log('subPageA')
export default 'subPageA'
```

`subPageB.js`:

```js
import './common'
console.log('subPageB')
export default 'subPageB'
```

:::warning
请注意：subPageA.js 和 subPageB.js 两个文件中都执行了 console.log() 语句。之后将会看到 import() 和 require() 不同的表现形式：是否会自动执行 js 的代码？
:::

#### (二) 编写配置文件

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')

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
    new CleanWebpackPlugin() // 默认情况下，此插件将删除 webpack output.path 目录中的所有文件，以及每次成功重建后所有未使用的 webpack 资产。
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

`package.json` 配置如下：

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

#### (三) 使用 import() 编写 page.js

非常推荐 import() 写法，因为和 es6 语法看起来很像。除此之外，import() 可以通过注释的方法来指定打包后的 chunk 的名字。

除此之外，相信对 vue-router 熟悉的朋友应该知道，其官方文档的路由懒加载的配置也是通过 import() 来书写的。

`page.js`:

```js
import(/* webpackChunkName: 'subPageA'*/ "./subPageA").then(function(subPageA) {
  console.log(subPageA);
});

import(/* webpackChunkName: 'subPageB'*/ "./subPageB").then(function(subPageB) {
  console.log(subPageB);
});

import(/* webpackChunkName: 'lodash'*/ "lodash").then(function(_) {
  console.log(_.join(["1", "2"]));
});
export default "page";
```

运行 `npm run build` ，由于我们还使用了提取公共代码段，打包结果如下：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307000941.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307000941.png)</a>

我们创建 index.html 文件，通过`<script>` 标签引入我们打包结果

:::tip 注意
因为是单页应用，所以**只要引用入口文件**即可（即是上图中的 **page.bundle.js**）。
:::

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    <script src="./dist/page.bundle.js"></script>
  </body>
</html>
```

打开浏览器控制台，刷新界面，结果如下图所示：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307003040.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307003040.png)</a>

图中圈出的部分，就是说明 import() 会自动运行 subPageA.js 和 subPageB.js 的代码。

在 NetWork 选项中，我们可以看到，懒加载也成功了：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307002940.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307002940.png)</a>

## 七、自动生成 HTML 文件

经过上面几个小节的操作，有没有觉得每次要去更改 index.html 中引入 js 文件很麻烦，一旦打包的名字变更后，也要对应的去修改 index.html 引入的 js 名称，这个时候就要使用一个插件来帮助我们，打包完之后自动生成 HTML 文件，并自动引入打包后的 js 文件


#### (一) 安装依赖

```bash
npm i html-webpack-plugin html-loader --save-dev
```

这一节在**第六节项目**的基础上做改动

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
  ],
}
```

HtmlWebpackPlugin 是在 plugin 这个选项中配置的。常用参数含义如下：

- title: 打包后生成 html 的 title
- filename：打包后的 html 文件名称
- template：模板文件（例子源码中根目录下的 index.html）
- chunks：和 entry 配置中相匹配，支持多页面、多入口
- minify：压缩选项

由于使用了 `title` 选项，则需要在 `template` 选项对应的 html 的 title 中加入 `<%= htmlWebpackPlugin.options.title %>`

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102044.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102044.png)</a>

```js {4}
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

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102242.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102242.png)</a>

打开 dist 文件夹里自动生成的 index.html

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102402.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102402.png)</a>

在浏览器中打开 index.html 文件，打开控制台也发现有输出，OK，自动生成 HTML 文件成功

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102521.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102521.png)</a>

细心的朋友可能会发现一个问题，生成后的 HTML 文件引入的 JS 为绝对路径，但是真实的项目打完包之后都是部署在服务器上，用绝对路径肯定不行

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102901.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307102901.png)</a>

我们要将引入的 js 文件从绝对路径改为相对路径

修改 webpack.config.js 文件

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307103015.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307103015.png)</a>

找到 output 输出配置，更改 publicPath 公共路径，修改为 `./` 绝对路径

```js
  output: {
    publicPath: './', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
```

再次打包，看打包后的 index.html 文件

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307103244.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307103244.png)</a>

打开浏览器测试，也是没问题的

## 八、处理 CSS/SCSS 文件

#### (一) 准备工作

CSS 在 HTML 中的常用引入方法有 `<link>` 标签和 `<style>` 标签两种，所以这次就是结合 webpack 特点实现以下功能：

- 将 css 通过 link 标签引入
- 将 css 放在 style 标签里

下图展示了这次的目录代码结构：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307160530.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307160530.png)</a>

这次我们需要用到 `css-loader`，`style-loader` 等 loader，跟 babel 一样，webpack 不知道将 CSS 提取到文件中。需要使用 loader 来加载对应的文件

css-loader:负责解析 CSS 代码，主要是为了处理 CSS 中的依赖，例如 @import 和 url() 等引用外部文件的声明

style-loader 会将 css-loader 解析的结果转变成 JS 代码，运行时动态插入 style 标签来让 CSS 代码生效。

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

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307112924.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307112924.png)</a>

发现并**没有生成 CSS 文件**，但是打开 index.html 是有样式的

原因是：`style-loader`, `css-loader` 两个 loader 的处理后，CSS 代码会转变为 JS，和 index.js 一起打包

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307144121.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307144121.png)</a>

可以发现是通过 `<style>` 标签注入的 css

如果需要单独把 CSS 文件分离出来，我们需要使用 **mini-css-extract-plugin** 插件。

之前是使用 `extract-text-webpack-plugin` 插件，现在此插件与 webpack4 不太匹配，现在使用 `mini-css-extract-plugin`

:::warning 注意：
确保将 webpack 更新到 4.2.0 版。否则 **mini-css-extract-plugin** 将无效！
:::

```bash
npm i  mini-css-extract-plugin --save-dev
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
            loader: 'style-loader',
            options: {
              singleton: true // 处理为单个style标签
            }
          },
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

这样是生成了单独的 css 文件，但是并没有压缩，引入下面 [optimize-css-assets-webpack-plugin](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307144057.png) 插件来实现 css 压缩

```bash
npm install --save-dev optimize-css-assets-webpack-plugin
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
      assetNameRegExp: /\.css$/g, //一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
      cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    })
  ]
}
```

再打开 css 文件可以发现已经被压缩了，并且打开 index.html 也是有样式的

#### (三) 处理 SCSS 文件

安装依赖：

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
      assetNameRegExp: /\.css$/g, //一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
      cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    })
  ]
}
```

:::warning
需要注意的是，module.rules.use 数组中，loader 的位置。根据 webpack 规则：**放在最后的 loader 首先被执行**。所以，**首先应该利用 sass-loader 将 scss 编译为 css**，剩下的配置和处理 css 文件相同。
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

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309212322.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309212322.png)</a>

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



## 九、JS Tree Shaking

什么是 Tree Shaking？

字面意思是摇树，一句话：项目中没有使用的代码会在打包时候丢掉。**JS 的 Tree Shaking 依赖的是 ES6 的模块系统（比如：import 和 export）**

项目目录如下：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307185838.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307185838.png)</a>


在 util.js 文件中写入测试代码

```js
// util.js
export function a() {
  return 'this is function "a"'
}

export function b() {
  return 'this is function "b"'
}

export function c() {
  return 'this is function "c"'
}
```

然后在 app.js 中引用 util.js 的 function a() 函数，**按需引入**：

```js
// app.js
import { a } from './vendor/util'
console.log(a())
```

命令行运行 webpack 打包后，打开打包后生成的 **/dist/app.bundle.js** 文件。然后，查找我们 `a()` 函数输出的字符串，如下图所示：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307191853.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307191853.png)</a>

如果将查找内容换成 `this is function "c"` 或者 `this is function "b"`, 并没有相关查找结果。说明 Js Tree Shaking 成功。

1. 如何处理第三方 JS 库？
对于经常使用的第三方库（例如 jQuery、lodash 等等），如何实现 Tree Shaking？下面以 lodash.js 为例，进行介绍。

安装 lodash.js : `npm install lodash --save`

在 app.js 中引用 lodash.js 的一个函数：

```js
// app.js
import { chunk } from 'lodash'
console.log(chunk([1, 2, 3], 2))
```

命令行打包。如下图所示，打包后大小是 70kb。显然，只引用了一个函数，不应该这么大。并没有进行 Tree Shaking。

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307193414.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307193414.png)</a>


开头讲过，js tree shaking 利用的是 es 的模块系统。而 lodash.js 没有使用 **CommonJS** 或者 **ES6** 的写法。所以，安装库对应的模块系统即可。

安装 lodash.js 的 es 写法的版本：`npm install lodash-es --save`

修改一下 app.js:

```js
// app.js
import { chunk } from 'lodash-es'
console.log(chunk([1, 2, 3], 2))
```

再次打包，打包结果只有 3.5KB（如下图所示）。显然，tree shaking 成功。

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307194006.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190307194006.png)</a>


:::tip 友情提示：
在一些对加载速度敏感的项目中使用第三方库，请注意库的写法是否符合 es 模板系统规范，以方便 webpack 进行 tree shaking。
:::

## 十、CSS Tree Shaking

CSS Tree Shaking 并不像 JS Tree Shaking 那样方便理解，所以首先要先模拟一个真实的项目环境，来体现 CSS 的 Tree Shaking 的配置和效果。

**此章节基于第八节处理 CSS 项目**

我们首先编写 /src/css/base.css 样式文件，在文件中，我们编写了 3 个样式类。但在代码中，我们只会使用 .box 和 .box--big 这两个类。代码如下所示：

```css
/* base.css */
html {
  background: red;
}

.box {
  height: 200px;
  width: 200px;
  border-radius: 3px;
  background: green;
}

.box--big {
  height: 300px;
  width: 300px;
  border-radius: 5px;
  background: red;
}

.box-small {
  height: 100px;
  width: 100px;
  border-radius: 2px;
  background: yellow;
}
```

按照正常使用习惯，DOM 操作来实现样式的添加和卸载，是一贯技术手段。所以，入口文件 `/src/app.js` 中创建了一个 `<div>` 标签，并且将它的类设为 `.box`

```js
// app.js

import base from './css/base.css'

// 给 app 标签再加一个 div 并且类名为 box
var app = document.getElementById('app')
var div = document.createElement('div')
div.className = 'box'
app.appendChild(div)
```

最后，为了让环境更接近实际环境，我们在 `index.html` 的一个标签，也引用了定义好的 box-big 样式类。

[PurifyCSS](https://github.com/purifycss/purifycss)，它将帮助我们进行 **CSS Tree Shaking** 操作。为了能准确指明要进行 Tree Shaking 的 CSS 文件，还有 **glob-all** （另一个第三方库）。

glob-all 的作用就是帮助 PurifyCSS 进行路径处理，定位要做 Tree Shaking 的路径文件。

安装依赖：

```bash
npm i glob-all purify-css purifycss-webpack --save-dev
```

更改配置文件：

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件

const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')

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
        test: /\.css$/, // 针对 .scss 或者 .css 后缀的文件设置 loader
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
    // 清除无用 css
    new PurifyCSS({
      paths: glob.sync([
        // 要做 CSS Tree Shaking 的路径文件
        path.resolve(__dirname, './*.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
        path.resolve(__dirname, './src/*.js')
      ])
    })
  ]
}
```

打包完查看 dist/app.css 文件

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190308111209.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190308111209.png)</a>

在 index.html 和 src/app.js 中引用的样式都被打包了，而没有被使用的样式类–box-small，没有被打包进去

:::warning 注意！

平时用 vue 开发，比较常用的是 elementUI，如果这时你用 purifyCss 来过滤无用的 css，当你使用的 element 不多的情况如下

:::

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190308135219.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190308135219.png)</a>

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190308135241.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190308135241.png)</a>

清除前 194kb，清除后，6.68kb，震惊!!!

将打包后的文件放到 nginx 部署后，打开网页也相当震惊!!!

样式全无，泪目。。。

:::danger
如果项目中有引入第三方 css 库的话，谨慎使用!!!
:::

## 十一、图片处理汇总

目录结构:

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309152820.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309152820.png)</a>

webpack4 中的图片常用的基础操作：

- 图片处理和 Base64 编码
- 图片压缩
- 合成雪碧图

#### (一)、准备工作

如项目代码目录展示的那样，除了常见的 `app.js` 作为入口文件，我们将用到的 **3** 张图片放在 `/src/assets/imgs/` 目录下，并在样式文件 `base.css` 中引用这些图片。

剩下的内容交给 `webpack` 打包处理即可。样式文件和入口 `app.js` 文件的代码分别如下所示：

```css
/* base.css */
*,
body {
  margin: 0;
  padding: 0;
}
.box {
  height: 400px;
  width: 400px;
  border: 5px solid #000;
  color: #000;
}
.box div {
  width: 100px;
  height: 100px;
  float: left;
}
.box .ani1 {
  background: url('./../assets/imgs/1.jpg') no-repeat;
}
.box .ani2 {
  background: url('./../assets/imgs/2.png') no-repeat;
}
.box .ani3 {
  background: url('./../assets/imgs/3.png') no-repeat;
}
```

在 `app.js` 中

```js
import './css/base.css'
```

安装依赖：

```bash
npm install url-loader file-loader --save-dev
```

#### (一)、图片处理和 base64 编码

在 `webpack.config.js` 中的 **module.rules** 选项中进行配置，以实现让 **loader** 识别图片后缀名，并且进行指定的处理操作。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              outputPath: 'images/', //输出到 images 文件夹
              limit: 20000 //把小于 20kb 的文件转成 Base64 的格式
            }
          }
        ]
      }
    ]
  }
}
```

完整的配置文件

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
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              outputPath: 'images/', //输出到 images 文件夹
              limit: 20000 //把小于 20kb 的文件转成 Base64 的格式
            }
          }
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

打包项目，查看打包结果，并在浏览器中打开 `index.html` 文件

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309153942.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309153942.png)</a>

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309154327.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309154327.png)</a>

可以看到除了 **1.jpg**，另外两张图片已经被打包成 `base64` 格式，在 `app.css` 文件中

**1.jpg** 这个文件超过我们在 **url-loader** 选项中设置的 **limit** 值，所以被单独打包

这就是利用了 **file-loader** 的能力，如果在 **url-loader** 中设置了 **limit** 的值，却**没有安装 file-loader 依赖**，会怎么样？来试试看，首先**卸载 file-loader 依赖**，`npm uninstall file-loader`，再运行打包命令，`npm run build`

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309154722.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309154722.png)</a>

:::tip 总结：
**如果图片较多，会发很多 http 请求，会降低页面性能。**

**url-loader** 会将引入的图片编码，转为 `base64` 字符串。再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了，节省了图片请求。

但是，如果图片较大，**编码会消耗性能**。因此 **url-loader** 提供了一个 **limit** 参数，小于 **limit** 字节的文件会被转为 `base64`，大于 **limit** 的使用 **file-loader** 进行处理，单独打包。

**url-loader 依赖 file-loader，url-loader 可以看作是增强版的 file-loader**
:::

#### (三)、图片压缩

图片压缩需要使用 **img-loader** 插件，除此之外，**针对不同的图片类型，还要引用不同的插件**。比如，我们项目中使用的是 **png** 图片，因此，需要引入 `imagemin-pngquant`，并且指定压缩率。压缩 **jpg/jpeg** 图片为 `imagemin-mozjpeg` 插件

:::danger 注意！！！
这里有个 **bug**，可以先不急着操作，先把这一小节看完，再决定！！
:::

安装依赖

```bash
npm i img-loader imagemin imagemin-pngquant imagemin-mozjpeg --save-dev
```

在之前的配置上更改：

```js
{
  test: /\.(png|jpg|jpeg|gif)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].min.[ext]',
        outputPath: 'images/', // 输出到 images 文件夹
        limit: 20000 //把小于 20kb 的文件转成 Base64 的格式
      }
    }
  ]
}
```

更改为：

```js
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
      loader: 'img-loader',
      options: {
        plugins: [
          require('imagemin-pngquant')({
            quality: '80' // the quality of zip
          }),
          require('imagemin-mozjpeg')({
            quality: '80'
          })
        ]
      }
    }
  ]
}
```

打包结果：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309191851.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309191851.png)</a>

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309200159.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309200159.png)</a>

原因在 png 图片上，jpg 图片可以压缩，但是去 [imagemin-pngquant](https://github.com/imagemin/imagemin-pngquant) **github** 上也没发现有人提出 issue ，百度、google 找了半天，还是没发现怎么解决😭，于是使用另一种压缩图片的插件 **[image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)**

首先卸载了之前的依赖：

`npm uni img-loader imagemin imagemin-pngquant imagemin-mozjpeg`

安装依赖：

`npm i image-webpack-loader --save-dev`

这个依赖安装的时间会比较久。。。可以先去做别的。。。

在之前的配置上更改：
```js
{
  test: /\.(png|jpg|jpeg|gif)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].min.[ext]',
        outputPath: 'images/', // 输出到 images 文件夹
        limit: 20000 //把小于 20kb 的文件转成 Base64 的格式
      }
    }
  ]
}
```

更改为：

```js
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
}
```
这里**故意**把 **url-loader** 的 **limit** 属性值设的很小，不让它转化 **png** 图片为 `base64`，因为我们要测试压缩 **png** 图片

打包结果：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309190112.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309190112.png)</a>

图片压缩成功，这里我仔细看了下[官网介绍](https://github.com/tcoopman/image-webpack-loader)，其实这个 `image-webpack-loader` 插件内置了好几种图片压缩的插件

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309192621.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309192621.png)</a>

这里让我很疑惑，为什么我直接安装 `imagemin-pngquant` 不行，反而使用 `image-webpack-loader` 却可以，于是我去查看 `package-lock.json` 文件，搜索 `image-webpack-loader`

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309193137.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309193137.png)</a>

我看了下我之前安装的是最新的版本， **^7.0.0** !!!

阿西吧... 终于找到问题所在，**新版本**有些问题没处理好，导致压缩 png 图片失败，知道问题就好办了，在 package.json 中，将 `imagemin-pngquant` 版本改为 ^6.0.0，重新 `npm install`

再按照之前的操作，就可以压缩成了，对应版本如下：

```json {5}
{
  "devDependencies": {
    "imagemin": "^6.1.0",
    "imagemin-mozjpeg": "^8.0.0",
    "imagemin-pngquant": "^6.0.0",
    "img-loader": "^3.0.1",
  }
}
```

如果使用 `image-webpack-loader` ，版本为 `4.6.0` ，引入的依赖版本也在白框内

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309193858.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309193858.png)</a>

这次我还是使用 `image-webpack-loader`，朋友们可以自行选择使用哪个插件，只是 `image-webpack-loader` 引入了其他图片格式压缩的依赖，如 svg/webp/gif 等，只安装 `image-webpack-loader` 就够了，而另一种则是要一个个插件装过去，其实原理都一样

:::tip 总结！

经过这次调试，明白**并不是最新的版本就是最好的**，新版本也许有哪些地方没处理好，或者是不能兼容其他插件，导致报错

所以安装第三方依赖的时候，还是要**谨慎一点**，**npm install 默认是安装最新版**，如果出了问题，**回滚到之前的稳定版**，不仅仅适用于 `webpack` 插件，对于其他软件或者工具也是这样

写这一小节的时间为：`2019-3-9`，之后的版本变动出现报错的话，可以不用安装最新版，回滚到之前的版本试试看

:::

#### (四)、生成雪碧图

安装依赖：

```bash
npm i postcss-loader postcss-sprites --save-dev
```

完整配置：

```js
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件

/*********** sprites config ***************/
let spritesConfig = {
  spritePath: './dist/images'
}
/******************************************/

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
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          /*********** loader for sprites ***************/
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [require('postcss-sprites')(spritesConfig)]
            }
          }
          /*********************************************/
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

打包后查看结果：

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309205542.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309205542.png)</a>

<a data-fancybox title="" href="https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309205630.png">![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309205630.png)</a>

雪碧图是为了减少网络请求，所以被处理雪碧图的图片多为各式各样的 **logo** 或者**大小相等的小图片**。

**而对于大图片，还是不推荐使用雪碧图。这样会使得图片体积很大**

除此之外，雪碧图要配合 **css** 代码进行定制化使用。要通过 **css** 代码在雪碧图上精准定位需要的图片

## 十二、字体文件处理

项目目录为：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190310135802.png)

package.json 中使用的依赖如下：

```json
{
  "scripts": {
    "dev": "webpack --mode development",
    "build": "webpack --mode production"
  },
  "devDependencies": {
    "clean-webpack-plugin": "^2.0.0",
    "css-loader": "^2.1.0",
    "file-loader": "^3.0.1",
    "url-loader": "^1.1.2",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.5.0",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3"
  }
}
```

app.js 中引入字体文件

```js
import './assets/fonts/iconfont.css'
```

配置 webpack.config.js 文件来处理字体

借助 url-loader，可以识别并且处理 eot、woff 等结尾的字体文件。同时，根据字体文件大小，可以灵活配置是否进行 base64 编码。

下面的 demo 就是当文件大小小于 5000B 的时候，进行 base64 编码。

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
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
              publicPath: 'fonts/',
              outputPath: 'fonts/'
            }
          }
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

在 index.html 中使用字体

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>处理字体文件</title>
  </head>

  <body>
    <div id="app">
      <div class="box">
        <i class="iconfont icon-xiazai"></i>
        <i class="iconfont icon-shoucang"></i>
        <i class="iconfont icon-erweima"></i>
        <i class="iconfont icon-xiangshang"></i>
        <i class="iconfont icon-qiehuanzuhu"></i>
        <i class="iconfont icon-sort"></i>
        <i class="iconfont icon-yonghu"></i>
      </div>
    </div>
  </body>
</html>
```

打包后查看 index.html 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190310140801.png)

打包成功

## 十三、处理第三方 js 库

项目目录：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190310142027.png)

1. 如何使用和管理第三方 JS 库？

项目做大之后，开发者会更多专注在业务逻辑上，其他方面则尽力使用第三方 JS 库来实现。

由于 js 变化实在太快，所以出现了多种引入和管理第三方库的方法，常用的有 3 中：

- CDN：`<script></script>` 标签引入即可
- npm 包管理：**目前最常用和最推荐的方法**
- 本地 js 文件：一些库由于历史原因，没有提供 es6 版本，需要手动下载，放入项目目录中，再手动引入。

针对第三种方法，如果没有 webpack，则需要手动引入 import 或者 require 来加载文件；但是，webpack 提供了 alias 的配置，配合 webpack.ProvidePlugin 这款插件，可以跳过手动入，直接使用！

2. 编写入口文件

如项目目录图片所展示的，我们下载了 **jquery.min.js**，放到了项目中。同时，我们**也通过 npm 安装了 jquery**。

为了尽可能模仿生产环境，app.js 中使用了 $ 来调用 jq，还使用了 jQuery 来调用 jq。

因为正式项目中，由于需要的依赖过多，挂载到 window 对象的库，很容易发生命名冲突问题。此时，就需要重命名库。例如：$ 就被换成了 jQuery。

在 app.js 中进行修改

```js
// app.js
$('div').addClass('new')

jQuery('div').addClass('old')

// 运行webpack后
// 浏览器打开 index.html, 查看 div 标签的 class
```

3. 编写配置文件

**webpack.ProvidePlugin** 参数是键值对形式，键就是我们项目中使用的变量名，值就是键所指向的库。

**webpack.ProvidePlugin 会先从 npm 安装的包中查找是否有符合的库**

如果 **webpack** 配置了 **resolve.alias** 选项（理解成 “别名”），那么 webpack.ProvidePlugin 就会顺着这条链一直找下去。

```js {2,37,38,39,40}
const path = require('path')
const webpack = require('webpack')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
  resolve: {
    alias: {
      jQuery$: path.resolve(__dirname, 'src/vendor/jquery.min.js')
    }
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
    new webpack.ProvidePlugin({
      $: 'jquery', // npm
      jQuery: 'jQuery' // 本地Js文件
    })
  ]
}
```

修改 index.html 文件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>处理第三方 js 库</title>
  </head>
  <body>
    <div></div>
  </body>
</html>
```

打包并在 Chrome 中打开 index.html。如下图所示，`<div>` 标签已经被添加上了 **old** 和 **new** 两个样式类。证明在 app.js 中使用的 $ 和 jQuery 都成功指向了 jquery 库。

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190310142606.png)
