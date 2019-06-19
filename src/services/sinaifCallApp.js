// import util from "../utils/index";

function isType(type) {
  return function(obj) {
    return {}.toString.call(obj) == "[object " + type + "]";
  };
}
const util = {
  mergeObj() {
    return Object.assign(...arguments);
  },
  /* 判断 obj 是否为 null
     Usage:
       var obj = null;
       t.isNull(obj); // 输出 true
  */
  isNull: function(obj) {
    return obj === null || obj !== obj;
  },

  /* 判断 obj 是否为 function
     Usage:
       var obj = 'abc';
       t.isFunction(obj); // 输出 false
  */
  isFunction: isType("Function"),

  /* 判断 obj 是否为 object
     Usage:
       var obj = {};
       t.isObject(obj); // 输出 true
  */
  isObject: isType("Object"),

  /* 判断 obj 是否为 array
     Usage:
       var obj = ['abc'];
       t.isArray(obj); // 输出 true
  */
  isArray: window.isArray || isType("Array"),

  /* 判断 obj 是否为 string
     Usage:
       var obj = 'abc';
       t.isString(obj); // 输出 true
  */
  isString: isType("String"),

  /* 判断 obj 是否为 undefined
     Usage:
       var obj = 'abc';
       t.isUndefined(obj); // 输出 false
  */
  isUndefined: isType("Undefined")
};
/**
 * 此对象标识的值是伪协议系统
 * 直接方法调取即可
 */
