//let proxy = 'dev';
//历史命名遗留问题，暂时这样牵强处理，如果调试测试环境数据放开注释
let proxy = 'test';
// let proxy = 'actest';

//代理的所有请求前缀
let proxyArray = [
    "repay",
    "sys",
    "userBase",
    "match",
    "loan",
    "bankCard",
    "offlineloan",
    "withdrawCash",
    "credit",
    "bill",
    "act",
    "information"
];

let target = `http://king-app-web.king-${proxy}.svc.cluster.local:9090`; //process.env.api,
//let target = `http://192.168.8.30:8091/`; //process.env.api,
let targetUserCenter = `http://sinaif-usercenter-web.king-${proxy}.svc.cluster.local:9090`; //用户中心 apiUser
let targetOptKing = `http://sinaif-opt-king-web.optactive-${proxy}.svc.cluster.local:9090`; //运营线
let proxyTable = {};

proxyArray.forEach(item => {
    let newTarget = target;
    if (item == 'sys') { //调试帮助中心放开注释
        //newTarget = targetUserCenter;
    }
    if (item == 'act') { //调试运营线放开注释
        newTarget = targetOptKing;
    }
    let table = {
        target: newTarget + "/" + item,
        changeOrigin: true
    };
    let rewrite = {}
    rewrite["^/" + item] = "";
    table['pathRewrite'] = rewrite;

    proxyTable["/" + item] = table;
});
console.log('proxyTable', proxyTable)
module.exports = proxyTable;
