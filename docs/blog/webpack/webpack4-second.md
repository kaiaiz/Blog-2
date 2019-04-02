# webpack4 系列(中)

## 十一、图片处理汇总

[demo11 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo11)

目录结构:

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309152820.png)

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

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309153942.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309154327.png)

可以看到除了 **1.jpg**，另外两张图片已经被打包成 `base64` 格式，在 `app.css` 文件中

**1.jpg** 这个文件超过我们在 **url-loader** 选项中设置的 **limit** 值，所以被单独打包

这就是利用了 **file-loader** 的能力，如果在 **url-loader** 中设置了 **limit** 的值，却**没有安装 file-loader 依赖**，会怎么样？来试试看，首先**卸载 file-loader 依赖**，`npm uninstall file-loader`，再运行打包命令，`npm run build`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309154722.png)

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

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309191851.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309200159.png)

原因在 png 图片上，jpg 图片可以压缩，但是去 [imagemin-pngquant](https://github.com/imagemin/imagemin-pngquant) **github** 上也没发现有人提出类似 issue ，百度、google 找了半天，还是没发现怎么解决😭，于是使用另一种压缩图片的插件 **[image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)**

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

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309190112.png)

图片压缩成功，这里我仔细看了下[image-webpack-loader 的 github](https://github.com/tcoopman/image-webpack-loader)，其实这个 `image-webpack-loader` 插件内置了好几种图片压缩的插件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309192621.png)

这里让我**很疑惑**，为什么我直接安装 `imagemin-pngquant` 不行，反而使用 `image-webpack-loader` 却可以，于是我去查看 `package-lock.json` 文件，搜索 `image-webpack-loader`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309193137.png)

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

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309193858.png)

这次我还是使用 `image-webpack-loader`，朋友们可以自行选择使用哪个插件，只是 `image-webpack-loader` 引入了其他图片格式压缩的依赖，如 **svg/webp/gif** 等，只安装 `image-webpack-loader` 就够了，而另一种则是要一个个插件装过去，其实原理都一样

:::tip 总结！

经过这次调试，明白**并不是最新的版本就是最好的**，新版本也许有哪些地方没处理好，或者是不能兼容其他插件，导致报错

所以安装第三方依赖的时候，还是要**谨慎一点**，**npm install 默认是安装最新版**，如果出了问题，**回滚到之前的稳定版**，不仅仅适用于 `webpack` 插件，对于其他软件或者工具也是这样

写这一小节的时间为：`2019-3-9`，之后的版本变动出现报错的话，可以不用安装最新版，回滚到之前的版本试试

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

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309205542.png)

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190309205630.png)

雪碧图是为了减少网络请求，所以被处理雪碧图的图片多为各式各样的 **logo** 或者**大小相等的小图片**。

**而对于大图片，不推荐使用雪碧图。这样会使得图片体积很大**

除此之外，雪碧图要配合 **css** 代码进行定制化使用。要通过 **css** 代码在雪碧图上精准定位需要的图片

## 十二、字体文件处理

[demo12 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo12)

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

借助 url-loader，可以识别并且处理 **eot、woff** 等结尾的字体文件。同时，根据字体文件大小，可以灵活配置是否进行 base64 编码。

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

打包后查看 index.html 文件，打包成功

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190310140801.png)


## 十三、处理第三方 js 库

[demo13 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo13)

项目目录：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190310142027.png)

**1. 如何使用和管理第三方 JS 库？**

项目做大之后，开发者会更多专注在业务逻辑上，其他方面则尽力使用第三方 JS 库来实现。

由于 js 变化实在太快，所以出现了多种引入和管理第三方库的方法，常用的有 3 中：

- CDN：`<script></script>` 标签引入即可
- npm 包管理：**目前最常用和最推荐的方法**
- 本地 js 文件：一些库由于历史原因，没有提供 ES6 版本，需要手动下载，放入项目目录中，再手动引入。

针对第三种方法，如果没有 webpack，则需要手动引入 import 或者 require 来加载文件；但是，webpack 提供了 alias 的配置，配合 **webpack.ProvidePlugin** 这款插件，可以跳过手动入，直接使用！

**2. 编写入口文件**

如项目目录图片所展示的，我们下载了 **jquery.min.js**，放到了项目中。同时，我们**也通过 npm 安装了 jquery**。

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190318185023.png)

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