// remove的垫片
(function(arr) {
  arr.forEach(function(item) {
    if (item.hasOwnProperty("remove")) {
      return;
    }
    Object.defineProperty(item, "remove", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
const SINAIF = {
  //利用链接与app进行无数据的交互
  appurl: "hsinaif://",
  callApp: function(urls, data) {
    var firstis = true;
    var url = this.appurl + encodeURIComponent(urls);
    if (urls) {
      if (typeof urls != "string") {
        console.error("请输入String类型");
        return;
      }
    }
    if (data) {
      if (typeof data != "object") {
        console.error("请输入Object类型");
        return;
      } else {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            if (firstis) {
              url += "?" + key + "=" + encodeURIComponent(data[key]);
              firstis = false;
            } else {
              url += "&" + key + "=" + encodeURIComponent(data[key]);
            }
          }
        }
      }
    }
    console.log(url);
    var iframe = document.createElement("iframe");
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(function() {
      iframe.remove();
    }, 100);
  },
  //格式化参数校验
  formatDate: data => {
    for (var key in data) {
      // console.log(data[key])
      if (data[key] === "" || data[key] === " " || data[key] === undefined) {
        var ht = "参数" + key + "有误";
        console.error(ht);
        return;
      }
    }
  },
  callBackAction: [],
  registerAction: function(action) {
    let length = this.callBackAction.length;
    let actionName = "callBackAction" + this.callBackAction.length;
    this.callBackAction.push({
      name: actionName
    });
    this[actionName] = action;
    if (window.actionName) {
      console.error("该方法已注册！");
      return;
    } else {
      window[actionName] = action;
      return actionName;
    }
  },
  //调起原生的请求
  /**
   * @argument [option.url] 服务器接口地址 必须
   * @argument [option.method] GET/POST 选填默认post
   * @argument [option.callback] 回调函数名 必填
   * @argument [option.params] 其他参数 必填
   * SINAIF.request({
   *    url:"",
   *    method:"post",
   *    params:{
   *        name:"",
   *        mobile:"",
   *    },
   *    callback:function(){},
   * });
   */
  request: function(option) {
    //参数校验,url
    let defaultOpt = {
      method: "post"
    };

    //参数校验
    let opt = Object.assign(option, defaultOpt);

    if (
      typeof opt.url == "string" &&
      (opt.method.toLowerCase() == "get" ||
        opt.method.toLowerCase() == "post") &&
      util.isFunction(opt.callback)
    ) {
      let data = {};
      data.url = opt.url;
      data.method = opt.method;
      data.callbackName = this.registerAction(opt.callback);
      let newdata = util.mergeObj(data, opt.params);
      console.log(opt.params);
      console.log(newdata);
      this.formatDate(newdata);
      this.callApp("request", newdata);
    } else {
      throw new Error(`参数不符合规则，请检查`);
    }
  },
  //下载文件
  /**
   * @argument [option.filePath] 文件地址 必填
   * @argument [option.callback] 回调函数 必填
   * @argument [option.type] 类别 必填 1 app显示转圈等待Dialog
   * @argument [option.type] 类别 必填 2 app显示原生下载进度Dialog
   * @argument [option.type] 类别 必填 3 不显示Dialog，H5自己处理
   * @argument [option.type] 类别 必填 4 取消下载
   * SINAIF.downloadFile({
   *    filePath:"",
   *    type:1,
   *    callback:function(){},
   * });
   */
  downloadFile: function(option) {
    //参数判断
    let defaultOpt = {
      type: 1
    };
    let opts = util.mergeObj(defaultOpt, option);

    console.log(util);

    if (
      util.isString(opts.filePath) &&
      util.isFunction(opts.callback) &&
      [1, 2, 3, 4].indexOf(opts.type) > -1
    ) {
      let data = {};
      data.filePath = opts.filePath;
      data.type = opts.type;
      data.callbackName = this.registerAction(opts.callback);
      this.formatDate(data);
      this.callApp("downloadFile", data);
    } else {
      throw new Error(`参数不符合规则，请检查`);
    }
  },
  //上传文件
  /**
   * @argument [filePath] 文件地址 必填
   * @argument [callbackName] 回调函数 必填
   * @argument [url] 上传地址 必填
   * @argument [type] 类别 必填 1 app显示转圈等待Dialog
   * @argument [type] 类别 必填 2 app显示原生下载进度Dialog
   * @argument [type] 类别 必填 3 不显示Dialog，H5自己处理
   * @argument [type] 类别 必填 4 取消下载
   * SINAIF.uploadFile({
   *    url:"",
   *    filePath:"",
   *    type:1,
   *    callback:function(){},
   * });
   */
  uploadFile: function(option) {
    //参数判断
    let defaultOpt = {
      type: 1
    };
    let opts = util.mergeObj(defaultOpt, option);

    if (
      util.isString(opts.filePath) &&
      util.isFunction(opts.callback) &&
      [1, 2, 3, 4].indexOf(opts.type) > -1
    ) {
      let data = {};
      data.filePath = opts.filePath;
      data.type = opts.type;
      data.callbackName = this.registerAction(opts.callback);
      this.formatDate(data);
      this.callApp("uploadFile", data);
    } else {
      throw new Error(`参数不符合规则，请检查`);
    }
  },
  //设置缓存
  /**
   * @argument [key] 键值
   * @argument [value] value
   * SINAIF.setStorage({
   *    key:"name",
   *    value:"nihao",
   * })
   */
  setStorage: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("key") &&
      option.hasOwnProperty("value")
    ) {
      this.formatDate(option);
      this.callApp("setStorage", option);
    }
  },
  //设置缓存
  /**
   * @argument [option] 键值对
   * SINAIF.getStorage({
   *    key:"name",
   * })
   */
  getStorage: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("key") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.key = option.key;
      data.callbackName = this.registerAction(option.callback);
      this.formatDate(data);
      this.callApp("getStorage", data);
    }
  },
  //数据缓存-删除数据
  /**
   * @argument [option] 键值对
   * SINAIF.removeStorage({
   *    key:"name",
   * })
   */
  removeStorage: function(option) {
    if (util.isObject(option) && option.hasOwnProperty("key")) {
      this.formatDate(option);
      this.callApp("removeStorage", option);
    }
  },
  /**
   * 从本地相册选择一张图片。
   * option.callback 回调函数
   * 返回图片的文件URL。
   * SINAIF.chooseImage({
   *    callback:function(imageUrl){
   *        console.log(imageUrl);
   *    }
   * })
   */
  chooseImage: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.callbackName = this.registerAction(option.callback);
      this.formatDate(data);
      this.callApp("chooseImage", data);
    }
  },
  /**
   * @description {预览图片，H5传一张URL，本地展示该图片，可放大缩小查看。}
   * @argument {option.url} 图片URL
   * SINAIF.previewImage({
   *    url:""
   * })
   */
  previewImage: function(option) {
    if (util.isObject(option) && option.hasOwnProperty("url")) {
      this.formatDate(option);
      this.callApp("previewImage", option);
    }
  },
  /**
   * @description {H5调该协议，客户端根据接入的定位SDK，获取当前定位信息。}
   * @argument {option.callback} 图片URL
   * SINAIF.getLocation({
   *    callback:function({
   *            latitude:"维度",
   *            longitude:"经度",
   *            address:"定位详细地址",
   *            city:"定位当前城市",
   *        }){
   *    }
   * })
   */
  getLocation: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.callbackName = this.registerAction(option.callback);
      this.formatDate(data);
      this.callApp("getLocation", data);
    }
  },
  /**
   * @description {H5调该协议，获取手机设备信息。}
   * @argument {option.callback} 回调函数
   * SINAIF.getLocation({
   *    callback:function({
   *            brand:"品牌",
   *            model:"型号",
   *            pixelRatio:"手机像素比",
   *            screenWidth:"屏幕宽度",
   *            screenHeight:"屏幕高度",
   *            system:"系统版本",
   *            platform:"客户端平台",
   *            deviceId:"设备ID",
   *        }){
   *    }
   * })
   */
  getSystemInfo: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.callbackName = this.registerAction(option.callback);
      this.formatDate(data);
      this.callApp("getSystemInfo", data);
    }
  },
  /**
   * @description {获取网络连接信息，如网络类型，当前是否连接上}
   * @argument {option.callback} 回调函数
   * SINAIF.getNetwork({
   *    callback:function({
   *            isConnected:"是否连接上",
   *            networkType:"WIFI | 2G | 3G | 4G | none | unknown",
   *        }){
   *    }
   * })
   */
  getNetwork: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.callbackName = this.registerAction(option.callback);
      this.formatDate(data);
      this.callApp("getNetwork", data);
    }
  },
  /**
   * @description {H5调协议，客户端掉用进入博号界面}
   * @argument {option.phoneNumber} 手机号码
   * SINAIF.makePhoneCall({
   *    phoneNumber:""
   * })
   */
  makePhoneCall: function(option) {
    if (util.isObject(option) && option.hasOwnProperty("phoneNumber")) {
      let data = {};
      data.phoneNumber = option.phoneNumber;
      this.formatDate(data);
      this.callApp("makePhoneCall", data);
    }
  },
  /**
   * @description {H5调该协议检查客户端是否拥有某些敏感权限。}
   * @argument {option.scope} 敏感权限的代号
   * @argument {option.callback} 回调函数
   * SINAIF.permission({
   *    scope:"",
   *    callback:function(data){
   *        var res = JSON.parse(data);
   *        console.log(res);
   *    }
   * })
   */
  permission: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.scope = option.scope;
      data.callbackName = this.registerAction(option.callback);
      this.formatDate(data);
      this.callApp("permission", data);
    }
  },
  /**
   * @description {H5调该协议，app接收H5传入的内容方到剪贴板，供用户操作。}
   * @argument {option.scope} 敏感权限的代号
   * @argument {option.callback} 回调函数
   * SINAIF.setClipboardData({
   *    scope:"",
   *    callback:function(data){
   *        var res = JSON.parse(data);
   *        console.log(res);
   *    }
   * })
   */
  setClipboardData: function(option) {
    if (util.isObject(option) && option.hasOwnProperty("data")) {
      let data = {};
      data.data = option.data;
      this.formatDate(data);
      this.callApp("setClipboardData", data);
    }
  },
  /**
   * @description {H5调该协议，App把系统剪贴板的内容返回给H5。}
   * @argument {option.callback} 回调函数
   * SINAIF.getClipboardData({
   *    callback:function(data){
   *        var res = JSON.parse(data);
   *        console.log(res);
   *    }
   * })
   */
  getClipboardData: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.callbackName = this.registerAction(option.callback);
      this.formatDate(data);
      this.callApp("getClipboardData", data);
    }
  },
  /**
   * @description {H5调该协议，客户端会新建一个窗口。}
   * @argument {option.callback} 回调函数
   * SINAIF.activityView({
   *    callback:function(data){
   *        var res = JSON.parse(data);
   *        console.log(res);
   *    }
   * })
   */
  activityView: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("url") &&
      option.hasOwnProperty("type")
    ) {
      let defaultOpt = {
        isFull: false,
        isTrans: false,
        isCloseCurrent: false,
        refresh: false
      };
      let newdata = util.mergeObj(defaultOpt, option);
      this.formatDate(newdata);
      this.callApp("activityView", newdata);
    }
  },
  /**
   * @description {H5调该伪协议，客户端弹出一个标准化的Dialog，用户点击按钮，关闭当前的Dialog，把点击事件回传给H5。}
   * @argument {option.callback} 回调函数
   * SINAIF.dialogView({
   *    callback:function(data){
   *        var res = JSON.parse(data);
   *        console.log(res);
   *    }
   * })
   */
  dialogView: function(option) {
    if (util.isObject(option) && option.hasOwnProperty("msg")) {
      let defaultOpt = {
        leftBtn: "取消",
        rightBtn: "确定",
        isBackCancel: false
      };
      let opts = util.mergeObj(defaultOpt, option);
      let data = {};
      data.callbackName = this.registerAction(opts.callback);
      let newdata = util.mergeObj(data, opts);
      this.formatDate(newdata);
      this.callApp("dialogView", newdata);
    }
  },
  /**
   * @description {H5调该伪协议，客户端弹Toast提示}
   * @argument {option.callback} 回调函数
   * SINAIF.toast({
   *    msg:"手机号码",
   *    time:3000
   * })
   */
  toast: function(option) {
    if (util.isObject(option) && option.hasOwnProperty("msg")) {
      let defaultOpt = {
        time: 3000
      };
      let newdata = util.mergeObj(defaultOpt, option);
      this.formatDate(newdata);
      this.callApp("toast", newdata);
    }
  },
  /**
   * @description {H5调该伪协议，客户端从底部弹出一个选择框，用户点击确认按钮，则把选择结果告诉给H5处理。}
   * @argument {option.callback} 回调函数
   * @argument {option.dataSource} 数据来源：H5、app
   * @argument {option.dataArr} H5数据源，dataSource=H5，则该参数一定要有值。
   * @argument {option.dataType} 本地数据源来袭，dataSource=app，则该参数一定要有值。
    1：银行卡
    2：信用卡
    3：借款用途
   * @argument {option.title} 控件标题
   * @argument {option.select} 默认选中的选择项
   * SINAIF.pickerView({
   *    dataSource:'app',
   *    dataType:3,
   *    callback:function(e){
   *       let res = JSON.parse(e);
   *    }
   * });
   * SINAIF.pickerView({
   *    dataSource:'H5',
   *    dataArr:'["程序员","产品","测试“]',
   *    callback:function(e){
   *       let res = JSON.parse(e);
   *    }
   * });
   */
  pickerView: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      option.hasOwnProperty("dataSource") &&
      util.isFunction(option.callback)
    ) {
      let defaultOpt = {};
      let newdata = util.mergeObj(defaultOpt, option);
      newdata.callbackName = this.registerAction(newdata.callback);
      this.formatDate(newdata);
      this.callApp("pickerView", newdata);
    }
  },
  /**
   * @description {H5掉用该伪协议，从界面底部弹出省市区选择框，用户选择后，返回用户选择的省市区code跟对应的名称。}
   * @argument {option.callback} 回调函数
   * @argument {option.provinceCode} 选中的省份code
   * @argument {option.cityCode} 选中的城市code
   * @argument {option.countryCode} 选中的区县code
   * SINAIF.chooseAddress({
   *    provinceCode:440000,
   *    cityCode:440300,
   *    countryCode:440305,
   *    callback:function(e){
   *       let res = JSON.parse(e);
   *       //res.provinceCode 省份code
   *       //res.provinceName 省份名称
   *       //res.cityCode     城市code
   *       //res.cityName     城市名称
   *       //res.countyCode   区县code
   *       //res.countyName   区县名称
   *    }
   * });
   */
  chooseAddress: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let defaultOpt = {};
      let newdata = util.mergeObj(defaultOpt, option);
      newdata.callbackName = this.registerAction(newdata.callback);
      this.formatDate(newdata);
      this.callApp("chooseAddress", newdata);
    }
  },
  /**
   * @description {H5掉用该伪协议，从界面底部弹出省市区选择框，用户选择后，返回用户选择的省市区code跟对应的名称。}
   * @argument {option.callback} 回调函数
   * @argument {option.provinceCode} 选中的省份code
   * @argument {option.cityCode} 选中的城市code
   * SINAIF.chooseCity({
   *    provinceCode:440000,
   *    cityCode:440300,
   *    callback:function(e){
   *       let res = JSON.parse(e);
   *       //res.provinceCode 省份code
   *       //res.provinceName 省份名称
   *       //res.cityCode     城市code
   *       //res.cityName     城市名称
   *    }
   * });
   */
  chooseCity: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let defaultOpt = {};
      let newdata = util.mergeObj(defaultOpt, option);
      newdata.callbackName = this.registerAction(newdata.callback);
      this.formatDate(newdata);
      this.callApp("chooseCity", newdata);
    }
  },
  /**
   * @description {H5调该协议，客户端打开中银的影像信息录制。录制完毕，返回本地文件地址跟视频第一帧图片。}
   * @argument {option.callback} 回调函数
   * SINAIF.recordVideoToBoc({
   *    callback:function(e){
   *       let res = JSON.parse(e);
   *       //res.fileUrl  文件地址
   *       //res.videoImg  第一帧图片的地址
   *    }
   * });
   */
  recordVideoToBoc: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.callbackName = this.registerAction(option.callback);
      this.formatDate(data);
      this.callApp("recordVideoToBoc", data);
    }
  },
  /**
   * @description {H5调用该协议，客户端打开通讯录选择器，用户选择完通讯录联系人，客户端把选择结果告诉给H5。}
   * @argument {option.callback} 回调函数
   * SINAIF.chooseContacts({
   *    callback:function(e){
   *       let res = JSON.parse(e);
   *       //res.contactName  联系人名称
   *       //res.contactPhone 联系人电话
   *    }
   * });
   */
  chooseContacts: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.callbackName = this.registerAction(option.callback);
      this.formatDate(data);
      this.callApp("chooseContacts", data);
    }
  },
  /**
   * @description {H5调用该协议，客户端打开通讯录选择器，用户选择完通讯录联系人，客户端把选择结果告诉给H5。}
   * @argument {option.callback} 回调函数
   * @argument {option.type} 正反面
   * SINAIF.scanIDCard({
   *    type:"front",
   *    callback:function(e){
   *       let res = JSON.parse(e);
   *       //res.imgPath  身份证扫描图片路径
   *    }
   * });
   */
  scanIDCard: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.type = option.type || "front";
      data.callbackName = this.registerAction(option.callback);
      this.formatDate(data);
      this.callApp("scanIDCard", data);
    }
  },
  /**
   * @description {H5调用该伪协议，客户端打开依图活体检测功能，活体检查成功或失败都反馈给H5。}
   * @argument {option.callback} 回调函数
   * SINAIF.livingBodyCheck({
   *    callback:function(e){
   *       let res = JSON.parse(e);
   *       //res.isSuccess  活体检测是否成功
   *       //res.imgPath  活体检测的图片地址
   *    }
   * });
   */
  livingBodyCheck: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.callbackName = this.registerAction(option.callback);
      this.formatDate(data);
      this.callApp("livingBodyCheck", data);
    }
  },
  /**
   * @description {H5调用该协议，客户端调用依图SDK，开始扫描银行卡号，扫描成功返回银行卡卡号跟名称给H5。}
   * @argument {option.callback} 回调函数
   * SINAIF.scanBankCard({
   *    callback:function(e){
   *       let res = JSON.parse(e);
   *       //res.bankNumber  银行卡卡号
   *       //res.bankName  可传可不传
   *    }
   * });
   */
  scanBankCard: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.callbackName = this.registerAction(option.callback);
      this.formatDate(data);
      this.callApp("scanBankCard", data);
    }
  },
  /**
   * @description {H5调改协议，客户端接收程序的scheme代码，尝试打开第三方app}
   * @argument {option.callback} 回调函数
   * @argument {option.scheme} 第三方schema
   * SINAIF.launchApp({
   *    callback:function(e){
   *       let res = JSON.parse(e);
   *       //res.bankNumber  银行卡卡号
   *       //res.bankName  可传可不传
   *    }
   * });
   */
  launchApp: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("callback") &&
      util.isFunction(option.callback)
    ) {
      let data = {};
      data.callbackName = this.registerAction(option.callback);
      data.scheme = option.scheme;
      this.formatDate(data);
      this.callApp("launchApp", data);
    }
  },
  /**
   * @description {H5调该协议，App接收分享类型或者从页面底部弹出分享面板进行社会化分享。}
   * @argument {option.isSharePanel} 是否弹出分享面板true弹窗，false则结合参数
   * @argument {option.shareType} 单独社会化分享类型
   * @argument {option.message} 分享的内容
   * @argument {option.title} 分享的标题
   * @argument {option.url} 分享的链接
   * @argument {option.image} 分享的图片地址
   * SINAIF.share({
   *    message:"",
   *    title:"",
   *    url:"",
   *    image:"",
   *    isSharePanel:false,
   *    shareType:2
   * });
   */
  share: function(option) {
    if (
      util.isObject(option) &&
      option.hasOwnProperty("message") &&
      option.hasOwnProperty("title") &&
      option.hasOwnProperty("url") &&
      option.hasOwnProperty("image")
    ) {
      this.formatDate(option);
      this.callApp("share", option);
    } else {
      console.error("缺失必要参数！");
    }
  },
  setToken: function(data) {
    window.token = data;
  }
};
// window.setToken = function(data) {
//   window.token = data;
// };
//
// window.sendData = function(data, callbackname) {
//   console.log(data);
//   if (typeof callbackname == "string") {
//     window[callbackname](data);
//   } else {
//     callbackname(data);
//   }
// };

export default SINAIF;
