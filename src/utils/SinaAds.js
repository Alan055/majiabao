import AppBridge from "@/services/AppBridge";

import axios from "axios";
import qs from "qs";

// H5 上报的配置
let h5Config = {
  productId: "2001",
  source: "S002",
  sdkVersion: "2.0.0",
  baseURL: process.env.apiData
};

let browser = {
  versions: (function() {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      trident: u.indexOf("Trident") > -1, //IE内核
      presto: u.indexOf("Presto") > -1, //opera内核
      webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, //android终端
      iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1, //是否iPad
      webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf("MicroMessenger") > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == " qq", //是否QQ
      weibo: u.indexOf("Weibo") > -1 || u.indexOf("weibo") > -1 //android终端
      // weibo: 'ffffff', //android终端
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

// 经纬度信息
let geolocationData = "";

// 构造
function generator(type) {
  return function(data, callback) {
    // 如果类型为show 则可以不传值, 其他类型不传值则不执行
    if (data === undefined && type !== "show") return false;

    // 判断是否为字符串
    if (typeof data === "string") {
      data = {
        currEvent: data
      };
    }

    // 如果是show类型则 则赋值给CurrEvent 赋值: 链接
    if (type === "show") {
      if (typeof data === "string" || data === undefined) {
        data = {
          currEvent: getCurrPageLink()
        };
      } else if (typeof data === "object") {
        data.currEvent = getCurrPageLink();
      }
    }

    // 定义类型
    data.action = type;

    /*webRequest(data, callback);
    return*/

    if (AppBridge.isApp) {
      callApp(data, callback);
    } else {
      webRequest(data, callback);
    }
  };
}

// 合并默认参数 (App上报)
function appMergeBaseData(option) {
  let baseData = {
    currPage: getCurrPageLink(),
    currPageParams: JSON.stringify(getParams()),
    userAgent: navigator.userAgent || "",
    visitStartTime: formatDate()
  };

  // 将二级对象转换成json串
  return formatJson(Object.assign({}, option, baseData));
}

// 合并默认参数 (H5)
function h5MergeBaseData(option) {
  let params = getParams();

  let ostype = "other";
  if (browser.versions.ios) {
    ostype = "ios";
  } else if (browser.versions.android) {
    ostype = "android";
  }

  // action数据 也在这里面, 不过已经由 generator 函数处理
  // 合并默认参数后 将子属性的对象全部转为JSON串
  let json = formatJson(
    Object.assign(
      {},
      {
        currPage: getCurrPageLink(),
        userAgent: navigator.userAgent || "",
        accountId: params.fromUserId || "",
        source: h5Config.source,
        currPageParams: JSON.stringify(getParams()),
        currEvent: "",
        currEventParams: "",
        action: "",
        reference: "",
        ipv4: "",
        gps: geolocationData,
        visitStartTime: formatDate(),
        visitEndTime: "",
        visitDuration: "",
        dedicated: "",
        ext: ""
      },
      option
    )
  );

  let baseData = {
    productId: h5Config.productId,
    sdkVersion: h5Config.sdkVersion,
    appVersion: params.appVersion || "",
    model: ostype,
    deviceId: "",
    mac: "",
    channel: params.channelId,
    mobileSystem: ostype,
    osVersion: "",
    dataUploadTime: new Date().getTime(),
    json: JSON.stringify([json])
  };

  return baseData;
}

// 获取参数
function getParams(field) {
  let url = window.location.href,
    param = {},
    splitArray = url.split("?"),
    searchLocation = splitArray.length <= 1 ? "" : splitArray[1].split("#")[0],
    searchParams = searchLocation.split("&"),
    value,
    key;
  for (var i = 0, leni = searchParams.length; i < leni; i++) {
    key = searchParams[i].split("=")[0];
    value = searchParams[i].split("=")[1];
    if (!key) {
      continue;
    }
    param[key] = value;
  }
  return field ? param[field] : param;
}

// App上报 发送埋点事件
function callApp(option, callback) {
  // 合并公共参数
  option = appMergeBaseData(option);

  console.log(`埋点发送完成: ${option.action}-${option.currEvent}`);

  console.log(option);

  if (callback) {
    AppBridge.storeStatistics(option, callback);
  } else {
    AppBridge.storeStatistics(option);
  }
}

// H5上报 请求体
function webRequest(option, callback) {
  // 合并公共参数
  option = h5MergeBaseData(option);

  let setting = {
    url: "/static/logs/uploadStaticRecords",
    method: "post",
    baseURL: h5Config.baseURL,
    timeout: 30000,
    data: option,
    transformRequest: [
      function(data, headers) {
        // Do whatever you want to transform the data
        return qs.stringify(data);
      }
    ]
  };
  // 断网处理
  axios(setting)
    .then(res => {
      if (callback) callback(res);
    })
    .catch(e => {});
}

// 返回一个YYYY-mm-dd时间
function formatDate(visitTime = window.visitTime) {
  if (typeof visitTime === "number") visitTime = new Date(visitTime);

  // 补零
  function zeroize(num) {
    return num < 10 ? "0" + num : num;
  }

  return (
    visitTime.getFullYear() +
    "-" +
    zeroize(Number(visitTime.getMonth()) + 1) +
    "-" +
    zeroize(visitTime.getDate()) +
    " " +
    zeroize(visitTime.getHours()) +
    ":" +
    zeroize(visitTime.getMinutes()) +
    ":" +
    zeroize(visitTime.getSeconds())
  );
}

// 将二级属性 对象 转成 JSON串
function formatJson(object = "") {
  if (object && typeof object === "object") {
    for (let i in object) {
      if (typeof object[i] === "object") {
        object[i] = JSON.stringify(object[i]);
      }
    }
  }
  return object;
}

// 返回一个 对URL进行格式化处理后的地址
function getCurrPageLink() {
  let link = window.location.href.split("?")[0];
  link = link.replace(/(\/*index.html\/*#|\/#)/g, "#");
  link = link.replace(/\/$/g, "");
  return link;
}

// 获取经纬度
if (!AppBridge.isApp && false) {
  +(function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let longitude = position.coords.longitude;
        let latitude = position.coords.latitude;
        geolocationData = { x: longitude, y: latitude };
      });
    } else {
      console.log("不支持");
    }
  })();
}

// 生成函数
let fnList = [
  "show", // 进入页面自调用 (App.vue:beforeCreate)
  "click", // 点击事件
  "hover", // input聚焦
  "popover", // 弹框显示隐藏
  "tips" // Toast
];
let Api = {};
fnList.forEach(type => {
  Api[type] = generator(type);
});

export default Api;
