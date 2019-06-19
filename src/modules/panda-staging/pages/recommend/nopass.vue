<template lang="html">
    <div class="view">
        <div class="c-view-content">
            <div class="m-banner" >
                <c-header ref="transparentHeader" class="header transparent" :style="`color: rgba(0, 0, 0, ${headerRgba}); background: rgba(255, 255, 255, ${headerRgba}); opacity: ${headerOpacity}`" :title="appName2" :show="true">
                    <span slot="right" class="posi-r">
                        <div class="he-inline-block" v-sina-ads='stat.recommend.online.kefu' @click="$root.openUrl(onlineServiceUrl);redIcon=false;" >
                            <img class="c-icon icon_a" src="../../assets/images/kefu-white@2x.png"/>
                        </div>
                        <div class="he-inline-block" v-sina-ads='stat.recommend.message.mess' @click="$root.openUrl(messageUrl);redIcon=false;" >
                            <img class="c-icon icon_a" src="../../assets/images/message-white@2x.png"/>
                            <span v-if="redIconShow" :class="['red-icon', ['red-icon-one', 'red-icon-two', 'red-icon-three'][redIconCount.length - 1]]">{{redIconCount}}</span>
                        </div>
                    </span>
                </c-header>

                <div class="no-pass">
                    <div class="title">抱歉</div>
                    <div class="sub-title">您距离分期额度卡领取门槛只差一点点，过段时间再来哟！</div>
                </div>
            </div>
            <div class="m-content">
                <div class="c-flex-row c-v-center el-tabs">
                    <div class="c-col-50" @click="$root.openUrl({url: yqhyURL, title: '征信查询'})">
                        <div class="he-inline-block">
                            <img src="../../assets/images/yqhy.png" />
                        </div>
                        <div class="he-inline-block el-text">
                            <div class="title">邀请好友</div>
                            <div class="sub-title">超值奖励</div>
                        </div>
                    </div>
                    <div class="c-col-50" @click="$root.openUrl({url: bzzxURL, title: '征信查询'})">
                        <div class="he-inline-block">
                            <img src="../../assets/images/bzzx.png" />
                        </div>
                        <div class="he-inline-block el-text">
                            <div class="title">帮助中心</div>
                            <div class="sub-title">使用指南</div>
                        </div>
                    </div>
                </div>
                <offline-product class="section" v-if="homeData.thirdproducts" :resdata="homeData"/>
                <!-- 征信查询  v-if="zhengxinURL" -->
                <div class="section credit-content" @click="$root.openUrl({url: zhengxinURL, title: '征信查询'})"></div>
                <!-- 判断是否超过1屏幕，class="el-watermark-noScreen" 如未超过添加class-->
                <watermark />
            </div>
        </div>
    </div>
</template>

<script>
import newcards from "./components/newcards";
import record from "./components/record";
import broadcast from "./components/broadcast";
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
import watermark from "../../components/watermark";
import MaxentSDK from "@/services/MaxentSDK";

