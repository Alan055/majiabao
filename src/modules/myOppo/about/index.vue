<template lang="html">
  <div class="view c-bg-gray">

    <div class="cell-list c-section first-section">
      <mt-cell title="消息推送" v-if="isShowPush">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/ay_ts@2x.png"></span>
        <div class="switchBtn">
          <p @click="msgPush" ref="tier" class="tier"></p>
          <mt-switch v-model="isPushOpen"></mt-switch>
        </div>
      </mt-cell>
    </div>

    <div class="cell-list c-section first-section">
      <mt-cell title="去好评" is-link @click.native="goMarket">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/aq_aq@2x.png"></span>
      </mt-cell>
    </div>

    <div class="cell-list c-section">
      <mt-cell title="免责申明" is-link @click.native="gotoAgreements">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/as_aq@2x.png"></span>
      </mt-cell>
      <mt-cell title="关于我们" is-link @click.native="gotoAboutUs">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/at_aq@2x.png"></span>
      </mt-cell>
    </div>


    <div v-if="isShowWeixin" class="cell-list c-section">
      <mt-cell title="官方微信" is-link @click.native="goWeiXin">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/az_wx@2x.png"></span>
      </mt-cell>
    </div>

    <div class="cell-list c-section" v-if="browser.android">
      <mt-cell title="检查更新" is-link @click.native="checkServerAppVersion">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/au_aq@2x.png"></span>
        <span>v{{appVersion}}</span>
      </mt-cell>
    </div>

     <div v-if="debug" class="cell-list c-section first-section">
      <mt-cell title="H5本地调试设置" is-link @click.native="weinre">
        <span slot="icon"><img class="c-icon icon_a" src="~@/assets/images/my/about/aq_aq@2x.png"></span>
      </mt-cell>
    </div>

  <!--  <input @click="test" type="button" :value="`微信埋点次数${i}`" />
    <input @click="test2" style="margin-top: 20px;" type="button" :value="`消息埋点次数${j}`" />-->

  </div>
</template>