1. 编写配置文件

**webpack.ProvidePlugin** 参数是键值对形式，键就是我们项目中使用的变量名，值就是键所指向的库。

**webpack.ProvidePlugin 会先从 npm 安装的包中查找是否有符合的库**

如果 **webpack** 配置了 **resolve.alias** 选项（理解成 “别名”），那么 webpack.ProvidePlugin 就会顺着这条链一直找下去。

```js {2,19,37,38,39,40}
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

## 十四、开发模式与 webpack-dev-server

[demo14 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo14)

**1. 为什么需要开发模式？**

这十几节来我们使用最多的就是**生产环境**，也就是执行 `npm run build` 命令，打包项目中的各种文件及压缩

而开发模式就是指定 mode 为 development。对应我们在 `package.json` 中配置的，就是 `npm run dev`，在第二小节也涉及到了这一点

在开发模式下，我们需要对代码进行调试。对应的配置就是：**devtool** 设置为 **source-map**。在非开发模式下，需要关闭此选项，以减小打包体积。详情见: [devtool](https://webpack.docschina.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx)

在开发模式下，还需要**热重载**、**路由重定向**、**设置代理**等功能，webpack4 已经提供了 devServer 选项，启动一个本地服务器，让开发者使用这些功能。

目录结构：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190312171439.png)

安装依赖

```bash
npm i webpack-dev-server --save-dev
```

修改 `package.json`

```json {3,13}
{
  "scripts": {
    "dev": "webpack-dev-server --open",
    "build": "webpack --mode production"
  },
  "devDependencies": {
    "clean-webpack-plugin": "^2.0.0",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "jquery": "^3.3.1",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3",
    "webpack-dev-server": "^3.2.1"
  }
}
```

因为我们在 package.json 中配置了 script，所以开启开发模式直接 `npm run dev` 即可

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190312171510.png)

虽然控制台输出了打包信息（假设我们已经配置了热重载），但是磁盘上并没有创建 **/dist/** 文件夹和打包文件。控制台的打包文件的相关内容是存储在内存之中的。

修改 index.html 文件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>webpack-dev-server</title>
  </head>

  <body>
    This is Index html
  </body>
</html>
```

然后，按照项目目录，简单封装下 /vendor/ 下的三个 js 文件，以方便 app.js 调用：

```js
// minus.js
module.exports = function(a, b) {
  return a - b;
};

// multi.js
define(function(require, factory) {
  "use strict";
  return function(a, b) {
    return a * b;
  };
});

// sum.js
export default function(a, b) {
  console.log("I am sum.js");
  return a + b;
}
```

app.js 中使用三种引入方式引入 js 文件:

```js
import sum from './vendor/sum'
console.log('sum(1, 2) = ', sum(1, 2))

var minus = require('./vendor/minus')
console.log('minus(1, 2) = ', minus(1, 2))

require(['./vendor/multi'], function(multi) {
  console.log('multi(1, 2) = ', multi(1, 2))
})
```

现在开始更改 webpack.config.js， 完整的配置文件如下：

```js
const webpack = require('webpack')
const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './src/app.js'
  },
  output: {
    publicPath: '/', // js 引用的路径或者 CDN 地址
    path: path.resolve(__dirname, 'dist'), // 打包文件的输出目录
    filename: '[name].bundle.js', // 代码打包后的文件名
    chunkFilename: '[name].js' // 代码拆分后的文件名
  },
  mode: 'development', // 开发模式
  devtool: 'source-map', // 开启调试
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 8000, // 本地服务器端口号
    hot: true, // 热重载
    overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架
    proxy: {
      // 跨域代理转发
      '/comments': {
        target: 'https://m.weibo.cn',
        changeOrigin: true,
        logLevel: 'debug',
        headers: {
          Cookie: ''
        }
      }
    },
    historyApiFallback: {
      // HTML5 history模式
      rewrites: [{ from: /.*/, to: '/index.html' }]
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
    new webpack.HotModuleReplacementPlugin(), // 热部署模块
    new webpack.NamedModulesPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery', // npm
      jQuery: 'jQuery' // 本地Js文件
    })
  ]
}
```

对上面的配置进行单独分析:

- 模块热更新