export default {
  data() {
    return {
      messageUrl: process.env.staticPath + "/panda-staging/#/message", //消息中心
      repayUrl: process.env.staticPath + "/panda-staging/#/recommend/repayList", //还款列表
      onlineServiceUrl: "",
      zhengxinURL: "", //征信查询
      yqhyURL: "", //邀请好友
      bzzxURL: "", //帮助中心
      redIconShow: false,
      redIconCount: "0",
      pullDown: true,
      headerOpacity: 1,
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
  mixins: [require("../../mixins").default],
  components: {
    newcards,
    record,
    broadcast,
    offlineProduct,
    multiApply,
    creditCard,
    secondRemittance,
    scroller,
    watermark
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
          this.$AppBridge.getHomeData({}, res => {
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
      this.$AppBridge.getInitData({ type: "pageaddress" }, res => {
        console.log("pageaddress", res);
        if (
          res.code == "200" &&
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
              this.onlineServiceUrl = item.url;
              return;
            }
            if (item.type === "ZHENGXINURL" && item.showmodel === "2") {
              this.zhengxinURL = item.url;
              console.log("this.zhengxinURL", this.zhengxinURL);
            }

            if (item.type === "FRIENDS_PAGE" && item.showmodel === "2") {
              this.yqhyURL = item.url;
              console.log("this.yqhyURL", this.yqhyURL);
            }

            if (item.type === "HELP" && item.showmodel === "2") {
              this.bzzxURL = item.url;
              console.log("this.bzzxURL", this.bzzxURL);
            }
          });
        }
      });
    }
  },
  created() {
    this.getOnlineService();
    this.init();
    console.log("created");
    EventBus.$on("postMessage", this.postMessageHandle);
  },
  destroyed() {
    EventBus.$off("postMessage");
  },
  mounted() {
    this.$root.setStatusColor("white");
    console.log("mounted");
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

  .m-banner {
    position: relative;
    background: url("../../assets/images/no-pass-banner.png") no-repeat;
    background-size: 100%;
    height: 220px;

    .no-pass {
      position: absolute;
      bottom: -33px;
      height: 140px;
      background: #fffeff;
      box-shadow: 0 10px 10px 0 rgba(223, 221, 246, 0.55);
      border-radius: 8px;
      text-align: left;
      padding: 30px 20px;
      width: 90%;
      margin-left: 5%;
      background: url("../../assets/images/card@2x.png") no-repeat;
      background-size: 100%;

      .title {
        font-size: 18px;
        color: #1f2b5a;
        margin-bottom: 8px;
      }
      .sub-title {
        font-size: 14px;
        color: #1f2b5a;
      }
    }
  }
  .m-content {
    margin-top: 60px;

    .el-tabs {
      .he-inline-block {
        text-align: left;
        img {
          width: 44px;
        }

        .title {
          font-size: 14px;
          color: #1f2b5a;
        }
        .sub-title {
          font-size: 12px;
          color: #66668a;
        }

        &.el-text {
          vertical-align: top;
          margin-top: 4px;
          margin-left: 2px;
        }
      }
    }
  }
  .c-view-content {
    transition: all 0.5s;
    box-sizing: border-box;
  }

  .nopass-content {
    background-size: 100%;
    width: 100%;

    .header-content {
      display: flex;
      align-items: center;
      text-align: left;
      padding-left: 16px;
      margin-bottom: 10px;
      .center {
        display: flex;
        align-items: center;
        img {
          width: 100px;
          content: normal !important;
        }
      }
      .header-desc {
        display: inline-block;
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        color: #797979;
        margin-left: 6px;
        padding-left: 6px;
        border-left: 1px solid #797979;
      }

      .right {
        position: absolute;
        right: 0;
        margin-right: 16px;
      }
    }
  }
}

.no-thirdproducts-kefu {
  margin: 20px 16px;
  img {
    width: 100%;
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
  background-image: linear-gradient(-190deg, #7164cb 0%, #3961d6 100%);
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
  &.transparent {
    background: rgba(0, 0, 0, 0);
  }
}
.block-header {
  display: block;
  background: transparent;
  height: 50px;

  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    height: 60px;
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
    height: 88px;
  }
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

/deep/ .mint-header-title {
  margin-left: 26px;
  color: white;
}
.posi-r {
  position: relative;

  .he-inline-block {
    margin-left: 10px;
  }
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

.el-watermark-noScreen {
  position: absolute;
  bottom: 30px;
  width: 100%;
}

.icon_b {
  width: 22px;
  height: 22px;
}

.credit-content {
  margin: 14px 16px 0 16px;
  background: url("../../assets/images/zhengxin.png");
  background-size: 100% 100%;
  height: 90px;
  border-radius: 4px;
  padding: 16px 14px;

  .c-flex-row {
    align-items: center;
    text-align: left;
  }
  .c-col-75 {
    padding: 15px 0;
  }
  .c-col-30 {
    text-align: right;
  }
  .title {
    text-align: left;
    font-size: 16px;
    color: #fff;
  }
  .desc {
    font-size: 12px;
    color: #fff;
    margin-top: 4px;
    text-align: left;
  }
  .repay-btn {
    margin-top: 16px;
    height: 32px;
    background: #ffffff;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    font-size: 14px;
    color: #3d8aff;
  }
}
</style>
