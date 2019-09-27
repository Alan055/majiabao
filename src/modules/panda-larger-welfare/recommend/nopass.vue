<template lang="html">
  <div class="view">
    <div class="c-view-content">
      <div class="c-layer">
        <c-header ref="transparentHeader" class="header transparent" :style="``" :title="'借钱'" :show="true">
                <span slot="right" v-sina-ads='stat.recommend.message.mess'
                      @click="$root.openUrl(messageUrl);redIcon=false;" class="posi-r">
                        <mt-button><img class="c-icon icon_a" src="../images/message-white.png"/></mt-button>
                        <span v-if="redIconShow"
                              :class="['red-icon', ['red-icon-one', 'red-icon-two', 'red-icon-three'][redIconCount.length - 1]]">{{redIconCount}}</span>
                </span>
        </c-header>
      </div>

      <div class="m-banner">
        <div class="no-pass">
          <!--<img src="./../../assets/images/nopass.png" alt="">-->
          <span class="title">抱歉</span>
          <span>您距离分期额度卡领取门槛只差一点点</span>
          <span>已为您分配更合适的产品</span>
        </div>
      </div>
      <div class="m-content">
        <!--贷款推荐-->
        <credit-card className="loanRecommendation" class="section iframe-section" :style="`height:${loanRecommendationHeight}px`" v-if="iframe_LoanRecommendation " :iframeUrl="iframe_LoanRecommendation"/>

        <!-- 三级商户 -->
        <offline-product class="section" :resdata="homeData"/>

        <!--广告位-->
        <mt-swipe class="bannerList" :auto="3000" :showIndicators="true" v-if="bannerList.length">
          <mt-swipe-item v-for="item in bannerList" :key="item.id"  @click="jump(item)">
            <img :src="item.imgurl"  v-sina-ads="stat.recommend.refuse.clickBanner"/>
           </mt-swipe-item>
        </mt-swipe>

        <!--征信查询-->
        <mt-swipe class="zxSearch" :auto="3000" :showIndicators="zhengxin.length>1" v-if="">
          <mt-swipe-item v-for="(v,i) in zhengxin" :key="i"  >
            <img :src="v.imgurl"  v-sina-ads="stat.recommend.refuse.clickBanner" @click="jump(v)" />
          </mt-swipe-item>
        </mt-swipe>

        <!--信用分期-->
        <credit-card className="credit" class="section iframe-section" :style="" v-if="iframeUrl_creditStaging " :iframeUrl="iframeUrl_creditStaging"/>

        <!-- 在线客服 -->
        <kefu_people :onlineServiceUrl="onlineServiceUrl" :serverNum="serverNum"></kefu_people>

        <!-- 判断是否超过1屏幕，class="el-watermark-noScreen" 如未超过添加class-->
        <!-- <watermark /> -->
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
  import {Toast, Indicator} from "@/utils/helper";
  import watermark from "../components/watermark";
  import MaxentSDK from "@/services/MaxentSDK";
  import kefu_people from "./components/kefu_people";



  export default {
    data() {
      return {
        messageUrl: process.env.staticPath + "/v1.1.0/king/pages/panda-larger-welfare/#/message", //消息中心
        repayUrl: process.env.staticPath + "/v1.1.0/king/pages/panda-larger-welfare/#/recommend/repayList", //还款列表
        onlineServiceUrl: "",
        zhengxin: [], //征信查询
        huabeiURL: "", // 花呗提现url
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
        creditCardHeight: "0", //商业地址高度
        iframeUrl_creditStaging: '', // 信用分期的iframe url
        bannerList: [], // 广告位列表
        serverNum: 0, // 服务人数
        iframe_LoanRecommendation: '', // 商业化资源位  贷款推荐iframe
        loanRecommendationHeight: 0, // 高度
      };
    },
    mixins: [require("../mixins").default],
    components: {
      newcards,
      record,
      broadcast,
      offlineProduct,
      multiApply,
      creditCard,
      secondRemittance,
      scroller,
      watermark,
      kefu_people,
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
          this.getCreditStaging()
          this.getServerNum()
          this.getmarketinfo();
          this.getLoanRecommendation();
          //this.getEntranceConfig();
          this.redData();
        } catch (error) {
          this.loadingClose();
        }
      },
      // 跳转
      jump(v){
        if(v.jumptype == 1){ // h5内置打开
          this.$root.openUrl(v.jumplink)
        }else if(v.jumptype == 2){
          this.$AppBridge.activityView({
            type: "open",
            url: v.jumplink,
            isFull: false,
            open_inner: false,
          });
        }
      },
      //接受iframe回调方法
      postMessageHandle(value) {
        console.log("loanRecommendationHeight", value)
        if (value && typeof value == "number") {
          this.$nextTick(() => {
            setTimeout(() => {
              this.loanRecommendationHeight = value + "px";
              this.loadingClose();
            }, 1000);
          });
        }
      },
      // 获取服务人数
      getServerNum(){
        this.$AppBridge.getInitData({}, res => {
          if (res.code == "200") {
            this.serverNum = util.moneyFormat(Number(res.data.peoplenum)).replace('.00','')
          }
        });
      },
      // 获取信用分期的资源位
      getCreditStaging(){
        this.$api.activity.getApprovaling({pageid: 1027,mjbname: util.getParams('mjbname'),productId: 2001}).then((res)=>{
          if (helper.isSuccess(res)) {
            console.log("getCreditStaging",res)
            let obj = res.data.pagedata.loanPageCredit.pagedata[0]
            obj && (this.iframeUrl_creditStaging = `${obj.thumbnailurl}?nextUrl=${obj.jumplink}`)
            this.bannerList = res.data.pagedata.loanPageBanner.pagedata
            this.zhengxin =res.data.pagedata.loanPageBanner2.pagedata
          }
        })
      },
      // 获取商业化资源位 --贷款推荐
      getLoanRecommendation(){
        this.$api.activity.getAppMarketInfo({pageid: 1027,mjbname: util.getParams('mjbname'),productId: 2001}).then((res)=>{
          if (helper.isSuccess(res)) {
            console.log("getLoanRecommendation",res)
            this.iframe_LoanRecommendation = res.data.jumplink
          }
        })
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
      handleBack() {
        this.$AppBridge.activityView({
          type: "close"
        });
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
              withdrawProducts.push(Object.assign({isOneProduct: true}, item));
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
                this.onlineServiceUrl = item.url;
                return;
              }
              if (item.type === "HUABEIURL" && item.showmodel === "2") {
                this.huabeiURL = item.url;
                console.log("this.huabeiURL", this.huabeiURL);
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
      EventBus.$on("postMessage", this.postMessageHandle);
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
    background: #fff;

    .m-banner {
      margin-top: 70px;
      > div {
        margin-bottom: 8px;
        background: url("./../images/cardBoxBg.png") no-repeat;
        background-size: 100% 100%;
      }
      .no-pass {
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: self-start;
        color: #fff;
        padding: 0 32px;
        span {
          font-size: 14px;
          &.title {
            font-size: 22px;
            margin-bottom: 8px;
          }
        }

      }
    }
    .m-content {
      .recommend{
        height: 448px;
      }
      > .section {
       border-top: 8px solid #f7f7f7;
        background: #fff;
        padding-bottom: 14px;
      }
      .zxSearch{
        background: #fff;
        padding: 10px 16px;
        /deep/ .mint-swipe-items-wrap{
          height: 110px;
        }
        /deep/ .mint-swipe-indicator{
          width: 8px;
          height: 3px;
          background: #bac9ef;
          &.is-active{
            background: #648CFF;
          }
        }
        img {
          width: 100%;
          height: 110px;
        }
      }
      .bannerList{
        height: 140px;
        background: #fff;
        border-top: 8px solid #f7f7f7;
        padding: 0 16px;
        border-bottom: 8px solid #f7f7f7;
        div{
          display: flex;
          justify-content: center;
          align-items: center;
          height: 90px;
          margin-top: 16px;
        }
        /deep/ .mint-swipe-indicator{
          width: 8px;
          height: 3px;
          background: #bac9ef;
          &.is-active{
            background: #648CFF;
          }
        }
        img{
          height: 90px;
        }
      }
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
      background: url("./../images/nopassBg.png") no-repeat;
      background-size: contain;
      /deep/ .c-layer {
        height: unset;
      }
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

  .credit-content {
    background: #fff;
    margin-top: 8px;
    padding: 0 16px;
    height: 160px;
    .el-title {
      line-height: 50px;
      font-size: 18px;
      color: #333333;
      margin-bottom: 6px;
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
</style>
