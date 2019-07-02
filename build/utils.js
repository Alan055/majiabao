'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const glob = require('glob') // 匹配路径中文件的插件
const merge = require('webpack-merge') // 合并对象的插件
const HtmlWebpackPlugin = require('html-webpack-plugin') // html中将css文件加上hash值  保证每次打包的css都不一样  这样用户就不需要清楚缓存来清空css了
const argv = require('yargs').argv
let open = argv.open  //open 指定打包
open && (open = open.replace(/^\//, '').replace(/\/$/, '')) // 如果存在就去掉两边的斜杠

const cliParams = require('./cliParams')
const theme = JSON.parse(cliParams.theme)

let dev = process.env.NODE_ENV != 'production' // 当前环境是不是开发环境

exports.currentTheme = theme

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // 这里是设置全局样式的
  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    if (loader == 'sass') {
      loaders.push({
        loader: 'sass-resources-loader',
        options: {
          // Provide path to the file with resources
          resources: path.resolve(__dirname, `../src/assets/sass/theme/${theme}/base.scss`),
          // Or array of paths
          // resources: ['./path/to/vars.scss', './path/to/mixins.scss']
        },
      })
    }

    // if (loader == 'less') {
    //   loaders.push({
    //     loader: 'style-resources-loader',
    //     options: {
    //       patterns: path.resolve(__dirname, '../src/assets/less/common/base.less'),
    //       injector: 'append'
    //     },
    //   })
    // }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        publicPath: '../../', //相对路径（css相对于img）
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// loader中的样式模块 根据是样式文件less、stylus、scss等文件  然后选择对应额loader[less或stylus或scss]模块来转换成webpack可以处理的模块
// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
    // 格式是 [{ test: /\.less$/, use: 'less-loader' }]
  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

// 根据环境和参数 来确定是否要单独打包 一起打包 或者全部启动  从而返回相应的一个或多个entry.js的位置
const entries = function() {
    // 是否是指定打包
  if(open) {
    if(!dev) { // 如果是生产环境时
      console.log('指定打包模式下只会打包第一个模块');
      return glob.sync(`./src/modules/${open}/entry.js`); // 一般都会走到这儿来
    } else {
      return glob.sync(`./src/modules/${open}/**/entry.js`);
    }
  }
  else {
    return glob.sync('./src/modules/**/entry.js') // 同步匹配 /src/modules/ 目录下 某个下级文件夹下 的entry.js文件 也就是所有的entry.js 这个就是多入口
  }
}()

// 多入口的配置
exports.getEntries = function () {
  const entry = {}
  for (const path of entries) {
    const chunkName = path.slice('./src/modules/'.length, -'/entry.js'.length) // 获取 /src/modules/ 目录和 entry.js  文件中间的这个文件夹的名称
    entry[chunkName] = path // 用这个名称来作为打包后台的多出口文件夹目录
  }
  entry['babel-polyfill'] = 'babel-polyfill';
  return entry
}

exports.getHtmlPlugins = function (config) {
  const htmlPlugins = []
  for (const path of entries) {
    const chunkName = path.slice('./src/modules/'.length, -'/entry.js'.length)
    let filename = `./pages/${chunkName}/index.html`
    if(open && !dev) {
      filename = `.${chunkName.replace(open, '')}/index.html`
      config.resourceUrl = chunkName.split('/').map(item => '').join('../')
    }
    // const filename = open && !dev ? `./index.html` : `./pages/${chunkName}/index.html`

    htmlPlugins.push(new HtmlWebpackPlugin(merge({
      template: 'index.html',
      filename,
      inject: true,
      chunksSortMode: 'dependency',
      chunks: ['manifest', 'vendor', chunkName]
    }, config)))
  }
  return htmlPlugins
}
