<template lang="html">
  <div class="view">

    <div class="c-layer" v-if="homeData.apiFinish">
      <div class="pull-down-bg" :style='{height: activeHeight}'></div>
    </div>

    <div class="c-layer">
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
    </div>

    <div id="spaceDiv" style="display: block; height: 120vh;"></div>

    <scroller class="c-view-content" id="scrollerContent" :enableRefresh="true" :on-refresh="refresh" :offset="100"
              :bounce="60" :maxScrollerHeight="160" :power="2" @refreshFinsh="refreshFinsh" @onScroll="onScroll"
              @onPulling="onPulling">
      <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div>

      <!-- 专属推荐（new卡） -->
      <newcards class="section" :resdata="homeData" v-if="homeData.newcards"/>

      <!-- 借还记录 -->
      <record class="section transparent-gap" :resdata="homeData" v-if="homeData.applyproducts"/>

      <!-- 获取更多额度 -->
      <multi-apply id="multiApplyContent" class="section" :resdata="homeData" v-if="homeData.resecondproducts"/>

      <!-- 秒下款
      <secondRemittance class="section" :resdata="homeData.mxkproducts" v-if="homeData.mxkproducts"/>
      -->

      <!-- 拒件记录 -->
      <div id="rejectpageContent" class="section" v-if="homeData.rejectpage"
           v-sina-ads="stat.recommend.refuse.open">
        <mt-cell title="审核被拒" is-link @click.native="$root.openUrl(homeData.rejectpage)"></mt-cell>
      </div>

      <!-- 在线客服 -->
      <!--<div class="section banner-content" v-if="homeData.apiFinish">-->
        <!--<van-swipe class="swipe-content" :autoplay="3000" :show-indicators="false" indicator-color="white">-->
          <!--<van-swipe-item v-for="(item, i) in bannerInfoData.pagedata" :key="i"-->
                          <!--@click="$root.openUrl(item.jumplink)">-->
            <!--<img v-if="item.imgurl" style="width: 100%; height: 100%;" :src="item.imgurl"/>-->
          <!--</van-swipe-item>-->
        <!--</van-swipe>-->
      <!--</div>-->
      <!--广告位-->
      <banner pageId="1001"></banner>

      <!-- 贷超 -->
      <credit-card class="section iframe-section" :style="`height: ${creditCardHeight};`"
                   v-if="iframeUrl && isShowIframeUrl == 1" :iframeUrl="iframeUrl" id="iframeSection"/>


      <!-- 线下三级商户 -->
      <offline-product class="section" :resdata="homeData" v-if="homeData.thirdproducts" id="offlineProduct"/>
    </scroller>

    <!--<rongze-dialog :visibility="homeData.xm_driverPopConfig != ''" :data="homeData.xm_driverPopConfig"></rongze-dialog>-->

    <jitter v-if="jitterArgs.isShow && driver.xm_driverSuspensionWindowConfig.imgurl" :start.sync="jitterArgs.isStart"
            @jitterClick="jitterClick"
            :icon="driver.xm_driverSuspensionWindowConfig.imgurl"
    />

    <dialog_redEnvelope class="redbox" :close="closeRedBagDialog" :showDialog.sync="showRedEnvelope" :res="homeData.welfareInfo"></dialog_redEnvelope>

  </div>
</template>

