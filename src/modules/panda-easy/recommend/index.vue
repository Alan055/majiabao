<template lang="html">
    <div class="view">
        <div class="c-layer" v-show="headerRgba == 0" v-if="homeData.apiFinish">
            <div class="pull-down-bg" :style='{height: activeHeight}'></div>
        </div>

        <div class="c-layer" v-show="headerRgba != 0">
            <c-header ref="transparentHeader" class="header transparent" :style="`color: rgba(0, 0, 0, ${headerRgba}); background: rgba(255, 255, 255, ${headerRgba}); opacity: ${headerOpacity}`" :title="appName2" :show="true">
            </c-header>
        </div>

        <div id="spaceDiv" style="display: block; height: 120vh;"></div>

        <scroller v-if="homeData.apiFinish" class="c-view-content" id="scrollerContent" :enableRefresh="true" :on-refresh="refresh" :offset="120" :bounce="80" :maxScrollerHeight="160" :power="2" @refreshFinsh="refreshFinsh" @onScroll="onScroll" @onPulling="onPulling">
            <template slot="pull-refresh">
                <div class="pull-refresh-home">
                    <span class="down-tip"><i></i>下拉刷新</span>
                    <span class="up-tip"><i></i>松开刷新</span>
                    <span class="refresh-tip"><i></i>正在刷新</span>
                </div>
            </template>
            <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div>

            <div class="header-content">
                <span class="center">
                    <img src="../images/loan-logo@2x.png"/>
                </span>
                <span class="posi-r right" v-sina-ads='stat.recommend.message.mess' @click="$root.openUrl(messageUrl);redIcon=false;">
                    <img class="c-icon icon_c" src="../images/message@2x.png"/>
                    <span v-if="redIconShow" :class="['red-icon', ['red-icon-one', 'red-icon-two', 'red-icon-three'][redIconCount.length - 1]]">{{redIconCount}}</span>
                </span>
            </div>

            <topIcon/>
            <record class="section transparent-gap" :resdata="homeData" v-if="homeData.withdrawProducts"/>
            <!-- 获取更多额度 -->
            <multi-apply id="multiApplyContent" class="section" :resdata="homeData" v-if="homeData"/>
            
            <!-- 贷超 -->
            <credit-card class="section iframe-section" :style="`height: ${creditCardHeight};`"
                         v-if="iframeUrl && isShowIframeUrl == 1" :iframeUrl="iframeUrl" id="iframeSection"/>
            <offline-product class="section" :resdata="homeData" id="offlineProduct"/>

            <mobile :resdata="homeData"></mobile>
        </scroller>
    </div>
</template>

<script>
import newcards from "./components/newcards";
import record from "./components/record";
import broadcast from "./components/broadcast";
import topIcon from "./components/topIcon";
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
import { Toast, Indicator } from "@/utils/helper";
import mobile from "@/components/business/rentMobile";

import AppBridge from "@/services/AppBridge.js";
import MaxentSDK from "@/services/MaxentSDK";

