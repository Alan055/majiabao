'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf') // 删除一些文件
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const argv = require('yargs').argv
let open = argv.open  //open 指定打包
if(open) {
  open = open.replace(/^\//, '').replace(/\/$/, '')
}

const spinner = ora('building for production...')
spinner.start()

// 需要删除文件和文件夹 因为这个是多入口的项目
let filesToRemove = function() {
  let paths = []
  if(open) {
    paths.push(open)
  } else {
    paths.push(config.build.assetsSubDirectory)
    paths.push('pages')
    paths.push('map')
  }

  paths = paths.map(item => path.join(config.build.assetsRoot, item))
  return paths.length > 1 ? `{${paths.join()}}` : paths[0]
}()

rm(filesToRemove, err => {
  if (err) throw err

  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
