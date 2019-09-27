"use strict";

const argv = require('yargs').argv; //获取node命令参数

let path, kingPath, resourceUrl;

if (argv.vs) {
    resourceUrl = '"/' + argv.vs + '/"';
    path = '"http://static.sinawallent.com' + '/' + argv.vs + '"';
    kingPath = '"http://static.sinawallent.com' + '/' + argv.vs + '/king"';
} else {
    resourceUrl = '"/"';
    path = '"http://static.sinawallent.com"'
    kingPath = '"http://static.sinawallent.com/king"'
}

module.exports = {
    NODE_ENV: '"development"',
    api: '"http://api.sinawallent.com/app"',
    apiUser: '"http://api.sinawallent.com/usercenter"',
    activity: '"http://api.sinawallent.com/opts/api/optking"',
    apiData: '"http://api.sinawallent.com/statistics"', // 埋点
    resourceUrl: resourceUrl,
    path: path,
    kingPath: kingPath,
    staticPath: '"http://static.sinawallent.com"',
    emptyAPi:'""', //特殊情况，无前缀，接口地址通过接口下发
};
