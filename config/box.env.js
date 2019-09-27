"use strict";
const argv = require('yargs').argv; //获取node命令参数

let path, kingPath, resourceUrl;

if (argv.vs) {
    resourceUrl = '"/' + argv.vs + '/"';
    path = '"https://staticbox.sinawallent.com' + '/' + argv.vs + '"';
    kingPath = '"https://staticbox.sinawallent.com' + '/' + argv.vs + '/king"';
} else {
    resourceUrl = '"/"';
    path = '"https://staticbox.sinawallent.com"'
    kingPath = '"https://staticbox.sinawallent.com/king"'
}

module.exports = {
    NODE_ENV: '"production"',
    api: '"https://apibox.sinawallent.com/app"',
    apiUser: '"https://apibox.sinawallent.com/usercenter"',
    activity: '"https://apibox.sinawallent.com/opts/api/optking"',
    apiData: '"https://apibox.sinawallent.com/statistics"', // 埋点
    resourceUrl: resourceUrl,
    path: path,
    kingPath: kingPath,
    staticPath: '"https://staticbox.sinawallent.com"',
    operation: '"https://apibox.sinawallent.com/opts/api/optking/"', //运营线
    emptyAPi:'""', //特殊情况，无前缀，接口地址通过接口下发
};
