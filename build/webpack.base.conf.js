'use strict'
const path = require('path')
const webpack = require('webpack')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const cliParams = require('./cliParams')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpackSkeleton = require('./webpack.skeleton.conf')
//const webpackSkeleton = require('vue-skeleton-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: utils.getEntries(),
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: utils.assetsPath('img/[name].[hash:7].[ext]')
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: process.env.NODE_ENV != 'production',
                        },
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            '$config': cliParams
        }),
        new webpack.ProvidePlugin({
            moment: "moment"
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        // 防止加载全部theme
        new webpack.ContextReplacementPlugin(/sass[\/\\]theme$/, new RegExp(utils.currentTheme + '[\\/\\\\]')),

        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css'),
            allChunks: true,
        }),

        ...webpackSkeleton,

    ],
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}
