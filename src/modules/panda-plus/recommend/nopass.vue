<template lang="html">
  <div class="view">

    <c-header ref="transparentHeader" class="header transparent"
            :style="`background: rgba(71, 66, 62, ${headerRgba}); opacity: ${headerOpacity}`" :title="appName"
            :show="true">

    <span slot="right" class="posi-r">
        <span class="redEnvelope" v-if="homeData.welfareInfo&&homeData.welfareInfo.entranceData&&homeData.welfareInfo.entranceData.topEntrance"
            @click="clickMD(homeData.welfareInfo.entranceData.topEntrance.url);">
                    <img :src="homeData.welfareInfo.entranceData.topEntrance.gif" alt="">
                </span>
                    <mt-button  v-sina-ads='stat.recommend.message.mess' @click="$root.openUrl(messageUrl);redIcon=false;"><img class="c-icon icon_a" src="~@/assets/images/my/home/an_ao@2x.png"/></mt-button>
                    <span v-if="redIconShow"
                            :class="['red-icon', ['red-icon-one', 'red-icon-two', 'red-icon-three'][redIconCount.length - 1]]">{{redIconCount}}</span>
            </span>
    </c-header>

    <div id="spaceDiv" style="display: block; height: 102vh;"></div>

    <div class="c-view-content" id="scrollerContent">

      <!-- 查征信 -->
      <div class="section">
        <mt-cell title="抱歉，您暂无可用额度！请保持良好信用。" is-link @click.native="$root.openUrl(zhengxinURL)">查信用</mt-cell>
      </div>
      <!-- 贷超 -->
      <credit-card class="section iframe-section" :style="`height: ${creditCardHeight};`"
                   v-if="iframeUrl && isShowIframeUrl == 1" :iframeUrl="iframeUrl" id="iframeSection"/>


      <!-- 线下三级商户 -->
      <offline-product class="section" :resdata="homeData" v-if="homeData.thirdproducts" id="offlineProduct"/>
    </div>

  </div>
</template>

