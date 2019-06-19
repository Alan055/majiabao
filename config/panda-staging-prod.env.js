"use strict";
const argv = require('yargs').argv; //获取node命令参数

let path, kingPath, resourceUrl;

if (argv.vs) {
    resourceUrl = '"/' + argv.vs + '/"';
    path = '"https://static.baidu.com' + '/' + argv.vs + '"';
    kingPath = '"https://static.baidu.com' + '/' + argv.vs + '/king"';
} else {
    resourceUrl = '"/"';
    path = '"https://static.baidu.com"'
    kingPath = '"https://static.baidu.com/king"'
}

module.exports = {
    NODE_ENV: '"production"',
    api: '"https://api.baidu.com/app"',
    apiUser: '"https://api.baidu.com/usercenter"',
    activity: '"https://api.baidu.com/opts/api/optking"',
    apiData: '"https://api.baidu.com/statistics"', // 埋点
    resourceUrl: resourceUrl,
    path: path,
    kingPath: kingPath,
    staticPath: '"https://static.baidu.com"',
    operation: '"https://api.baidu.com/opts/api/optking/"', //运营线
};