模块热更新需要 **[HotModuleReplacementPlugin](https://webpack.js.org/plugins/hot-module-replacement-plugin/#root)** 和 **[NamedModulesPlugin](https://www.webpackjs.com/plugins/named-modules-plugin/)** 这两个插件，**并且顺序不能错，并且指定 devServer.hot 为 true**，

```js {1,5,6}
const webpack = require('webpack') // 引入 webpack

module.exports = {
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热部署模块
    new webpack.NamedModulesPlugin(),
  ]
}
```

有了这两个插件，在项目的 **js** 代码中**可以针对侦测到变更的文件并且做出相关处理**，也就不用写完代码**重新刷新页面**，它会自动检测变更的代码并且在页面上更改

:::tip
注意是 **js** 代码，如果你去改动 index.html 文件，保存后，页面并不会更改，反之你去修改了 js 文件，保存后，页面会更新
:::

比如，我们启动开发模式后，修改了 `vendor/sum.js` 这个文件，此时，需要在浏览器的控制台打印一些信息。那么，**app.js** 中就可以这么写：

```js
if (module.hot) {
  // 检测是否有模块热更新
  module.hot.accept("./vendor/sum.js", function() {
    // 针对被更新的模块, 进行进一步操作
    console.log("/vendor/sum.js is changed");
  });
}
```
每当 **sum.js** 被修改后，都可以自动执行回调函数。

浏览器控制台输出信息如下：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190312171605.png)

但是我们日常开发中使用 vue 脚手架根本没有写过这样的代码，也能热更新，是因为 **vue-loader** 中内置了这种方法，**css-loader** 中也有，所以我们改完 js 和 css 代码就能直接看到更新

- 跨域代理

随着前后端分离开发的普及，跨域请求变得越来越常见。为了快速开发，可以利用 devServer.proxy 做一个代理转发，来绕过浏览器的跨域限制。

devServer 模块的底层是使用了 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)，能配置的东西非常多

按照前面的配置文件，如果想调用微博的一个接口：https://m.weibo.cn/comments/hotflow。只需要在代码中对 /comments/hotflow 进行请求即可，在 app.js 中添加如下代码：

```js
$.get(
  "/comments/hotflow",
  {
    id: "4263554020904293",
    mid: "4263554020904293",
    max_id_type: "0"
  },
  function(data) {
    console.log(data);
  }
);
```

上面代码是使用 jQuery 发送 get 请求，如果是在 vue 项目中，一般是使用 axios 来发送请求

修改完 app.js 后保存，打开之前的 localhost:8000 网页，可以看到 Network 发送的请求

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190312171756.png)

- HTML5–History

当项目使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。

在 SPA（单页应用）中，任何响应直接被替代为 index.html。

在 vuejs 官方的脚手架 vue-cli 中，开发模式下配置如下：

```js
historyApiFallback: {
  // HTML5 history模式
  rewrites: [{ from: /.*/, to: '/index.html' }]
}
```

最终 app.js 中的代码如下：

```js
import sum from './vendor/sum'
console.log('sum(1, 2) = ', sum(1, 2))

var minus = require('./vendor/minus')
console.log('minus(1, 2) = ', minus(1, 2))

require(['./vendor/multi'], function(multi) {
  console.log('multi(1, 2) = ', multi(1, 2))
})

$.get(
  '/comments/hotflow',
  {
    id: '4263554020904293',
    mid: '4263554020904293',
    max_id_type: '0'
  },
  function(data) {
    console.log(data)
  }
)

if (module.hot) {
  // 检测是否有模块热更新
  module.hot.accept('./vendor/sum.js', function() {
    // 针对被更新的模块, 进行进一步操作
    console.log('/vendor/sum.js is changed')
  })
}
```

打开控制台，可以看到代码都正常运行没有出错。除此之外，由于开启了 **source-map**，所以可以定位代码位置（下图红框内）：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190312171919.png)

