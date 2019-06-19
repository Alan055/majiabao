/* eslint-disable */
/* RESTFUL APIs
    - 包含跟服务器交互的常用方法
    @param path 请求的url
    @param data 前端传递给后台的数据对象
    @param params 查询对象，将被parse成类似"?a=1&b=2"的形式拼在path后面
   共包含五种方法：
    Rest#post     - 增
    Rest#delete   - 删
    Rest#put      - 改
    Rest#get      - 查
    Rest#upload   - 上传

   Usage:
    import rest from './rest'

    rest.post('user/new', {
      name: 'jacket'
    }).then(function (res) {
      // Do something...
    })
    .catch()
    .finally()
*/
import axios from "axios"; // 使用 axios 做请求
import qs from "qs";
import store from "../store";
import { Toast } from "@/utils/helper";
import { Indicator } from "@/utils/helper";
import util from "@/utils";
import storage from "@/utils/storage";
import helper from "@/utils/helper";
import appBridge from '@/services/AppBridge'


function Rest() {}

Rest.prototype = {
    // 增 - POST
    post(path, data, params) {
        if (params) path = parse(path, params);
        return requestHelper('POST', path, data);
    },
    // 删 - DELETE
    delete(path, params) {
        if (params) path = parse(path, params);
        return requestHelper('DELETE', path);
    },
    // 改 - PUT
    put(path, data, params) {
        if (params) path = parse(path, params);
        return requestHelper('PUT', path, data);
    },
    // 查 - GET
    get(path, params) {
        if (params) path = parse(path, params);
        return requestHelper('GET', path);
    },

    // 上传 - POST
    upload(path, formData, config) {
        return uploadHelper(path, formData, config);
    },
    // 原始axios
    axios(config) {
        let setting = apiSetting(config)
        return doAxios(setting)
    },

    // user请求
    user(path, data, config = {}) {
        config.baseURL = process.env.apiUser
        return requestHelper('post', path, data, config)
    },
    // app请求
    app(path, data, config = {}) {
        /*if (process.env.NODE_ENV != "production") {
            this.webRequest(path, data);
            return;
        }*/
        data = mergeBaseData(data)
        for (let key in data) {
            if (typeof data[key] == 'object') {
                data[key] = JSON.stringify(data[key])
            }
        }
        if (!data.hasOwnProperty('json')) {
            data.json = config.hasOwnProperty('json') ? config.json : true
        }
        let baseURL = config.baseURL || process.env.api
        if (location.hostname.includes('192.168')) {
            baseURL = location.protocol + '//' + location.host
        }

        data.url = baseURL + path
        data.method = 'post'
        return new Promise((resolve, reject) => {
            appBridge.request(data, resolve)
        })
    },
    //活动请求
    activityRequest(path, data) {
        data = mergeBaseData(data)
        let formdata = formData(data);
        let setting = {
            url: path,
            method: 'post',
            baseURL: process.env.activity,
            timeout: 15000,
            data: formdata,
            headers: {
                // "content-type": "application/json"
                // "content-type": "application/x-www-form-urlencoded"
            }
        }
        return doAxios(setting)
    },

    /**
     * 针对外部接口请求的统一分发
     * @param api 接口地址
     * @param type URL类型
     * @param data  接口数据
     * @param setting  axios设置
     */
    outsideRequest({ api, type, data, setting }) {

        let res = formData(mergeBaseData(data));

        let BaseSetting = {
            url: api,
            method: 'post',
            baseURL: process.env[type],
            timeout: 15000,
            data: res,
            headers: {}
        }
        return doAxios(Object.assign(BaseSetting, setting))

    },
    // web请求
    webRequest(path, data, config = {}) {
        data = mergeBaseData(data)

        let token = util.getParams('token') || storage.get('token');
        if (data.hasOwnProperty('token') && data.token) {
            token = data.token
        }
        let setting = {
            url: path,
            method: 'post',
            baseURL: process.mode == 'build' ? process.env.api : '', //使用代理
            // baseURL:process.env.api,  //使用代理
            timeout: 30000,
            data,
            transformRequest: [function(data, headers) {
                // Do whatever you want to transform the data
                return qs.stringify({ params: JSON.stringify(data) });
            }],
            headers: {
                // token放在地址栏或者localstorage
                "token": token
            }
        };
        return doAxios(util.extend(setting, config))
    }
}