<script>
  import newcards from "./components/newcards";
  import offlineProduct from "./components/offlineProduct";
  import creditCard from "@/components/view/cMarket";
  import storage from "@/utils/storage";
  import scroller from "@/components/view/scroller";
  import helper from "@/utils/helper";
  import util from "@/utils";
  import api from "@/services/api";
  import EventBus from "@/services/EventBus";
  import {Toast, Indicator} from "@/utils/helper";

  import AppBridge from "@/services/AppBridge.js";
  import MaxentSDK from "@/services/MaxentSDK";

  export default {
    data() {
      return {
        messageUrl: process.env.kingPath + "/pages/panda-plus/#/message", //消息中心
        helpUrl: process.env.kingPath + "/pages/panda-plus/#/feedback", //意见反馈
        onlineServiceUrl: "",
        redIconShow: false,
        redIconCount: "0",
        isShowIframeUrl: util.getParams("isShowIframeUrl") || 0,
        pullDown: true,
        headerOpacity: 1,
        headerRgba: 1,
        activeHeight: "50vh",
        homeData: {
          apiFinish: false,
          applyproducts: [],
          welfareInfo: {},
          newcards: "",
          onekeyapplypage: {
            url: ""
          },
          mxkproducts: "",
          rejectpage: "", //拒件记录跳转地址
          thirdproducts: "",
          productext: [],
          resecondproducts: [],
          xm_driverPopConfig: '',


        }, //首页数据汇总
        bannerInfoData: [], //banner数据
        iframeUrl: "", //商业化地址
        creditCardHeight: "0", //商业地址高度
        zhengxinURL: "",

      };
    },
    components: {
      offlineProduct,
      creditCard,
      scroller
    },
    methods: {

      init(tag) {
        try {
          this.fetchData(tag);
          this.getmarketinfo();
          this.redData();
        } catch (error) {
          this.loadingClose();
        }
      },
      //初始化首页数据
      initHomeData() {
        this.homeData = this.$options.data().homeData;
        console.log("重置了数据", this.homeData);
      },
      //关闭loading
      loadingClose() {
        this.$nextTick(() => {
          document.getElementById("spaceDiv").style.height = "0px";
        });
        this.$root.loadingClose();
      },
      //资方特殊流程
      resolveQueue(data) {
        if (!data) return;
        data.forEach(item => {
          // 玖富
          if (item.type == 1) {
            this.resolveMaxent(item);
          }
          // ...
        });
      },
      // 保存玖富tick
      resolveMaxent(data) {
        let tick = util.getParams("fromUserId") + new Date().getTime();
        MaxentSDK.init(util.getParams("fromUserId"));
        MaxentSDK.active(tick).then(status => {
          if (!status) return;
          api.loan.jiufu.saveTicket({
            requestType: "1",
            productid: data.productid,
            type: "1",
            tick,
            fundproductid: util.getParams()["productid"] || ""
          });
        });
      },

      //接受iframe回调方法
      postMessageHandle(value) {
        if (value && typeof value == "number") {
          this.$nextTick(() => {
            setTimeout(() => {
              this.creditCardHeight = value + "px";

              this.loadingClose();
            }, 1000);
          });
        }
      },
      //获取贷超地址
      getmarketinfo() {
        return new Promise((resolve, reject) => {
          api.activity
            .getAppMarketInfo({
              pageid: "1001",
              token: util.getParams("token") || storage.get("token") || ""
            })
            .then(res => {
              if (res.code == 200 && res.data) {
                this.iframeUrl = res.data.jumplink;
                //this.marketUserStatsus = 3;
                if (res.data.marketUserStatsus) {
                  this.marketUserStatsus = res.data.marketUserStatsus;
                }
                setTimeout(() => {
                  this.loadingClose();
                }, 3000);
              }
              resolve(res);
            });
        });
      },
      // 获取首页数据大接口
      fetchData(tag) {
        return new Promise((resolve, reject) => {
          if (tag) {
            console.log(`return 伪协议 调用 `);
            AppBridge.getHomeData({}, res => {

              // res= this.mock.home

              if (helper.isSuccess(res)) {
                console.log("收到伪协议的数据了！");
                this.homeData = res.data;
                this.homeData.apiFinish = true;

                this.$nextTick(() => {
                  this.pageShow = true;
                });
                this.resolveQueue(res.data.productext);

                resolve(res);
              }
            });
          } else {
            api.home
              .getHomePage()
              .then(res => {

                // res= this.mock.home

                if (helper.isSuccess(res)) {
                  this.homeData = res.data;
                  this.homeData.apiFinish = true;

                  this.$nextTick(() => {
                    this.pageShow = true;
                  });
                  this.resolveQueue(res.data.productext);

                  resolve(res);
                }
              })
              .finally(this.loadingClose);
          }
        });
      },
      // 点击右上角的红包固定入口时添加埋点
      clickMD(url){
        this.sinaAds.click({currEvent: this.stat.redEnvelope.index.clickFiexd,currEventParams:{url:url}}, () => {});
        this.$root.openUrl(url)
      },
      //消息红点查询
      redData() {
        return new Promise((resolve, reject) => {
          api.user.message
            .redDot({
              pageCode: 2001004, //活动消息
              productId: 2001,
              token: util.getParams("token") || storage.get("token") || ""
            })
            .then(res => {
              if (!helper.isSuccess(res)) return;
              if (
                res.data.messageCenterTotal &&
                res.data.messageCenterTotal > 0
              ) {
                this.redIconShow = true;
                if (res.data.messageCenterTotal > 99) {
                  this.redIconCount = "99+";
                } else {
                  this.redIconCount = String(res.data.messageCenterTotal);
                }
              } else {
                this.redIconShow = false;
              }
              resolve(res);
            });
        });
      },
      // 获取在线客服地址
        getOnlineService() {
        this.$AppBridge.getInitData({ type: "pageaddress" }, res => {
            console.log("pageaddress", res);
            if (
            res.code === "200" &&
            res.data &&
            res.data.pageaddress &&
            res.data.pageaddress.length
            ) {
            let list =
                typeof res.data.pageaddress != "string"
                ? res.data.pageaddress
                : JSON.parse(res.data.pageaddress);

            list.map((item, index) => {
                if (item.type === "ONLINESERVICE" && item.showmodel === "2") {
                this.onlineServiceURL = item.url;
                console.log("this.onlineServiceURL", this.onlineServiceURL);
                }

                if (item.type === "ZHENGXINURL" && item.showmodel === "2") {
                this.zhengxinURL = item.url;
                console.log("this.zhengxinURL", this.zhengxinURL);
                }
            });
            }
        });
      }
    },
    created() {
      this.init();
      this.getOnlineService();

      console.log(
        "isShowIframeUrl------------------------",
        this.isShowIframeUrl
      );
      EventBus.$on("postMessage", this.postMessageHandle);
    },
    destroyed() {
      EventBus.$off("postMessage");
    },
    mounted() {
      this.$nextTick(() => {
        this.loadingClose();
      });

      console.log("home mounted this.appName", this.appName);
    },
    onRefresh(tag, data) {
      if (tag == "home" || tag == "refresh") {
        this.init(tag);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @-webkit-keyframes loadingRotate {
    0% {
      -webkit-transform: rotateZ(0deg);
    }
    100% {
      -webkit-transform: rotateZ(360deg);
    }
  }

  .view {
    transform: translateX(0);

    /deep/ .inner {
      min-height: 111vh;
      margin-top: -40px !important;
      position: relative;

      .pull-refresh {
        background-color: transparent !important;
        height: 24px !important;
        padding: 0 !important;
        top: 14px !important;
      }
    }

    .c-view-content {
      transition: all 0.5s;

      /deep/ .mint-cell .mint-cell-text {
        font-size: 14px;
      }
    }
  }

  .bg {
    height: 100vh;
    background: white;
    position: relative;
    z-index: -1;

    img {
      display: block;
      width: 100%;
      position: relative;
      z-index: -1;
    }
  }

  .pull-down-bg {
    background-color: rgba(71, 66, 62, 1);
    position: absolute;
    z-index: -1;
    width: 100%;
  }

  .header {
    position: relative;
    z-index: 1;
    // transition: background .3s;
    &.show {
      background: #514353 !important;
      color: white !important;
    }

  }

  .block-header {
    display: block;
    background: transparent;
    height: 88px;

    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
      height: 110px;
    }
    @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
      height: 110px;
    }
  }

  .section + .section {
    border-top: 8px solid #f4f4f4;
  }

  .iframe-section {
    border-top: 0 !important;
  }

  .banner-content {
    background-color: white;
    padding: 10px 0;
    overflow: hidden;

    img {
      width: 100%;
    }
  }

  .posi-r {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .redEnvelope {
      margin-right: 8px;
      img {
        width: 24px;
      }
    }
  }

  .red-icon {
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #ffffff;
    position: absolute;
    display: inline-block;
    text-align: center;
    background-color: #e72427;
    transform: scale(0.5);
  }

  .red-icon-one {
    height: 24px;
    line-height: 24px;
    width: 24px;
    top: -11px;
    right: -12px;
    border-radius: 50%;
  }

  .red-icon-two {
    height: 24px;
    line-height: 24px;
    width: 36px;
    border-radius: 36px;
    top: -14px;
    right: -20px;
  }

  .red-icon-three {
    height: 24px;
    line-height: 24px;
    width: 40px;
    border-radius: 40px;
    top: -13px;
    right: -22px;
  }

  .king-home-floatimg {
    position: fixed;
    top: 60%;
    right: 0;
    height: 67px;
    width: 67px;
    // transition: all .5s;
    img {
      width: 100%;
      height: auto;
    }
  }

  .offline-wrap {
    img {
      width: 100%;
      display: block;
      margin: 0 auto;
    }
  }

  .swipe-content,
  .swiper-container {
    overflow: visible;
    height: 120px;
  }
</style>