参考文章： [webpack4 系列教程 (十五)：开发模式与 webpack-dev-server](https://godbmw.com/passages/2018-10-19-webpack-dev-server/)

## 十五、开发模式和生产模式・实战

[demo15 源码地址](https://github.com/ITxiaohao/webpack4-learn/tree/master/demo15)

首先，新建一个文件夹：demo15，执行 `npm init -y` 初始化 `package.json`，生成后的文件如下：

```json
{
  "name": "example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

我们先将无用的代码清除掉，只留下关键代码:

```json
{
  "scripts": {}
}
```

首先安装 **webpack** 所需依赖

```bash
npm i webpack webpack-cli webpack-dev-server --save-dev
```

安装 **babel7**，因为目前主要是用 ES6 来编写代码，所以需要转译

```bash
npm i @babel/core babel-loader @babel/preset-env @babel/plugin-transform-runtime --save-dev
```

```bash
npm i @babel/polyfill @babel/runtime
```

现在 **package.json** 中的依赖为：

```json
{
  "scripts": {},
  "devDependencies": {
    "@babel/core": "^7.3.4",
    "@babel/plugin-transform-runtime": "^7.3.4",
    "@babel/preset-env": "^7.3.4",
    "babel-loader": "^8.0.5",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3",
    "webpack-dev-server": "^3.2.1"
  },
  "dependencies": {
    "@babel/polyfill": "^7.2.5",
    "@babel/runtime": "^7.3.4"
  }
}
```

新建 **.babelrc** 来配置 babel 插件，代码如下：

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

新建 **.browserslistrc** 文件配置该项目所支持的浏览器版本

```txt
# 所支持的浏览器版本

> 1% # 全球使用情况统计选择的浏览器版本
last 2 version # 每个浏览器的最后两个版本
not ie <= 8 # 排除小于 ie8 及以下的浏览器
```
:::tip
在开始配置 webpack.config.js 文件之前，需要注意一下，因为现在我们是有两种模式，**production(生产)** 和 **development(开发)** 模式。
:::

安装自动生成 html 依赖

```bash
npm i html-webpack-plugin html-loader clean-webpack-plugin --save-dev
```

安装 css/字体图标处理依赖

```bash
npm i css-loader style-loader mini-css-extract-plugin optimize-css-assets-webpack-plugin --save-dev
```

安装 scss 处理依赖

```bash
npm i node-sass sass-loader --save-dev
```

为不同内核的浏览器加上 CSS 前缀

```bash
npm install postcss-loader autoprefixer --save-dev
```

图片及字体处理：

```bash
npm i url-loader file-loader image-webpack-loader --save-dev
```

第三方 js 库

```bahs
npm i jquery
```

现在 package.json 为：

```json
{
  "scripts": {},
  "devDependencies": {
    "@babel/core": "^7.3.4",
    "@babel/plugin-transform-runtime": "^7.3.4",
    "@babel/preset-env": "^7.3.4",
    "autoprefixer": "^9.4.10",
    "babel-loader": "^8.0.5",
    "clean-webpack-plugin": "^2.0.0",
    "css-loader": "^2.1.1",
    "file-loader": "^3.0.1",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "image-webpack-loader": "^4.6.0",
    "mini-css-extract-plugin": "^0.5.0",
    "node-sass": "^4.11.0",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "postcss-loader": "^3.0.0",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.1",
    "url-loader": "^1.1.2",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.2.3",
    "webpack-dev-server": "^3.2.1",
  },
  "dependencies": {
    "@babel/polyfill": "^7.2.5",
    "@babel/runtime": "^7.3.4",
    "jquery": "^3.3.1"
  }
}
```

之前我们大多都是写生产模式，也就是经常说的打包，但是我们日常开发项目，用的是开发模式。

只有在项目做完后，要部署到 **nginx** 上的时候才使用生产模式，将代码打包后放到 **nginx** 中

之所以要分两种模式是因为，开发模式下，需要**加快编译的速度，可以热更新以及设置跨域地址，开启源码调试(devtool: 'source-map')**

而生成模式下，则需要**压缩 js/css 代码，拆分公共代码段，拆分第三方 js 库等操作**

所以这里的配置我们分成三个文件来写，一个是生产配置，一个是开发配置，最后一个是基础配置

即：**webpack.base.conf.js**(基础配置)、**webpack.dev.conf.js**(开发配置)、**webpack.prod.conf.js**(生产配置)

新建 **build** 文件夹，创建上述三个文件，项目结构为：

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190315142706.png)

这里需要使用到一个插件，**webpack-merge** 用来合并配置，比如开发环境就合并开发配置 + 基础配置，生产就合并生产配置 + 基础配置

```bash
npm i webpack-merge --save-dev
```

先简单写个 webpack.base.conf.js 的示例代码

```js
const merge = require("webpack-merge");

const productionConfig = require("./webpack.prod.conf"); // 引入生产环境配置文件
const developmentConfig = require("./webpack.dev.conf"); // 引入开发环境配置文件

const baseConfig = {}; // ... 省略

module.exports = env => {
  let config = env === "production" ? productionConfig : developmentConfig;
  return merge(baseConfig, config); // 合并 公共配置 和 环境配置
};
```

- 引入 webpack-merge 插件来合并配置
- 引入生产环境和开发环境
- 编写基础配置
- 导出合并后的配置文件

在代码中区分不同环境：

```js
module.exports = env => {
  let config = env === "production" ? productionConfig : developmentConfig;
  return merge(baseConfig, config); // 合并 公共配置 和 环境配置
};
```

这里的 env 在 package.json 中进行配置，修改 scripts，添加 "dev" 和 "build" 命令

注意，这里有个 **--env** 字段，与 webpack.base.conf.js 中的 env 是**联动**的，告诉它当前是什么环境，然后合并成什么环境

```json
{
  "scripts": {
    "dev": "webpack-dev-server --env development --open --config build/webpack.base.conf.js",
    "build": "webpack --env production --config build/webpack.base.conf.js"
  }
}
```

#### 编写基础配置

```js
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件
const CleanWebpackPlugin = require('clean-webpack-plugin')

const path = require('path')

const productionConfig = require('./webpack.prod.conf.js') // 引入生产环境配置文件
const developmentConfig = require('./webpack.dev.conf.js') // 引入开发环境配置文件

/**
 * 根据不同的环境，生成不同的配置
 * @param {String} env "development" or "production"
 */
const generateConfig = env => {
  // 将需要的 Loader 和 Plugin 单独声明

  let scriptLoader = [
    {
      loader: 'babel-loader'
    }
  ]

  let cssLoader = [
    'style-loader',
    'css-loader',
    'sass-loader', // 使用 sass-loader 将 scss 转为 css
    'postcss-loader' // 使用 postcss 为 css 加上浏览器前缀
  ]

  let cssExtractLoader = [
    {
      loader: MiniCssExtractPlugin.loader
    },
    'css-loader',
    'sass-loader', // 使用 sass-loader 将 scss 转为 css
    'postcss-loader' // 使用 postcss 为 css 加上浏览器前缀
  ]

  let fontLoader = [
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

  let imageLoader = [
    {
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].min.[ext]',
        limit: 10000, // size <= 10KB
        outputPath: 'images/'
      }
    },
    // 图片压缩
    {
      loader: 'image-webpack-loader',
      options: {
        // 压缩 jpg/jpeg 图片
        mozjpeg: {
          progressive: true,
          quality: 50 // 压缩率
        },
        // 压缩 png 图片
        pngquant: {
          quality: '65-90',
          speed: 4
        }
      }
    }
  ]

  let styleLoader =
    env === 'production'
      ? cssExtractLoader // 生产环境下压缩 css 代码
      : cssLoader // 开发环境：页内样式嵌入

  return {
    entry: { app: './src/app.js' },
    output: {
      publicPath: env === 'development' ? '/' : './',
      path: path.resolve(__dirname, '..', 'dist'),
      filename: '[name]-[hash:5].bundle.js',
      chunkFilename: '[name]-[hash:5].chunk.js'
    },
    module: {
      rules: [
        { test: /\.js$/, exclude: /(node_modules)/, use: scriptLoader },
        { test: /\.(sa|sc|c)ss$/, use: styleLoader },
        { test: /\.(eot|woff2?|ttf|svg)$/, use: fontLoader },
        { test: /\.(png|jpg|jpeg|gif)$/, use: imageLoader }
      ]
    },
    plugins: [
      // 开发环境和生产环境二者均需要的插件
      new HtmlWebpackPlugin({
        title: 'webpack4 实战',
        filename: 'index.html',
        template: path.resolve(__dirname, '..', 'index.html'),
        // chunks: ['app'],
        minify: {
          collapseWhitespace: true
        }
      }),
      new webpack.ProvidePlugin({ $: 'jquery' }),
      new CleanWebpackPlugin()
    ]
  }
}

module.exports = env => {
  let config = env === 'production' ? productionConfig : developmentConfig
  return merge(generateConfig(env), config) // 合并 公共配置 和 环境配置
}
```

:::tip
以上配置建议多看几遍熟悉熟悉，为什么要这样写
:::

#### 编写开发环境配置文件

```js
const webpack = require('webpack')

const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map', // 调试源码
  devServer: {
    contentBase: path.join(__dirname, '../dist/'),
    port: 8000,
    hot: true,
    overlay: true,
    proxy: {
      '/comments': {
        target: 'https://m.weibo.cn',
        changeOrigin: true,
        logLevel: 'debug',
        headers: {
          Cookie: ''
        }
      }
    },
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}
```

:::tip
开发配置主要是设置跨域、开启源码调试、热更新
:::

#### 编写生产环境配置文件

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩 css

module.exports = {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        jquery: {
          name: 'chunk-jquery', // 单独将 jquery 拆包
          priority: 15,
          test: /[\\/]node_modules[\\/]jquery[\\/]/
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    // 压缩 css
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g, //一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
      cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    }),
  ]
}
```

:::tip
生产配置主要是拆分代码，压缩 css
:::

#### 测试开发模式

运行 `npm run dev`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190315145851.png)

