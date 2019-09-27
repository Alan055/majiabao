<template lang="html">
  <div class="view">
    <!--<div class="c-layer" v-show="headerRgba == 0" v-if="homeData.apiFinish">-->
    <!--<div class="pull-down-bg" :style='{height: activeHeight}'></div>-->
    <!--</div>-->

    <c-header ref="transparentHeader" class="header transparent" :title="appName2" :show="browser.android"
              :style="`color: rgba(0, 0, 0, ${headerRgba}); background: rgba(255, 255, 255, ${headerRgba}); opacity: ${headerOpacity}`">
            <span slot="left" class="posi-l">
                <c-icon type="back" @click.native="handleBack"/>
            </span>
      <span slot="right" class="posi-r">
                <div class="he-inline-block" v-sina-ads='stat.recommend.online.kefu'
                     @click="$root.openUrl(onlineServiceURL);redIcon=false;">
                    <img class="c-icon icon_a" src="../../assets/images/kefu@2x.png"/>
                </div>
                <div class="he-inline-block" v-sina-ads='stat.recommend.message.mess'
                     @click="$root.openUrl(messageUrl);redIcon=false;">
                    <img class="c-icon icon_a" src="../../assets/images/message@2x.png"/>
                    <span v-if="redIconShow"
                          :class="['red-icon', ['red-icon-one', 'red-icon-two', 'red-icon-three'][redIconCount.length - 1]]">{{redIconCount}}</span>
                </div>
            </span>
    </c-header>

    <div id="spaceDiv" style="display: block; height: 120vh;"></div>

    <scroller v-if="homeData.apiFinish" class="c-view-content" id="scrollerContent" :enableRefresh="true"
              :on-refresh="refresh" :offset="120" :bounce="80" :maxScrollerHeight="160" :power="2"
              @refreshFinsh="refreshFinsh" @onScroll="onScroll" @onPulling="onPulling">
      <template slot="pull-refresh">
        <div class="pull-refresh-home">
          <span class="down-tip"><i></i>下拉刷新</span>
          <span class="up-tip"><i></i>松开刷新</span>
          <span class="refresh-tip"><i></i>正在刷新</span>
        </div>
      </template>
      <!-- <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div> -->

      <!-- 还款区域 -->
      <div class="section repay-content" v-if="homeData.apiFinish && homeData.repayProducts.length > 0"
           @click="handleRepayClick">
        <div class="c-flex-row">
          <div class="c-col-75">
            <img src="./../../assets/images/notice.jpg" alt="">
            您有<em>{{homeData.repayProducts.length}}</em>笔待还账单
             <span v-if="homeData.repayDate">最近还款日{{homeData.repayDate}}</span>
          </div>
          <div class="c-col-25">
            <em v-show="isShowRepayRed"></em>
            立即还款
          </div>
        </div>
      </div>

      <!-- <topIcon/> -->
      <record class="section transparent-gap" :resdata="homeData" v-if="homeData.withdrawProducts"/>
      <!-- 获取更多额度 -->
      <multi-apply id="multiApplyContent" class="section" :resdata="homeData" v-if="homeData"/>

      <!-- 安卓版显示贷超
      <credit-card class="section iframe-section" :style="`height: ${creditCardHeight};`" v-if="iframeUrl && browser.android" :iframeUrl="iframeUrl" />
      -->

      <!-- 三级商户 -->
      <offline-product class="section" :resdata="homeData"/>

      <!-- 在线客服 -->
      <!--<div class="section kefu-content" v-if="homeData.apiFinish && onlineServiceURL" @click="$root.openUrl({url: onlineServiceURL, title: '在线客服'})">-->
      <!--<img src="../../assets/images/kefu-img.png" />-->
      <!--</div>-->

      <!-- 征信查询  -->
      <div class="section credit-content">
        <p class="el-title">信用生活</p>
        <div class="c-flex-row">
          <div class="c-col-50" @click="$root.openUrl({url: zhengxinURL, title: '征信查询'})">
            <img class="he-auto-img" src="../../assets/images/zhenxin.png"/>
          </div>
          <div class="c-col-50" @click="$root.openUrl({url: huabeiURL, title: '花呗提现'})">
            <img class="he-auto-img" src="../../assets/images/huabei.png"/>
          </div>
        </div>
      </div>
      <!-- <watermark ref="watermark"/> -->
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
  import {Toast, Indicator} from "@/utils/helper";
  import MaxentSDK from "@/services/MaxentSDK";
  import watermark from "../../components/watermark";

  export default {
    data() {
      return {
        messageUrl: process.env.staticPath + "/panda-credit/#/message", //消息中心
        repayUrl: process.env.staticPath + "/panda-credit/#/recommend/repayList", //还款列表
        onlineServiceURL: "",
        zhengxinURL: "",
        huabeiURL: "",
        redIconShow: false,
        redIconCount: "0",
        pullDown: true,
        headerOpacity: 1,
        headerRgba: 1,
        activeHeight: "30vh",
        isShowRepayRed: false,
        browser: util.browser.versions,
        homeData: {
          apiFinish: false,
          repayDate: "", //最近还款日
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
      topIcon,
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
            //this.queryHomePageWelfareInfo();
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
        //this.headerOpacity = 0;
        this.init();
        setTimeout(() => {
          this.headerOpacity = 1;
          cb && cb();
        }, 1000);
      },
      //top 距离顶部的像素点
      onPulling(top) {
        if (top && top > 20) {
          //this.headerOpacity = 0;
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
      handleBack() {
        this.$AppBridge.activityView({
          type: "close"
        });
      },

      //还款列表点击
      handleRepayClick() {
        helper.set("isShowRepayRed", 1);
        this.isShowRepayRed = false;
        this.$root.openUrl({url: this.repayUrl, title: "还款列表"});
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
              this.homeData.resecondproducts = 20000
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
        let repayDate = []; //有还款日期
        let otherProducts = [];
        if (data.applyproducts) {
          let repayArray = [16, 17, 18, 19, 20, 21, 22, 25, 26, 27, 31]; // 这里不是日期  是状态码 具体是什么不清楚
          for (let item of data.applyproducts) {
            if (repayArray.includes(item.status)) {
              repayProducts.push(item);
              // 这里千万注意  item有时候是没有数据的  测试环境传的是字符串时间戳(moment().valueOf()对字符串时间戳是NaN) 生产环境传的是字符串的时间格式  所以判断的时候要特别注意
              if (item.deadline) {
                // 处理的做法是 统一处理成时间戳  推入数组  要先判断一下是不是无效的时间("Invalid Date")
                let time = moment(isNaN(Number(item.deadline)) ? item.deadline : Number(item.deadline)).valueOf() // 如果传入的参数不是时间格式 得到的结果就是NaN
                !isNaN(time) && repayDate.push(time) // 当不是NaN的时候才传入到数组里面
              }
            } else {
              withdrawProducts.push(Object.assign({isOneProduct: true}, item));
            }
          }

            // data.applyproducts.forEach(item => {
            // /*
            //     if(item.status == 10) {
            //         withdrawProducts.push(item)
            //     }else if(repayArray.includes(item.status)){
            //         repayProducts.push(item);
            //     }else {
            //         otherProducts.push(Object.assign({isOneProduct: true}, item));
            //     }*/
            // if (repayArray.includes(item.status)) {
            //     repayProducts.push(item);
            //     //repayDate.push("1561037487");
            //     try {
            //     if (item.deadline) {
            //         //item.deadline = "2019-01-08 09:47:54";
            //         //item.deadline = "1546912074000";
            //         if (item.deadline.length != 13) {
            //         repayDate.push(new Date(item.deadline).getTime());
            //         } else {
            //         repayDate.push(item.deadline);
            //         }
            //     }
            //     } catch (error) {}
            // } else {
            //     withdrawProducts.push(Object.assign({ isOneProduct: true }, item));
            // }
            // });
          if (repayDate.length > 0) {
            repayDate.sort((a, b) => a - b); // 正序 这里应该是最近还款日  所以应该是最小的  下面取0
            this.homeData.repayDate = moment(Number(repayDate[0])).format("MM月DD日")
          }

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

        console.log("this.homeData", this.homeData);
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
        this.$AppBridge.getInitData({type: "pageaddress"}, res => {
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
                this.onlineServiceURL = item.url;
                console.log("this.onlineServiceURL", this.onlineServiceURL);
                return;
              }
              if (item.type === "ZHENGXINURL" && item.showmodel === "2") {
                this.zhengxinURL = item.url;
                console.log("this.zhengxinURL", this.zhengxinURL);
              }
              if (item.type === "HUABEIURL" && item.showmodel === "2") {
                this.huabeiURL = item.url;
                console.log("this.huabeiURL", this.huabeiURL);
              }
            });
          }
        });
      }
    },
    created() {
      this.$root.setWebAttribute({
        //title: this.appName2
        title: "借款"
      });
      helper.get("isShowRepayRed").then(value => {
        if (value != 1) {
          this.isShowRepayRed = true;
        }
      });
      this.init();
      this.getOnlineService();
      EventBus.$on("postMessage", this.postMessageHandle);
    },
    updated() {
      //console.log('this.$refs.watermark', this.$refs.watermark)
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

  .header {
    @extend %border-b;
  }

  .view {
    transform: translateX(0);
    background: #F8F8FA;
    /deep/ .inner {
      margin-top: -22px !important;
      position: relative;
      >div{
        background: #fff;
        margin-bottom: 8px;
        &:last-child{
          margin-bottom: 0px;
        }
      }
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
    height: 44px;

    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
      height: 68px;
    }
    @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
      height: 88px;
    }
  }

  .iframe-section {
    border-top: 0 !important;
  }

  .repay-content {
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 8px;
    .c-flex-row {
      position: relative;
    }
    .c-col-75 {
      text-align: left;
      font-size: 12px;
      display: flex;
      justify-content: left;
      align-items: center;
      img {
        width: 35px;
        height: 17px;
        margin-right: 6px;
        vertical-align: middle;
      }
      em {
        color: #e72427;
      }
    }
    .c-col-25 {
      color: #4586ee;
      font-size: 12px;
      text-align: right;
      padding-right: 10px;

      em {
        display: inline-block;
        border-radius: 50%;
        height: 8px;
        width: 8px;
        background-color: #e72427;
      }
      &:after {
        border-bottom-width: 0;
        border-left-width: 0;
        width: 0.628571rem;
        width: 0.55rem;
        height: 0.628571rem;
        height: 0.55rem;
        margin-top: -1px;
        border: 0.142857rem solid #4586ee;
        border-bottom-width: 0;
        border-left-width: 0;
        content: " ";
        top: 50%;
        right: 0;
        position: absolute;
        width: 0.357143rem;
        height: 0.357143rem;
        -webkit-transform: translateY(-50%) rotate(45deg);
        transform: translateY(-50%) rotate(45deg);
      }
    }
    .title {
      font-size: 20px;
      color: #0db983;
      text-align: left;
    }
    .desc {
      font-size: 14px;
      color: #444444;
      margin-top: 4px;
      text-align: left;
    }
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

  .section-title {
    border: 0;
    padding-left: 16px;
  }

  .icon_b {
    width: 22px;
    height: 22px;
  }

  .credit-content {
    padding: 16px;
    .el-title {
      margin-bottom: 16px;
      font-size: 18px;
      color: #333333;
    }
    .c-flex-row {
      align-items: center;
      text-align: left;
    }
    .c-col-50 {
      &:nth-child(1) {
        img {
          padding-right: 4px;
        }
      }
      &:nth-child(2) {
        img {
          padding-left: 4px;
        }
      }
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
