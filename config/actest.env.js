"use strict";

const argv = require('yargs').argv; //获取node命令参数

let path, kingPath, resourceUrl;

if (argv.vs) {
    resourceUrl = '"/' + argv.vs + '/"';
    path = '"http://static.szzmdw.com' + '/' + argv.vs + '"';
    kingPath = '"http://static.szzmdw.com' + '/' + argv.vs + '/king"';
} else {
    resourceUrl = '"/"';
    path = '"http://static.szzmdw.com"'
    kingPath = '"http://static.szzmdw.com/king"'
}

module.exports = {
    NODE_ENV: '"development"',
    api: '"http://api.szzmdw.com/app"',
    apiUser: '"http://api.szzmdw.com/usercenter"',
    activity: '"http://api.szzmdw.com/opts/api/optking"',
    apiData: '"http://api.szzmdw.com/statistics"', // 埋点
    resourceUrl: resourceUrl,
    path: path,
    kingPath: kingPath,
    staticPath: '"http://static.szzmdw.com"',
    emptyAPi:'""', //特殊情况，无前缀，接口地址通过接口下发
};