<script>
  import newcards from "./components/newcards";
  import record from "./components/record";
  import offlineProduct from "./components/offlineProduct";
  import multiApply from "./components/multiApply";
  import secondRemittance from "./components/secondRemittance";
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

  import jitter from "@/components/business/jitter";
  import {mapGetters, mapMutations, mapState} from "vuex";
  import rongzeDialog from "@/components/business/rongzeDialog";
  import dialog_redEnvelope from "@/components/business/dialog_redEnvelope.vue";
  import banner from "@/components/business/recommendBanner.vue";


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

        //抖动小球参数
        jitterArgs: {
          isShow: false,
          isStart: false,
        },
        showRedEnvelope: false, // 是否展示红包的窗口
      };
    },
    components: {
      newcards,
      record,
      offlineProduct,
      multiApply,
      creditCard,
      secondRemittance,
      scroller,
      rongzeDialog,
      jitter,
      dialog_redEnvelope,
	    banner,
    },

    computed: {
      ...mapState([
        'driver'
      ]),
    },
    methods: {
      ...mapMutations(['setDriverConfig',]),

      //解析首页导流参数
      parseHomeDriver(res) {

        //new卡导流-联合登录
        this.PubDriver('xm_newcardsconfig', res.data.xm_newcardsconfig)

        //弹窗导流-联合登录
        this.PubDriver('xm_driverPopConfig', res.data.xm_driverPopConfig)

        //小球导流-联合登录
        this.jitterDriver(res.data.xm_driverSuspensionWindowConfig)

      },
      // 关闭红包弹框
      closeRedBagDialog(){
        this.showRedEnvelope = false
      },
      //小球点击
      jitterClick() {
        this.sinaAds.click({currEvent: this.stat_diversion.diversion.jitter.click,}, () => {
        });

        console.log('jumpLink==>', this.driver.xm_driverSuspensionWindowConfig.url);

        //联合登录
        this.beforeDriver(this.driver.xm_driverSuspensionWindowConfig.unloginUrl)

        // "type": "1", //1 内联 2外联打开
        this.driver.xm_driverSuspensionWindowConfig.url && AppBridge.activityView({
          type: "open",
          url: this.driver.xm_driverSuspensionWindowConfig.url,
          open_inner: this.driver.xm_driverSuspensionWindowConfig.type == 1,
        });
      },

      //小球导流-联合登录
      jitterDriver(params) {

        this.PubDriver('xm_driverSuspensionWindowConfig', params)

        this.jitterArgs = {
          isShow: true,
          isStart: true,
        }
        this.sinaAds.display({currEvent: this.stat_diversion.diversion.jitter.show,}, () => {
        });
        setInterval(() => this.jitterArgs.isStart = !this.jitterArgs.isStart, 5000)
      },

      //联合登录-公共处理【new卡、小球、】
      PubDriver(key, params) {
        if (params) {
          this.setDriverConfig({
            key,
            data: params
          })
          return
        }
        this.PubDriver(key, {
          imgurl: "",
          unloginUrl: "",
          type: "",
          showmodel: "",
          tipCount: 0,
          url: ""
        })
      },

      init(tag) {
        try {
          //this.initHomeData()
          //this.getApplyList();
          //this.getSecondProductList();
          //this.getRejectApplyList();
          //this.getMXKConfig();
          this.fetchData(tag).then(res => {
            this.queryHomePageWelfareInfo();
          });
          this.getbannerinfo();
          this.getmarketinfo();
          //this.getEntranceConfig();
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
      //刷新
      refresh(cb) {
        this.headerOpacity = 0;
        this.init();
        setTimeout(() => {
          this.headerOpacity = 1;
          cb && cb();
        }, 1000);
      },
      //top 距离顶部的像素点
      onPulling(top) {
        if (top && top > 20) {
          this.headerOpacity = 0;
        }
      },
      //滚动中
      onScroll(e) {
        let scrollTop = e.target.scrollTop;
        if (scrollTop <= 100) {
          //this.headerRgba = scrollTop / 100;
        } else {
          this.headerRgba = 1;
          this.headerOpacity = 1; //解决正在刷新时又上滑透明度不还原问题
        }
      },
      //刷新完成
      refreshFinsh() {
        setTimeout(() => {
          this.headerOpacity = 1;
        }, 200);
      },

      //获取借还款记录
      getApplyList() {
        return new Promise((resolve, reject) => {
          api.home.getApplyList().then(res => {
            if (helper.isSuccess(res)) {
              this.homeData.applyproducts = res.data.applyproducts || [];
              this.resolveQueue(res.data.productext);

              resolve(res);
            }
          });
        });
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

      //获取二级商户
      getSecondProductList() {
        return new Promise((resolve, reject) => {
          api.home.getSecondProductList().then(res => {
            if (helper.isSuccess(res)) {
              if (!res.data) return;
              this.homeData.resecondproducts = res.data.resecondproducts || [];
              this.homeData.newcards = res.data.newcards;
              this.homeData.onekeyapplypage = res.data.onekeyapplypage;
            }
            resolve(res);
          });
        });
      },
      //获取秒下款
      getMXKConfig() {
        return new Promise((resolve, reject) => {
          api.home.getMXKConfig().then(res => {
            if (helper.isSuccess(res)) {
              if (res.data) {
                this.homeData.mxkproducts = res.data.mxkproducts;
              }
            }
            resolve(res);
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
      //获取banner位地址
      getbannerinfo() {
        return new Promise((resolve, reject) => {
          api.activity
            .getApprovaling({
              pageid: "1001",
              token: util.getParams("token") || storage.get("token") || ""
            })
            .then(res => {
              if (res.code == 200 && res.data && res.data.pagedata) {
                this.bannerInfoData = res.data.pagedata.homepageBanner;
                console.log("bannerInfoData", this.bannerInfoData);
              }
              resolve(res);
            });
        });
      },
      //拒件列表
      getRejectApplyList() {
        return new Promise((resolve, reject) => {
          api.home.getRejectApplyList().then(res => {
            if (res.code == 200 && res.data) {
              this.homeData.rejectpage = res.data.rejectpage;
            }
            resolve(res);
          });
        });
      },
      //获取三级商户（线下贷款）配置
      getEntranceConfig() {
        return new Promise((resolve, reject) => {
          api.home.getEntranceConfig().then(res => {
            if (!helper.isSuccess(res)) return;
            if (res.data && res.data.thirdproducts) {
              this.homeData.thirdproducts = res.data.thirdproducts;
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

                this.parseHomeDriver(res)

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

                  this.parseHomeDriver(res)

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
      queryHomePageWelfareInfo() {
        api.home
          .queryHomePageWelfareInfo({
            productId: 2001,
            token: util.getParams("token") || storage.get("token") || ""
          })
          .then(res => {
            if (helper.isSuccess(res)) {
              if (res.data) {
                this.homeData = Object.assign({}, this.homeData, {
                  welfareInfo: res.data
                });
                if(res.data.dialogRelData && res.data.dialogRelData.length){ // 有数据的时候就打开弹框
                  this.showRedEnvelope = true
                }
                // 添加埋点
                if (this.homeData.welfareInfo.entranceData) {
                  this.sinaAds.display({currEvent: this.stat.redEnvelope.index.showFiexd,}, () => {});
                }
              }
            }
          });
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
        AppBridge.getVisitUrl(
          {
            pageName: "ONLINESERVICE"
          },
          res => {
            if (!res || !res.data) return;
            let data = res.data;
            if (typeof data == "string") {
              data = JSON.parse(data);
            }

            if (data && data.url) {
              this.onlineServiceUrl = data.url;
            }
          }
        );
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
    },
    watch: {
      homeData: {
        deep: true,
        handler() {
          try {
            //if(data && Object.keys({}).length === 0) return;

            let innerEl = document.getElementById("innerSection");
            if (
              (this.homeData.applyproducts &&
                this.homeData.applyproducts.length > 0) ||
              this.homeData.newcards
            ) {
              if (innerEl) {
                //innerEl.style.backgroundColor = '#fff';
                //innerEl.style.backgroundImage = require('url(~@/static/img/background@2x.png');
              }
              setTimeout(() => {
                //this.loadingClose()
              }, 2000);
            }

            if (
              this.homeData.applyproducts &&
              this.homeData.applyproducts.length <= 0
            ) {
              if (innerEl) {
                //this.$refs.transparentHeader.style.backgroundColor = 'rgba(81, 67, 83, 1)';
                //innerEl.style.backgroundColor = 'none';
                //innerEl.style.backgroundImage = 'none';
                /*
                                  let pullEl = document.getElementById('pullRefresh');
                                  if(pullEl){
                                      console.log(2)
                                      innerEl.removeChild(pullEl);
                                  }*/
              }
            }
            console.log("合并后的接口", this.homeData);
          } catch (error) {
            //todo
          }
        }
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