<script>
  import util from "@/utils";
  import AppBridge from "@/services/AppBridge.js";
  import Api from "@/services/api.js";
  import {Indicator, MessageBox, Toast} from "@/utils/helper";
  import {confirm} from 'mint-ui';


  export default {
    data() {
      return {
        browser: util.browser.versions,
        appVersion: util.getParams("appVersion") || "",
        mjbname: util.getParams("mjbname") || "",
        channel: util.getParams("channel") || "", //渠道
        downloadurl: "", // 下载地址
        // 0 代表 不需要请求 waiting 代表请求中  err为报错  其他为需要更新的版本号
        serverAppVersion: 0,
        updatedesc: "",
        isShowWeixin: false, //是否显示微信
        isShowPush: false, //是否显示推送
        isPushOpen: false,  //是否打开推送
        i:0,
        j:0,
      };
    },

     computed: {
      debug(){
        return process.env.NODE_ENV != "production"
      }
    },

    watch: {

      isPushOpen(value, oldValue) {

      },
    },

    beforeRouteEnter(to, from, next) {
      // 导航进入该组件时调用
      // 不！能！获取组件实例 `this`
      // 因为组件实例还没被创建

      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.getServerAppVersion();

        vm.setTitle();
      });
    },

    created() {
        this.initMsg();
        this.checkNotificationEnabled();


        AppBridge.getInitData(res => {
            if(res && res.data.pageaddress) {
                let weixin = res.data.pageaddress.filter((item) => {
                    return item.type == 'WECHAT'
                })
                if(weixin.length > 0) {
                    this.isShowWeixin = weixin[0].url != ''
                }
            }
        })

        AppBridge.getSystemInfo(res => {
            console.log('getSystemInfo res', res)
            console.log('res.data.platform', res.data.platform)

            //this.isShowPush=true

            let appVersion = this.$route.query.verno
            if(appVersion){
            this.isShowPush = true;
            }


        /* AppBridge.getSystemInfo(res => {

            if (res) {

                let appVersion = util.getParams('appVersion') + "";

                appVersion = Number(appVersion.split('.').join(''))

                if (res.data.platform == 'android') {

                if (appVersion >= 110) {
                    this.isShowPush = true;
                }

                } else {

                //IOS 版本号
                if (appVersion >= 11002) {
                    this.isShowPush = true;
                }
                }
            }
            });*/


        });
    },
    methods: {

     weinre(){
        this.$root.openUrl( `${process.env.path}/pages/my/index.html#/about/weinre`)
        //AppBridge.activityView(urlConfig);
      },
      /**
       * 消息推送设置
       */
      msgPush() {


        this.sinaAds.click(this.adsInfo.about.index.clickMessagePush);

        if (this.isPushOpen) {

          MessageBox({
            title: "温馨提示",
            message: "关闭消息通知后，您无法收到借还款信息，是否确认关闭?",
            confirmButtonText: "再想想",
            showCancelButton: true,
            cancelButtonText: "关闭通知"
          }).then(action => {

            //关闭通知
            if (action == "cancel") {
              this.messageBridge(false)
            }
          });
        } else {
          //之前是关闭状态，直接打开
          this.messageBridge(true)
        }

      },

      /**
       * 调用APP伪协议，设置消息推送开关
       * @param status
       * @constructor
       */
      messageBridge(status) {
        AppBridge.goNative({
          pkg: 'setting',
          isRefreshEnterFore: true,  //切换页面需要刷新， 不然设置完成不生效
        });

      },

      //官方微信
      goWeiXin() {

        this.sinaAds.click(this.adsInfo.about.index.clickWeiXinCopy);

        AppBridge.setClipboardData({
          data: '大王管家'
        })

        MessageBox({
          title: "温馨提示",
          message: "已复制大王管家至粘贴板\n" +
            "打开微信—点击搜索框—粘贴搜索",
          confirmButtonText: "去关注",
          showCancelButton: true,
          cancelButtonText: "取消"
        }).then(action => {

          if (action != "cancel") {
            AppBridge.launchApp({
              scheme: "weixin://open",
              pkgName: 'com.tencent.mm'
              //scheme: 'weixin://open&pkgName=com.tencent.mm'
            }, res => {
              if (res && res.data.status != 'true') {
                Toast('请安装微信后重新尝试')
              }
            });
          }
        });

      },

      // 去好评
      goMarket() {
        this.sinaAds.click(this.adsInfo.about.index.clickGoMarket);
        AppBridge.goMarket();
      },

      //初始化消息
      initMsg() {
        let self = this;

        AppBridge.setWebAttribute({
          asynRefresh: true
        });
        window.receiverMsg = function (e) {
          let data = e.data;
          if (data.tag == "refresh") {
            self.checkNotificationEnabled();
          }
        }
      },

      //检查是否打开消息通知
      checkNotificationEnabled() {
        let self = this;
        AppBridge.checkNotificationEnabled(res => {

          //  alert('检查是否打开消息通知=> '+JSON.stringify(res))

          console.log('checkNotificationEnabled res', res)
          if (res.data.status == 1) {
            self.isPushOpen = true
          } else if (res.data.status == 0) {
            self.isPushOpen = false
          } else if (res.data.status == 3) {
            self.isShowPush = false
          }
        });
      },

      // 获取服务器App版本号, 只有android需要
      getServerAppVersion() {
        if (this.browser.android) {
          Indicator.open();

          this.serverAppVersion = "waiting";

          Api.user.about
            .checkUpdate({})
            .then(res => {
              this.$root.loadingClose();

              // 不需要更新
              if (Number(res.code) === 1000013) {
                this.serverAppVersion = 0;
                return false;
              }

              // 需要更新
              if (Number(res.code) === 200) {
                if (res.data) {
                  if (
                    res.data.versionno &&
                    res.data.downloadurl &&
                    res.data.updatedesc
                  ) {
                    this.serverAppVersion = res.data.versionno;
                    this.downloadurl = res.data.downloadurl;
                    this.updatedesc = res.data.updatedesc;
                    return false;
                  }
                }
              }
              // 其他状态按不需要更新处理
              this.serverAppVersion = 0;
            })
            .finally(() => {
              Indicator.close();

              // 报错的处理方法
              if (this.serverAppVersion === "waiting") {
                this.serverAppVersion = "err";
              }
            });
        } else {
          this.$root.loadingClose();
        }
      },

      // 比较服务器App版本号
      checkServerAppVersion() {
        this.sinaAds.click(this.adsInfo.about.index.clickCheckVersion);

        // 请求中
        if (this.serverAppVersion === "waiting") {
          Toast("正在检查更新版本，请稍后");

          // 不断查询状态 不为 waiting 才停止
          window.checkAppVersionTimer = setInterval(() => {
            if (this.serverAppVersion !== "waiting") {
              clearInterval(window.checkAppVersionTimer);
              this.checkServerAppVersion();
            }
          }, 1000);
        } else if (this.serverAppVersion === "err") {
          // 请求失败/内部代码报错
          Toast("抱歉，当前访问用户过多，请稍后重试！");
        } else if (
          Number(this.serverAppVersion) !== 0 &&
          this.downloadurl !== ""
        ) {
          // 需要更新 且 有下发下载地址
          MessageBox({
            title: "温馨提示",
            message: this.updatedesc,
            showConfirmButton: "确定",
            showCancelButton: "取消"
          }).then(clickBtn => {
            if (clickBtn === "confirm") {
              this.appDownload();
            }
          });
        } else {
          // 如果为0 则未当前最新版本
          Toast("当前为最新版本");
        }
      },

      // 下载Apk
      appDownload() {
        // 客户端下载
        AppBridge.downloadFile({
          type: 2,
          filePath: this.downloadurl
        });
      },

      // 前往免责声明
      gotoAgreements() {
        this.sinaAds.click(this.adsInfo.about.index.clickGoAgreements);

        // 获取协议
        AppBridge.getVisitUrl(
          {
            pageName: "10083",
            type: "agreement"
          },
          res => {
            if (!res || !res.data) return;
            let data = res.data;
            if (typeof data == "string") {
              data = JSON.parse(data);
            }

            if (data && data.url) {
              this.$root.openUrl({
                url: data.url,
                title: "协议"
              });
            } else {
              Toast("抱歉，当前访问用户过多，请稍后重试！");
            }
          }
        );
      },

      //前往关于我们
      gotoAboutUs() {
        this.sinaAds.click(this.adsInfo.about.index.clickAboutSinaif);
        this.$root.nextTitle='关于我们';
        let name = 'aboutOppo';

        this.$router.push({name: name})
      },

      // 返回
      back() {
        console.log("back");
      },

      setTitle() {
        this.$root.setWebAttribute({
          title: "关于我们"
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .first-section {
    margin-top: 8px;
    //visibility: hidden;
  }

  div.switchBtn {
    float: right;
    margin-right: 2px;
    display: inline-block;
    position: relative;

    .tier {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  }
</style>
