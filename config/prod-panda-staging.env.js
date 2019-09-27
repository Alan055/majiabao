"use strict";
const argv = require('yargs').argv; //获取node命令参数

let path, kingPath, resourceUrl;

if (argv.vs) {
    resourceUrl = '"/' + argv.vs + '/"';
    path = '"https://static.jm866.cn' + '/' + argv.vs + '"';
    kingPath = '"https://static.jm866.cn' + '/' + argv.vs + '/king"';
} else {
    resourceUrl = '"/"';
    path = '"https://static.jm866.cn"'
    kingPath = '"https://static.jm866.cn/king"'
}

module.exports = {
    NODE_ENV: '"production"',
    api: '"https://api.jm866.cn/app"',
    apiUser: '"https://api.jm866.cn/usercenter"',
    activity: '"https://api.jm866.cn/opts/api/optking"',
    apiData: '"https://api.jm866.cn/statistics"', // 埋点
    resourceUrl: resourceUrl,
    path: path,
    kingPath: kingPath,
    staticPath: '"https://static.jm866.cn"',
    operation: '"https://api.jm866.cn/opts/api/optking/"', //运营线
    emptyAPi:'""', //特殊情况，无前缀，接口地址通过接口下发
};