function formData(obj) {
    let result = new FormData();
    for (let i in obj) {
        result.append(i, obj[i]);
    };
    return result;
}

export { formData }

/* 格式化请求路径
    @param path 请求路径
    @param params 查询对象或字符串
  Usage:
    parse('user/query', '?name=j&age=21')
    or
    parse('user/query', { name: 'j', age: '21' })
  将输出：'user/query?name=j&age=21'
*/
function parse(path, params) {
    if (path.charAt(path.length - 1) == '/') path = path.substr(0, path.length - 1);
    if (util.isString(params)) return path + '/' + params;
    if (util.isObject(params)) {
        var search = '?',
            counter = 0;
        for (var key in params) {
            if (counter) search += '&';
            search += key + '=' + params[key];
            counter++;
        }
        return path + search;
    }
    return path;
}


function success(setting, res) {
    console.group("请求地址：", setting.url);
    console.groupCollapsed("参数：", setting);
    console.groupEnd();
    console.groupCollapsed("响应数据：", res.data);
    console.groupEnd();
    console.groupEnd();
    // if (res.status.code == "403" && location.hash != '#/login') {
    //   storage.remove(['token'])
    //   location.hash = '/';
    // }
}

function fail(e) {
    // if(xhr.autoReportError === false){
    //   return;
    // }
    // if (xhr.status === 404) {
    //   Toast('请求失败(404)');
    // } else if (xhr.status === 403) {
    //   Toast('请求失败(403)');
    //   // Toast('请重新登录');
    //   // location.hash = '/login';
    // } else if (xhr.status === 500) {
    //   Toast('请求失败(500)');
    // } else if (xhr.status === 0) {
    //   xhr.aborted || Toast('网络连接失败');
    // } else if (textStatus === 'parsererror') {
    //
    // } else if (textStatus === 'timeout') {
    //   Toast('请求超时');
    // } else {
    //   Toast('请求失败');
    // }
}

// 普通请求
function requestHelper(type, path, data, config = {}) {
    util.extend(config, { method: type, url: path, data })
    let setting = apiSetting(config);
    return doAxios(setting)
}

// 上传请求
function uploadHelper(path, formdata, config) {

    formdata.append("ver", store.state.baseData.ver);
    formdata.append("verno", store.state.baseData.verno);
    formdata.append("deviceId", store.state.baseData.deviceId);
    formdata.append("deviceType", store.state.baseData.deviceType);
    formdata.append("timestamp", util.getTimeString());
    formdata.append("productId", store.state.baseData.productId);
    formdata.append("channelId", store.state.baseData.channelId);
    formdata.append("deviceToken", store.state.baseData.deviceToken);
    formdata.append("token", store.state.baseData.token);
    formdata.append("jfchannel", store.state.baseData.jfchannel);

    let setting = util.extend({
        url: path,
        headers: { "Content-Type": "multipart/form-data" },
        baseURL: process.env.uploadApi,
        data: formdata,
        timeout: 60000,
        // onUploadProgress: progress
    }, config);

    return doAxios(setting);
}

// 参数转换
function apiSetting(config) {

    let setting = {
        // url: config.path,
        method: "post",
        baseURL: process.env.api,
        timeout: 15000
    };
    console.log("fromUserId" + util.getParams()['fromUserId']);

    util.extend(setting, config)

    // // 绑定公共参数
    // let data = util.extend({}, setting.data, store.state.baseData);
    // // 添加时间戳参数
    // data.timestamp = util.getTimeString();
    //
    // let type = setting.method
    // if (type.toLowerCase() == 'post' || type.toLowerCase() == 'put') {
    //   data = qs.stringify(data)
    // }
    // setting.data = data;

    // let token = storage.get('token')
    // if (token && token !== 'null') {
    //   if (!setting['headers']) setting['headers'] = {};
    //   setting['headers']['X-Token'] = token;
    // }

    return setting;
}

// 请求主体
function doAxios(setting) {
    return new Promise((resolve, reject) => {
        // 断网处理
        if (!helper.isOnline()) {
            helper.offlineFunc()
            reject()
            return false
        }
        axios(setting).then(res => {
            success(setting, res)
            resolve(res.data)
        }).catch(e => {
            fail(e)
            reject(e)
        })
    })
}

// 合并参数
function mergeBaseData(data) {
    let baseData = {
        // userid: "1"
    }
    return util.extend({}, data, baseData);
}


const rest = new Rest;

export default rest;