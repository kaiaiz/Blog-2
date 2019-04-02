# webpack4 系列(下)

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

分析的结果就在控制台上打印了

```bash
{ filename: './src/index.js',
  dependencise: { './message.js': '.\\src\\message.js' },
  code:
   '"use strict";\n\nvar _message = _interopRequireDefault(require("./message.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log(_message.default);' }
```

目前我们只对一个模块进行分析，接下来要对整个项目进行分析，所以我们先分析了入口文件，再分析入口文件中所使用的依赖

将入口的依赖，依赖中的依赖全部都分析完放到 graphArray 中
