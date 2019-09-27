<template lang="html">
  <div class="view">

    <div class="c-layer" v-if="homeData.apiFinish">
      <div class="pull-down-bg" :style='{height: activeHeight}'></div>
    </div>

    <div class="c-layer">
      <c-header ref="transparentHeader" class="header transparent" :style="`background: #fff;color: #030303;border-bottom: 1px solid #F5F6FA;`" :title="'借钱'" :show="true">
                <span slot="right" v-sina-ads='stat.recommend.message.mess'
                      @click="$root.openUrl(messageUrl);redIcon=false;" class="posi-r">
                        <mt-button><img class="c-icon icon_a" src="../images/message-black.png"/></mt-button>
                        <span v-if="redIconShow" :class="['red-icon', ['red-icon-one', 'red-icon-two', 'red-icon-three'][redIconCount.length - 1]]">{{redIconCount}}</span>
                </span>
      </c-header>
    </div>

    <div id="spaceDiv" style="display: block; height: 120vh;"></div>


    <scroller v-if="homeData.apiFinish" class="c-view-content" id="scrollerContent" :enableRefresh="true" :on-refresh="refresh" :offset="100"
              :bounce="60" :maxScrollerHeight="160" :power="2" @refreshFinsh="refreshFinsh" @onScroll="onScroll"
              @onPulling="onPulling">


      <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div>
      <!--最近环境日-->
      <div class="section repay-content" v-if="homeData.repayProducts.length > 0"
           @click="handleRepayClick">
        <div class="c-flex-row">
          <div class="c-col-75">
            您有<em>{{homeData.repayProducts.length}}</em>笔待还账单
            <span v-if="homeData.repayDate">最近还款日{{homeData.repayDate}}</span>
          </div>
          <div class="c-col-25">
            <em v-show="isShowRepayRed"></em>
            立即还款
          </div>
        </div>
      </div>

      <!-- 专属推荐（new卡） -->
      <newcards :resdata="homeData" v-if="homeData.newcards"/>

      <!-- 借还记录 -->
      <record class="section transparent-gap" :resdata="homeData" v-if="homeData.applyproducts"/>

      <!-- 获取更多额度 -->
      <multi-apply id="multiApplyContent" class="section" :resdata="homeData" v-if="homeData"/>

      <!-- 线下三级商户 -->
      <offline-product class="section" :resdata="homeData" v-if="homeData.thirdproducts"/>



      <!-- 秒下款
      <secondRemittance class="section" :resdata="homeData.mxkproducts" v-if="homeData.mxkproducts"/>
      -->

      <!-- 拒件记录 -->
      <!-- <div id="rejectpageContent" class="section" v-if="homeData.rejectpage" v-sina-ads="stat.recommend.refuse.open">
          <mt-cell title="审核被拒" is-link @click.native="$root.openUrl(homeData.rejectpage)"></mt-cell>
      </div> -->


      <!-- 贷超 -->
      <credit-card className="loanRecommendation" class="section iframe-section" :style="``"
                   v-if="iframe_LoanRecommendation" :iframeUrl="iframe_LoanRecommendation"/>

      <!--征信查询-->
      <mt-swipe class="zxSearch" :auto="3000" :showIndicators="zhengxin.length>1" v-if="">
        <mt-swipe-item v-for="(v,i) in zhengxin" :key="i"  >
          <img :src="v.imgurl"  v-sina-ads="stat.recommend.refuse.clickBanner" @click="jump(v)" />
        </mt-swipe-item>
      </mt-swipe>

      <!--信用分期-->
      <credit-card className="credit" class="section iframe-section" :style=""
                   v-if="iframeUrl_creditStaging " :iframeUrl="iframeUrl_creditStaging"/>

      <kefu_people :onlineServiceUrl="onlineServiceUrl" :serverNum="serverNum"></kefu_people>
    </scroller>
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
  import creditStaging from "./components/creditStaging";
  import kefu_people from "./components/kefu_people";




  import AppBridge from "@/services/AppBridge.js";
  import MaxentSDK from "@/services/MaxentSDK";

  export default {
    data() {
      return {
        messageUrl:
        process.env.path + "/v1.1.0/king/pages/panda-larger-welfare/#/message", //消息中心
        helpUrl: process.env.path + "/v1.1.0/king/pages/panda-larger-welfare/#/feedback", //意见反馈
        repayUrl:
        process.env.path +
        "/v1.1.0/king/pages/panda-larger-welfare/#/recommend/repayList", //还款列表
        onlineServiceUrl: "",
        redIconShow: false,
        redIconCount: "0",
        isShowIframeUrl: util.getParams("isShowIframeUrl") || 0,
        pullDown: true,
        headerOpacity: 1,
        headerRgba: 1,
        activeHeight: "30vh",
        isShowRepayRed: false,
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
        zhengxin: [], // 征信
        iframeUrl_creditStaging: '', // 信用分期的iframe url
        serverNum: 0, // 服务人数
        iframe_LoanRecommendation: '', // 商业化资源位  贷款推荐iframe
        loanRecommendationHeight: 0, // 高度
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
      creditStaging,
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
          this.getLoanRecommendation()
          this.getmarketinfo();
          this.getServerNum()
          //this.getEntranceConfig();
          this.redData();
        } catch (error) {
          this.loadingClose();
        }
      },
      //还款列表点击
      handleRepayClick() {
        helper.set("isShowRepayRed", 1);
        this.isShowRepayRed = false;
        this.$root.openUrl({url: this.repayUrl, title: "还款列表"});
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
        let repayDate = []
        if (data.applyproducts) {
          let repayArray = [16, 17, 18, 19, 20, 21, 22, 25, 26, 27, 31];
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
          if (repayDate.length > 0) {
            repayDate.sort((a, b) => a - b); // 正序 这里应该是最近还款日  所以应该是最小的  下面取0
            this.homeData.repayDate = moment(Number(repayDate[0])).format("MM月DD日")
          }

          // data.applyproducts.forEach(item => {
          //   /*
          //                 if(item.status == 10) {
          //                     withdrawProducts.push(item)
          //                 }else if(repayArray.includes(item.status)){
          //                     repayProducts.push(item);
          //                 }else {
          //                     otherProducts.push(Object.assign({isOneProduct: true}, item));
          //                 }*/
          //   if (repayArray.includes(item.status)) {
          //     repayProducts.push(item);
          //   } else {
          //     withdrawProducts.push(Object.assign({isOneProduct: true}, item));
          //   }
          // });


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
      },
      // 获取信用分期的资源位
      getCreditStaging(){
        this.$api.activity.getApprovaling({pageid: 1027,mjbname: util.getParams('mjbname'),productId:2001}).then((res)=>{
          if (helper.isSuccess(res)) {
            console.log("getCreditStaging",res)
            let obj = res.data.pagedata.loanPageCredit.pagedata[0]
            this.iframeUrl_creditStaging = `${obj.thumbnailurl}?nextUrl=${obj.jumplink}`
            this.zhengxin =res.data.pagedata.loanPageBanner2.pagedata

          }
        })
      },
      // 获取服务人数
      getServerNum(){
        this.$AppBridge.getInitData({}, res => {
          if (res.code == "200") {
            this.serverNum = util.moneyFormat(Number(res.data.peoplenum)).replace('.00','')
          }
        });
      },

    },
    created() {
      this.init();
      this.getOnlineService();
      console.log(
        "isShowIframeUrl------------------------",
        this.isShowIframeUrl
      );
      EventBus.$on("postMessage", this.postMessageHandle);

      this.$AppBridge.getInitData({type: "pageaddress"}, res => {
        console.log("pageaddress", res);
        if (
          res.code == "200" &&
          res.data &&
          res.data.pageaddress &&
          res.data.pageaddress.length
        ) {
          let list = typeof res.data.pageaddress != "string" ? res.data.pageaddress : JSON.parse(res.data.pageaddress);
          list.map((item, index) => {
            if (item.type === "ONLINESERVICE" && item.showmodel === "2") {
              this.onlineServiceUrl = item.url;
              return;
            }
          });
        }
      });
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
      margin-top: 0px !important;
      position: absolute;
      .pull-refresh {
        background-color: transparent !important;
        height: 24px !important;
        padding: 0 !important;
        top: 20px !important;
      }
    }
    .c-view-content {
      background: #f7f7f7;
      transition: all 0.5s;
      margin-top: 45px;
      height: calc(100% - 45px);
      .repay-content {
        height: 50px;
        line-height: 50px;
        padding: 0 16px;
        background: #fff;
        border-bottom: 1px solid #F5F6FA;
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
    }

    .tobe-repay {
      /deep/ .mint-cell {
        background-color: #414651;
      }
      /deep/ .mint-cell-text {
        color: #fff;
      }
      /deep/ .mint-cell-value {
        color: #fff;
      }

      /deep/ .mint-cell-allow-right:after {
        margin: 0;
        border-top-color: #fff !important;
        border-right-color: #fff !important;
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
    background-color: rgba(65, 70, 81, 1);
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
    background: #fff;
    height: 24px;
  }

  .user-withdraw-detail {
    display: flex;
    justify-content: space-between;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #ffffff;
    padding: 16px 13px;
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

  .offline-wrap {
    img {
      width: 100%;
      display: block;
      margin: 0 auto;
    }
  }
</style>