并且自动打开浏览器，图片和字体都出来了，打开控制台也能看到跨域成功、源码定位，**因为将 devtool 设置为 'source-map'，所以就会生成 map 文件，体积较大**

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190315144943.png)

#### 测试生产模式

运行 `npm run build`

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190315145135.png)

打开 dist/index.html 文件

![](https://raw.githubusercontent.com/ITxiaohao/blog-img/master/img/webpack/20190315145327.png)

:::warning 注意！！
生产模式下跨域失败是很正常的，而且如果是 vue 项目打包完之后是无法直接打开 index.html 文件查看效果的

必须要放在服务器上，一般都是将打包后的文件放入 nginx 中，然后在 nginx 中配置跨域地址，详情可以查看我写的 nginx 的内容
:::

还有一种配置 webpack 开发和生产环境的方式，会比较常用：

修改 webpack.base.conf.js

```js
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

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
  plugins: [
    // 开发环境和生产环境二者均需要的插件
    new HtmlWebpackPlugin({
      title: 'webpack4 实战',
      filename: 'index.html',
      template: path.resolve(__dirname, '..', 'index.html'),
      minify: {
        collapseWhitespace: true
      }
    }),
    new webpack.ProvidePlugin({ $: 'jquery' }),
    new CleanWebpackPlugin()
  ],
  performance: false
}
```

修改 webpack.dev.conf.js

```js
const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.base.conf.js')

const path = require('path')

const devConfig = {
  mode: 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2 // 在一个 css 中引入了另一个 css，也会执行之前两个 loader，即 postcss-loader 和 sass-loader
            }
          },
          'sass-loader', // 使用 sass-loader 将 scss 转为 css
          'postcss-loader' // 使用 postcss 为 css 加上浏览器前缀
        ]
      }
    ]
  },
  devtool: 'cheap-module-eval-soure-map',
  devServer: {
    contentBase: path.join(__dirname, '../dist/'),
    port: 8000,
    hot: true,
    overlay: true,
    proxy: {
      '/comments': {
        target: 'https://m.weibo.cn',
        changeOrigin: true,
        logLevel: 'debug',
        headers: {
          Cookie: ''
        }
      }
    },
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}

module.exports = merge(commonConfig, devConfig)
```

修改 webpack.prod.conf.js

```js
const merge = require('webpack-merge')
const commonConfig = require('./webpack.base.conf.js')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 将 css 单独打包成文件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩 css

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2 // 在一个 css 中引入了另一个 css，也会执行之前两个 loader，即 postcss-loader 和 sass-loader
            }
          },
          'sass-loader', // 使用 sass-loader 将 scss 转为 css
          'postcss-loader' // 使用 postcss 为 css 加上浏览器前缀
        ]
      }
    ]
  },
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
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[id]-[contenthash].css'
    }),
    // 压缩 css
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g, //一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
      cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    }),
  ]
}

module.exports = merge(commonConfig, prodConfig)
```


修改 package.json 的 script 命令

```json
{
  "scripts": {
    "dev": "webpack-dev-server --open --config ./build/webpack.dev.conf.js",
    "build": "webpack --config ./build/webpack.prod.conf.js"
  }
}
```

在之前的基础又修改了一下配置，重新打包即可

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
