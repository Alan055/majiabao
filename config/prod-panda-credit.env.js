"use strict";
const argv = require('yargs').argv; //获取node命令参数

let path, kingPath, resourceUrl;

if (argv.vs) {
    resourceUrl = '"/' + argv.vs + '/"';
    path = '"https://static.yskjd.cn' + '/' + argv.vs + '"';
    kingPath = '"https://static.yskjd.cn' + '/' + argv.vs + '/king"';
} else {
    resourceUrl = '"/"';
    path = '"https://static.yskjd.cn"'
    kingPath = '"https://static.yskjd.cn/king"'
}

module.exports = {
    NODE_ENV: '"production"',
    api: '"https://api.yskjd.cn/app"',
    apiUser: '"https://api.yskjd.cn/usercenter"',
    activity: '"https://api.yskjd.cn/opts/api/optking"',
    apiData: '"https://api.yskjd.cn/statistics"', // 埋点
    resourceUrl: resourceUrl,
    path: path,
    kingPath: kingPath,
    staticPath: '"https://static.yskjd.cn"',
    operation: '"https://api.yskjd.cn/opts/api/optking/"', //运营线
    emptyAPi:'""', //特殊情况，无前缀，接口地址通过接口下发
};
