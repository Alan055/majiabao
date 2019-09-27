'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const glob = require('glob')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const argv = require('yargs').argv
let open = argv.open  //open 指定打包
if(open) {
  open = open.replace(/^\//, '').replace(/\/$/, '')
}

const cliParams = require('./cliParams')
const theme = JSON.parse(cliParams.theme)

let dev = process.env.NODE_ENV != 'production'

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

const entries = function() {
  if(open) {
    if(!dev) {
      console.log('指定打包模式下只会打包第一个模块');
      return glob.sync(`./src/modules/${open}/entry.js`);
    }
    else {
      return glob.sync(`./src/modules/${open}/**/entry.js`);
    }
  }
  else {
    return glob.sync('./src/modules/**/entry.js')
  }
}()

exports.getEntries = function () {
  const entry = {}
  for (const path of entries) {
    const chunkName = path.slice('./src/modules/'.length, -'/entry.js'.length)
    entry[chunkName] = path
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
