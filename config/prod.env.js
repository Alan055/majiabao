"use strict";
const argv = require('yargs').argv; //获取node命令参数

let path, kingPath, resourceUrl;

if (argv.vs) {
    resourceUrl = '"/' + argv.vs + '/"';
    path = '"https://static.sinawallent.com' + '/' + argv.vs + '"';
    kingPath = '"https://static.sinawallent.com' + '/' + argv.vs + '/king"';
} else {
    resourceUrl = '"/"';
    path = '"https://static.sinawallent.com"'
    kingPath = '"https://static.sinawallent.com/king"'
}

module.exports = {
    NODE_ENV: '"production"',
    api: '"https://api.sinawallent.com/app"',
    apiUser: '"https://api.sinawallent.com/usercenter"',
    activity: '"https://api.sinawallent.com/opts/api/optking"',
    apiData: '"https://api.sinawallent.com/statistics"', // 埋点
    resourceUrl: resourceUrl,
    path: path,
    kingPath: kingPath,
    staticPath: '"https://static.sinawallent.com"',
    operation: '"https://api.sinawallent.com/opts/api/optking/"', //运营线
};