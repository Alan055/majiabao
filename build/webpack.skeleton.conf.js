'use strict';
const utils = require('./utils')
const path = require('path')
const SkeletonWebpackPlugin = require('./webpack-skeleton-plugin')  //官方插件vue-skeleton-webpack-plugin 有bug，我改了源码
const fs = require("fs")

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

//生成骨架相关配置
let skeletonPlugins = [], entry = {}

Object.getOwnPropertyNames(utils.getEntries()).forEach(function (key) {

    let entryKey = (key.indexOf('/') ? [key] : key.split('/')[0])[0];

    //入口形式： module:path, 有模块需要骨架配置才加载
    let path = resolve(`src/modules/${entryKey}/skeleton/entry-skeleton.js`);

    if (!entry[entryKey] && fs.existsSync(path)) {

        if (fs.existsSync(resolve(`src/modules/${entryKey}/routeList.js`))) {

            let routerList = require(`../src/modules/${entryKey}/routeList.js`), routers = []
            routerList.map(item => {
                if (item.hasOwnProperty('isNeedSkeleton') && item.isNeedSkeleton) {
                    routers.push({
                        path: item.path,
                        skeletonId: `${entryKey}_${item.name}`
                    })
                }
            })
            if (routers.length) {

                entry[entryKey] = path

                skeletonPlugins.push(new SkeletonWebpackPlugin({
                    webpackConfig: {entry},
                    quiet: true,
                    minimize: true,
                    insertAfter: '<div id="app">',
                    router: {
                        mode: 'hash',
                        routes: routers
                    },
                }))
            }
        } else {
            console.log(`${entryKey}模块未找到骨架路由`)
        }
    }
})

/*console.log('=============>');
console.error(JSON.stringify(entry,null,2));


console.log('skeletonPlugins=============>');
console.error(JSON.stringify(skeletonPlugins,null,2));*/


module.exports = skeletonPlugins;