export default {
  data() {
    return {
      messageUrl: process.env.kingPath + "/pages/panda/#/message", //消息中心
      onlineServiceUrl: "",
      redIconShow: false,
      redIconCount: "0",
      pullDown: true,
      isShowIframeUrl: util.getParams("isShowIframeUrl") || 0,
      headerOpacity: 0,
      headerRgba: 0,
      activeHeight: "30vh",
      homeData: {
        apiFinish: false,
        applyproducts: [],
        withdrawProducts: [],
        repayProducts: [],
        otherProducts: [],
        welfareInfo: [],
        newcards: "",
        onekeyapplypage: {
          url: ""
        },
        mxkproducts: "",
        rejectpage: "", //拒件记录跳转地址
        thirdproducts: "",
        productext: [],
        resecondproducts: []
      }, //首页数据汇总
      iframeUrl: "", //商业化地址
      creditCardHeight: "0" //商业地址高度
    };
  },
  mixins: [require("../mixins").default],
  components: {
    newcards,
    record,
    broadcast,
    topIcon,
    offlineProduct,
    multiApply,
    creditCard,
    secondRemittance,
    mobile,
    scroller
  },
  methods: {
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
      //this.initHomeData();
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
        this.headerRgba = scrollTop / 100;
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
            if (helper.isSuccess(res)) {
              console.log("收到伪协议的数据了！");
              this.homeData = Object.assign(this.homeData, res.data);
              this.homeData.apiFinish = true;
              this.formatData(this.homeData);
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
              if (helper.isSuccess(res)) {
                this.homeData = Object.assign(this.homeData, res.data);
                this.homeData.apiFinish = true;
                this.formatData(this.homeData);
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
    formatData(data) {
      let withdrawProducts = [];
      let repayProducts = [];
      let otherProducts = [];
      if (data.applyproducts) {
        let repayArray = [16, 17, 18, 19, 20, 21, 22, 25, 26, 27, 31];
        data.applyproducts.forEach(item => {
          /*
                        if(item.status == 10) {
                            withdrawProducts.push(item)
                        }else if(repayArray.includes(item.status)){
                            repayProducts.push(item);
                        }else {
                            otherProducts.push(Object.assign({isOneProduct: true}, item));
                        }*/
          if (repayArray.includes(item.status)) {
            repayProducts.push(item);
          } else {
            withdrawProducts.push(Object.assign({ isOneProduct: true }, item));
          }
        });
        this.homeData.withdrawProducts = withdrawProducts;
        this.homeData.repayProducts = repayProducts;
        helper.set(
          "homeData-repayProducts",
          JSON.stringify(this.homeData.repayProducts)
        );
      }
      if (data.resecondproducts && data.resecondproducts.length > 0) {
        otherProducts = otherProducts.concat(data.resecondproducts);
      }
      this.homeData.otherProducts = otherProducts;
    },
    queryHomePageWelfareInfo() {
      api.home
        .queryHomePageWelfareInfo({
          type: "list",
          token: util.getParams("token") || storage.get("token") || ""
        })
        .then(res => {
          if (helper.isSuccess(res)) {
            if (res.data) {
              this.homeData = Object.assign({}, this.homeData, {
                welfareInfo: res.data.realData
              });
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
    EventBus.$on("postMessage", this.postMessageHandle);
  },
  destroyed() {
    EventBus.$off("postMessage");
  },
  mounted() {
    this.$root.setStatusColor("white");
    this.$nextTick(() => {
      this.loadingClose();
    });
  },
  onRefresh(tag, data) {
    if (tag == "home" || tag == "refresh") {
      this.init(tag);
    }
  },
  watch: {}
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
    margin-top: -22px !important;
    position: relative;
    .pull-refresh {
      background-color: transparent !important;
      height: 24px !important;
      padding: 0 !important;
    }
  }
  .c-view-content {
    transition: all 0.5s;
  }

  .header-content {
    text-align: center;
    margin-bottom: 20px;
    .center {
      display: inline-block;
      width: 100px;

      img {
        width: 100%;
        content: normal !important;
      }
    }

    .right {
      position: absolute;
      right: 0;
      margin-right: 16px;
    }
  }
}
.pull-refresh-home {
  .down-tip,
  .refresh-tip,
  .up-tip {
    display: none;
    color: black;

    i {
      position: relative;
      top: 3px;
      display: inline-block;
      height: 16px;
      width: 16px;
      margin-right: 6px;
    }
  }

  .down-tip {
    i {
      background: url("~@/assets/images/scroller/down-gay.png") no-repeat !important;
      background-size: cover !important;
    }
  }
  .up-tip {
    i {
      background: url("~@/assets/images/scroller/up-gay.png") no-repeat !important;
      background-size: cover !important;
    }
  }
  .refresh-tip {
    z-index: 2;

    i {
      animation: loadingRotate 0.5s linear infinite;
      background: url("~@/assets/images/scroller/loading-gay.png") no-repeat !important;
      background-size: cover !important;
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
  //background-image: linear-gradient(-190deg, #7164cb 0%, #3961d6 100%);
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
  height: 40px;

  /*@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    height: 60px;
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
    height: 88px;
  }*/
}

.section + .section {
  border-top: 8px solid #f4f4f4;
}
.iframe-section {
  border-top: 0 !important;
}
.kefu-content {
  background-color: white;
  padding: 10px 13px;

  img {
    width: 100%;
  }
}

.posi-r {
  position: relative;
}

.red-icon {
  font-size: 18px;
  color: #ffffff;
  position: absolute;
  display: inline-block;
  text-align: center;
  background-color: #e72427;
  transform: scale(0.5);
}

.red-icon-one {
  padding: 2px 8px 3px 6px;
  top: -11px;
  right: -10px;
  border-radius: 50%;
}

.red-icon-two {
  padding: 2px 9px 3px 6px;
  border-radius: 36px;
  top: -10px;
  right: -18px;
}

.red-icon-three {
  padding: 2px 9px 3px 6px;
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
</style>
