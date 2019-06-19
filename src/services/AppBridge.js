/*
  sinaif伪协议
*/

import util from "@/utils";
import EventBus from './EventBus'
import qs from 'qs'
import DefendClick from '@/utils/DefendClick'

window.setToken = function(data) {
    window.token = data;
};

window.sendData = function(data, callbackName) {
    // % => %25  ' => %27   " => %22   \ => %5C
    // $ => $25  ' => $27   " => $22   \ => $5C

    // 对json string进行转化，其他数据直接放行
    if (typeof data == 'string' && data.indexOf('{') == 0) {
        if (data.indexOf('$22') == -1) {
            alert('请安装最新版的APP')
        }
        // data = decodeURIComponent(data)
        //   data = data.replace('"{', '{').replace('}"', '}').replace('"[', '[').replace(']"', ']');
        data = data.replace(/\$5C/g, '\\').replace(/\$22/g, '"').replace(/\$27/g, '\'').replace(/\$25/g, '$');
        data = JSON.parse(data)
            // console.log('response data', data);
    } else {
        console.log('App response', data)
    }

    // 判断回调函数
    let callback = typeof callbackName == "string" ? window[callbackName] : callbackName
    if (!callback) return

    if (callback.callbackName) {
        // 打印数据来源
        log(callback, data)
            // 防止二次回调
            // delete window[callback.callbackName]
    }
    callback(data)
};

//全局注册back函数
window.back = function(data) {
    console.log('back', data)
    EventBus.$emit('back', data)
};

//全局注册消息接收函数 (页面数据刷新)
window.receiverMsg = function(data) {
    console.log('receiveMsg', data, window.location.href)
    EventBus.$emit('refreshData', data)
};

const appurl = "hsinaif://";

function log(callback, data) {
    if (callback.url.includes(appurl + 'request')) { //网络请求
        let cbUrl = callback.url.split('?')[1].split("#")[0];
        let params = qs.parse(cbUrl);
        console.info("伪协议请求地址：", params.url);

        let { callbackName, method, url, json, ...other } = params;
        console.info("参数：", other);
    } else {
        console.info("伪协议请求地址：", callback.url);
    }

    console.info("响应数据：", data);
    console.debug("============End==============================")
}
// 生成标准接口
function generator(type) {
    return function(data = {}, callback) {
        return new Promise((resolve, reject) => {
            if (typeof data == "function") {
                callback = data;
                data = {};
            }
            if (callback) {
                data.callbackName = registerAction(callback)
            }
            // 回调可以写在promise里面
            else {
                data.callbackName = registerAction(resolve)
            }
            callApp(type, data);
        })
    };
}

// 全局注册回掉函数
let actionId = 0;

function registerAction(action) {
    let actionName = "callBackAction_" + actionId;
    actionId++;
    window[actionName] = action;
    return actionName;
}
window.registerAction = registerAction

// 在调用以下原生接口时 需防止多次点击(点击间隔500ms)
const defendClick = new DefendClick({ gapTime: 500 })
const defendList = ['scanIDCard', 'dialogView', 'pickerView', 'chooseAddress', 'chooseCity', 'activityView', 'showSmsView']

// 调取app接口
function callApp(type, data) {
    if (defendList.indexOf(type) > -1 && defendClick.prevent()) return
    let params = {}
    Object.keys(data).forEach(key => {
        let value = data[key]
        if (util.isArray(value)) {
            value = value.join()
        }
        if (typeof value == 'object') {
            value = JSON.stringify(value)
        }
        params[key] = value
    })
    params = qs.stringify(params)
    let lastUrl = appurl + encodeURIComponent(type) + "?" + params;

    // 在回调方法体上储存url和name
    window[data.callbackName].url = decodeURIComponent(lastUrl)
    window[data.callbackName].callbackName = data.callbackName
    window[data.callbackName].actionType = type

    setIframe(lastUrl);
}

// 利用iframe调取伪协议
function setIframe(url) {
    let iframe = document.createElement("iframe");
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(function() {
        if (iframe.remove) {
            iframe.remove();
        } else {
            iframe.parentNode.removeChild(iframe);
        }
    }, 100);
}

const apiList = [
    'request', // 发起网络请求
    'downloadFile', // 下载文件
    'uploadFile', // 上传文件
    'setStorage', // 数据缓存-保存数据
    'getStorage', // 数据缓存-获取数据
    'removeStorage', // 数据缓存-删除数据
    'chooseImage', // 图片-选择图片
    'previewImage', // 图片-预览图片
    'getLocation', // 获取位置
    'getSystemInfo', // 获取手机设备信息
    'getNetwork', // 获取网络状态
    'makePhoneCall', // 拨打电话
    'permission', // 申请权限
    'setClipboardData', // 设置剪贴板内容
    'getClipboardData', // 获取系统剪贴板内容
    'activityView', // 活动窗口功能(新建一个窗口)
    'dialogView', // 弹窗
    'toast', // Toast提示
    'pickerView', // 底部弹出选择框
    'loadingView', // loadingView
    'chooseAddress', // 省市区选择框
    'chooseCity', // 省市选择框
    'recordVideoToBoc', // 影像资料录制
    'chooseContacts', // 通讯录选择联系人
    'scanIDCard', // 依图扫描身份证
    'takePhoto', //拍照
    'livingBodyCheck', // 依图活体检查
    'scanBankCard', // 依图银行卡扫描
    'launchApp', // 打开第三方程序
    'share', // 社会化分享
    'getAddressByCountryCode', // 区县code反查省市区
    'getInitData', // 获取初始化数据
    'initMJP', // 获取马甲包初始化数据
    'getUserInfo', //获取用户信息
    'goNative', //跳转原生页面
    'showSmsView', // 弹出验证码输入框
    'setStatusColor', // 设置状态栏颜色
    'getStatusHeight', //获取客户端状态栏高度
    'refreshHome', //刷新首页状态
    'showHomeView', //回到首页
    'notify', //广播消息
    'goMarket', //去好评/前往应用商店/AppStore
    'getVisitUrl', // 根据Key值获取相应的初始化数据
    'webViewHeight', // 设置web窗口高度
    'setWebAttribute', // 设置web窗口属性
    'setWebTitleAttribute', // 设置WebView title右上角事件属性
    'storeStatistics', // 埋点
    'getHomeData',
    'checkNotificationEnabled', //检查消息推送是否打开
    'getUserAuto', //获取sdk自动登录缓存数据
]
const api = {}
apiList.forEach(type => {
    api[type] = generator(type);
});
api.isApp = !!util.getParams("appVersion");

export default api;
