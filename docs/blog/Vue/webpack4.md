# webpack4 学习

此项目基于 👉 [Webpack4 渐进式教程](https://godbmw.com/passages/2019-03-04-please-mark/) ，以此为基础加上自己的理解和实践得出，感谢 `董沅鑫` 😊 博客地址为：[godbmw](https://godbmw.com/)

**该项目使用的 node 版本为 10.5.0，npm 版本为 6.1.0**

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

## 二、production(生产) 和 development(开发) 模式

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

## 三、覆盖默认 entry(入口)/output(输出)

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

### （一）了解 Babel 及生态

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

### （二）安装依赖并配置

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

### （三）了解 .browserslistrc 配置文件

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

## 五、多页面解决方案 —— 提取公共代码
