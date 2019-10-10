<template lang="html">
<div id="app">

  <keep-alive>
    <router-view class="c-view" :style="`min-height: ${viewHeight}`" />
  </keep-alive>
  <c-select ref="select" />
</div>
</template>

<script>
import cSelect from "@/components/common/cSelect";
import AppBridge from "@/services/AppBridge";
import store from "@/store";
import { mapGetters, mapMutations } from "vuex";
import util from "@/utils";
import helper from "@/utils/helper";
import qs from "qs";
import api from "@/services/api";
import { Toast, Indicator } from "@/utils/helper";
import EventBus from "@/services/EventBus";
import debugMixins from "./debugMixins";
import sensors from "sa-sdk-javascript";

// 解除route的循环引用
function resolveRoute(route) {
  let { fullPath, hash, meta, name, params, path, query } = route;
  return { fullPath, hash, meta, name, params, path, query };
}

export default {
  mixins: [debugMixins],
  data() {
    return {
      routeData: null, //路由参数
      fromRoute: null, //来源路由
      routeJump: false, //是否通过路由跳转
      closeAfterJump: false, //跳转后关闭本页面
      nextTitle: "", //跳转页面显示的标题
      isApp: AppBridge.isApp,
      isLogin: !!util.getParams("token"),
      viewHeight: "100%",
      loadingClosed: false,
      statusHeight: 0 //状态栏高度
    };
  },
  store,
  beforeCreate() {
    this.sinaAds.show({
      currEventParams: {
        type: "loadResourceComplete"
      }
    });
  },
  computed: {
    ...mapGetters([])
  },
  components: {
    cSelect
  },
  methods: {
    ...mapMutations(["setUserInfo", "setAgreements"]),

    // 打开链接
    openUrl(url, data = {}) {
      if (!url) {
        return;
      }

      if (typeof url == "string") {
        // 如果是中转页, 查询跳转地址
        if (url.toLowerCase().indexOf("getnextpage") > -1) {
          this.queryRouterUrl(url);
          return;
        }
        url = { url };
      } else if (typeof url == "object") {
        if (url.url.toLowerCase().indexOf("getnextpage") > -1) {
          this.queryRouterUrl(url.url);
          return;
        }
      }

      console.log("open url " + url.url);

      let urlConfig = {
        isFull: false
      };

      util.extend(urlConfig, url);

      helper.set("routeData", data);

      if (AppBridge.isApp) {
        if (
          !(
            process.env.NODE_ENV != "production" &&
            urlConfig.url.indexOf("weinre") == -1
          )
        ) {
          AppBridge.activityView(urlConfig);
          return;
        }

        this._h5debug(urlConfig.url, res => {
          if (res) urlConfig.url = res;
          console.log("URL=>", urlConfig.url);
          AppBridge.activityView(urlConfig);
        });
      } else {
        window.location = url.url;
      }
    },

    // 替换链接 replaceState
    replaceUrl(url, data = {}) {
      if (!url) return;
      if (typeof url == "string") {
        url = { url };
      }
      url.isCloseCurrent = true;
      this.openUrl(url, data);
    },

    //关闭当前页面，并回到首页
    // config 标识符，true 通知 APP 使用loadURL的方式重载 H5 首页
    backHome(config) {
      // AppBridge.refreshHome();
      setTimeout(function() {
        AppBridge.showHomeView(config);
      }, 100);

      // // 通知首页刷新数据
      // AppBridge.notify({tag: 'home'})
      // AppBridge.showHomeView();
    },

    // 关闭跳金币
    loadingClose(isSendAds = true) {
      if (isSendAds) {
        this.sinaAds.show({
          currEventParams: {
            type: "renderComplete"
          }
        });
      }

      this.$nextTick(() => {
        this.loadingClosed = true;
        AppBridge.loadingView({
          close: true
          // type: 2  // 不传type,关闭所有loading
        });
      });
    },
    //获取 协议 里面的个人数据
    /**
     * config.service  1 开户协议 2 提款协议 3 账单协议 4 还款协议 5绑卡支付协议
     * config.agreementid  协议id
     * config.fundproductid  资金方id
     * config.orderid 贷后如果查看根据订单id查看返回授信时间
     * config.frompage 页面来源标志 grzx代表“个人征信”,Xyapply 代表 “兴业”
     **/
    getAgreementInfo(config) {
      let option = {
        service: 1,
        frompage: "grzx"
      };
      let data = Object.assign(option, config);
      return api.getAgreementInfo(data);
    },

    // 设置Web窗口属性 (设置标题等)
    setWebAttribute(option) {
      AppBridge.setWebAttribute(option);
    },

    // 设置title右上角事件属性
    setWebTitleAttribute(option, fn) {
      AppBridge.setWebTitleAttribute(option, fn);
    },

    // 关闭当前页面
    closeWindow(config = {}) {
      // refresh: 页面整体刷新
      // asynRefresh: APP通知H5刷新数据
      config.type = "close";
      config.asynRefresh = true;

      if (AppBridge.isApp) {
        // if(config.notify == 'notify') {
        //   // 全局刷新通知
        // 	AppBridge.notify({data: JSON.stringify({xx:1}), tag: 'test'})
        // }
        AppBridge.activityView(config);
      } else {
        window.history.back();
      }
    },

    //神策埋点初始化
    initShence(extObj) {
      console.log(
        "project=====>" + process.env.NODE_ENV != "production"
          ? "default"
          : "production"
      );
      let data = Object.assign(
        {},
        {
          // server_url: `${location.protocol}//track.sinaif.com:4006/sa?project=default`,
          server_url: `https://track.sinaif.com:4006/sa?project=${
            process.env.NODE_ENV != "production" ? "default" : "production"
          }`,
          // http://xinlangpuhui.datasink.sensorsdata.cn/sa?project=production&token=22252313ae4a6a1a
          //heatmap_url神策分析中点击分析及触达分析功能代码，代码生成工具会自动生成。如果神策代码中 `sensorsdata.min.js` 版本是 1.9.1 及以上版本，这个参数必须配置，低于此版本不需要配置。
          // heatmap_url: process.env.mode === 1 ? '~@/assets/lib/javaScript/heatmap.min.js' : '~@/assets/lib/javaScript/heatmap.js',
          // heatmap_url: 'http://cdn.bootcss.com/heatmap.js/2.0.2/heatmap.min.js',
          heatmap_url:
            process.env.kingPath +
            "/pages/panda-staging/static/lib/heatmap/heatmap.min.js",
          heatmap: {
            // 是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
            // 需要 JSSDK 版本号大于 1.7
            clickmap: "default",
            //是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
            //需要 JSSDK 版本号大于 1.9.1
            scroll_notice_map: "not_collect",
            // 设置 true 后会在网页控制台打 logger，会显示发送的数据,设置 false 表示不显示。默认 true。
            //非生产环境都输出
            show_log: false
            // 设置成 true 后， 表示在单页面开发的网站中，我们会对 hashchange 和 popstate 事件进行监听，当这两个事件任何一个发生时，也会发送 $pageview 事件。默认 false。
            // is_single_page: false
          }
        },
        extObj
      );
      sensors.init(data);
      sensors.registerPage({
        platform_type: "H5",
        app_identify: "极速熊猫",
        mjbname: util.getParams("mjbname"),
        productid: util.getParams("productid") || 2001
      });
      sensors.login(util.getParams("fromUserId"));
      sensors.quick("autoTrack", {
        platForm: "h5"
      });
    },

    //发送神策埋点
    sendShence(event, eventParams = {}) {
      sensors.track(event, eventParams);
    },

    // 路由跳转
    pushRoute(route) {
      if (route.hasOwnProperty("title")) {
        this.nextTitle = route.title;
      }
      this.$router.push(route);
    },

    // 路由替换
    replaceRoute(route, jumpWithApp) {
      if (route.hasOwnProperty("title")) {
        this.nextTitle = route.title;
      }
      if (jumpWithApp) {
        // App跳转后关闭本页面
        this.closeAfterJump = true;
      } else {
        // 在当前Webview替换路由
        this.routeJump = true;
      }
      this.$router.replace(route);
    },

    // 接收路由参数
    getRouteData() {
      return new Promise(resolve => {
        if (Object.keys(this.$route.params).length) {
          resolve(this.$route.params);
        } else if (this.routeData) {
          resolve(this.routeData);
        } else {
          helper.get("routeData").then(res => {
            this.routeData = res || {};
            resolve(this.routeData);
            helper.remove("routeData");
          });
        }
      });
    },

    //中转页方法,目前APP跟多页面下发的是已经不需要的中转页，在此补充统一方法
    queryRouterUrl(url) {
      let search = url.split("?")[1] || "";
      let params = qs.parse(search);
      let submitData = {
        orderid: params.orderid || "",
        billid: params.billid || "",
        fundproductid: params.productid || ""
      };

      Indicator.open();
      api
        .getRouterUrl(submitData)
        .then(res => {
          // res = getRouterData;
          if (helper.isSuccess(res)) {
            let url = res.data.forwardItemBeans[0].url;
            this.openUrl(url);
          }
        })
        .finally(Indicator.close);
    },

    // 获取来源路由
    getFromRoute() {
      return new Promise(resolve => {
        if (this.fromRoute) {
          resolve(this.fromRoute);
        } else {
          helper.get("fromRoute").then(fromRoute => {
            resolve(fromRoute || {});
          });
        }
      });
    },

    // 验证短信(资金方)
    // data: 短信接口参数
    // config: 伪协议验证码弹窗参数
    // type 使用不同的 枚举值
    async sendSms(data, config, type) {
      // config = {
      //   mobile: 1111,
      //   type: 1
      // }
      let newType = type || 0;
      const sendArray = ["send", "withdrawSend", "repaySend"];
      // 以下代码未经过测试，请测试
      //获取key
      let key = config.timeKey; //默认key
      let defaultTime = config.defaultTime || 60; //获取默认时间
      let downTime = null;
      let value = await helper.get(`${key}`);

      if (value && value > new Date().getTime()) {
        downTime = (value - new Date().getTime()) / 1000;
      }
      //如果 倒计时时间小于
      if (downTime && downTime < defaultTime) {
        return new Promise(resolve => {
          // api.sms[sendArray[newType]](data).then(res => {
          // if(helper.isSuccess(res)) {
          // 唤起APP验证码输入窗口
          config.time = downTime;
          config.params = data;
          AppBridge.showSmsView(config, res => {
            resolve(res.data.smsCode);
          });
        });
      } else {
        Indicator.open();
        return new Promise(resolve => {
          api.sms[sendArray[newType]](data)
            .then(res => {
              if (helper.isSuccess(res)) {
                // 唤起APP验证码输入窗口
                config.time = defaultTime;
                config.params = data;
                AppBridge.showSmsView(config, res => {
                  resolve(res.data.smsCode);
                });
              }
            })
            .finally(Indicator.close);
        });
      }

      //   helper.get(`${key}`).then(value=>{
      //       if(value && (value >(new Date()).getTime())){
      //           downTime = (value - (new Date()).getTime())/1000;
      //       };
      //       //如果 倒计时时间小于
      //       if(downTime &&  (downTime < defaultTime) ) {
      //           return new Promise(resolve => {
      //             // api.sms[sendArray[newType]](data).then(res => {
      //             // if(helper.isSuccess(res)) {
      //                 // 唤起APP验证码输入窗口
      //                 config.time = downTime;
      //                 config.params = data;
      //                 AppBridge.showSmsView(config, res => {
      //                     resolve(res.data.smsCode)
      //                 })
      //             // }
      //             // }).finally(Indicator.close);
      //         })
      //       }else{
      //           Indicator.open();
      //             return new Promise(resolve => {
      //                 api.sms[sendArray[newType]](data).then(res => {
      //                 if(helper.isSuccess(res)) {
      //                     // 唤起APP验证码输入窗口
      //                     config.time = defaultTime;
      //                     config.params = data;
      //                     AppBridge.showSmsView(config, res => {
      //                         resolve(res.data.smsCode)
      //                     })
      //                 }
      //                 }).finally(Indicator.close);
      //             })
      //       }
      //   })
      //   Indicator.open();
      //   return new Promise(resolve => {
      //     api.sms[sendArray[newType]](data).then(res => {
      //       if(helper.isSuccess(res)) {
      //         // 唤起APP验证码输入窗口
      //         AppBridge.showSmsView(config, res => {
      //           resolve(res.data.smsCode)
      //         })
      //       }
      //     }).finally(Indicator.close);
      //   })
    },

    // 获取数据
    fetchData() {
      // // 从APP获取初始数据
      // AppBridge.getInitData(res => {
      //   if(!res || !res.data) return
      //   let data = res.data
      //   if(typeof data == 'string') {
      //     data = JSON.parse(data)
      //   }

      //   // // 下拉菜单
      //   // this.setDictionary(data.system)

      //   // 协议地址
      //   this.setAgreements(data.agreements)

      //   console.log(Object.keys(data))

      // })

      // 获取用户信息(异步获取)
      AppBridge.getUserInfo(res => {
        this.setUserInfo(res.data);
      });

      // // 获取协议
      // AppBridge.getVisitUrl({
      //   pageName: '10080',
      //   type: 'agreement'
      // })

      // 获取状态栏高度
      AppBridge.getStatusHeight(res => {
        this.statusHeight = res.data.statusHeight;
      });
    },

    // 跳转到登录页
    jumpToLogin(config = {}) {
      // url: 登录成功之后打开url
      // preUrl: 取消登录之后打开preUrl
      config.pkg = "login";
      AppBridge.goNative(config);
    },

    //toast
    toast(option) {
      AppBridge.toast(option);
    },

    // 设置App title
    setTitle(title) {
      console.log("set title", title);
      if (title) {
        AppBridge.setWebAttribute({ title });
      }
    },

    // 打开借款协议
    openAgreement(data) {
      let { title, link, type } = data;
      // PDF
      if (/(.pdf)$/i.test(link)) {
        AppBridge.activityView({
          title,
          url: link,
          tag: "jfpdf"
        });
      }
    },

    // 设置状态栏颜色
    setStatusColor(color) {
      if (color == "white") {
        // 设置状态栏颜色为白色
        AppBridge.setStatusColor({ color: "ffffff", mode: "white" });
      } else if (color == "black") {
        // 设置状态栏颜色为黑色
        AppBridge.setStatusColor({ color: "000000", mode: "black" });
      }
    },

    //设置body颜色，防止IOS下滑显示白屏
    setBodyColor(color) {
      document.querySelector("body").style = "background-color:" + color;
    },
    // 获取app的版本号
    appVersion() {
      let arr = [];
      for (let val of ["appVersion", "verno", "tc", "et"]) {
        let code = util.getParams(val);
        code && arr.push(code);
      }
      return arr.join(".");
    }
  },
  created() {
    this.initShence();
    setTimeout(() => {
      console.info("当前页面地址", window.location.href);
    }, 2000);
    // Sky watch control route jump
    // send('routeJump({name: "xxx"})')
    if (process.env.NODE_ENV == "development") {
      window.routeJump = route => {
        this.$router.push(route);
      };
    }

    // 监听刷新事件
    EventBus.$on("refreshData", (res, route) => {
      if (res && res.data && res.data.tag == "login") {
        // 事件来自登录状态改变
        this.isLogin = !!res.data.data;
      }
    });

    // 读取fromRoute，然后将当前路由设置为fromRoute
    helper.get("fromRoute").then(fromRoute => {
      this.fromRoute = fromRoute || {};
      helper.set("fromRoute", resolveRoute(this.$route));
    });

    this.fetchData();

    // 导航守卫
    this.$router.beforeEach((to, from, next) => {
      // 清空路由参数
      this.routeData = null;

      // 设置fromRoute
      this.fromRoute = from;
      helper.set("fromRoute", resolveRoute(from));

      // 下一个页面的title
      let title = this.nextTitle || to.meta.title || this.appName;
      this.nextTitle = ""; //及时清空

      // 如果是APP环境，截获路由跳转，改为新窗口打开
      if (AppBridge.isApp && !this.routeJump) {
        let url = location.origin + location.pathname + "#" + to.path;

        // 路由传参 query
        let query = qs.stringify(to.query);
        if (query) {
          url = url + "?" + query;
        }

        this.openUrl(
          {
            url,
            title,
            isCloseCurrent: this.closeAfterJump
          },
          to.params
        );
      } else {
        // 通过路由跳转
        this.setTitle(title);
        this.routeJump = false;
        next();
      }
    });

    // 监听APP restart
    window.restart = () => {
      console.log("restart", this.$route.name);
    };

    // // 关闭App loading
    // AppBridge.loadingView({close: true, type: 1})
    console.info("当前页面地址", window.location.href);
  },
  mounted() {
    this.viewHeight = window.innerHeight + "px";
  }
};
</script>

<style lang="scss" scoped>
</style>
