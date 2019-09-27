<template lang="html">
  <div class="home-page-detail view c-view">
    <div class="c-view-content" v-if="item">
      <div class="new">
        <div class="title">{{item.title}}</div>
        <div class="nav">
          <div class="left">时间：{{item.createtime}}</div>
          <!-- <div class="right">阅读：{{item.through > 100000 ? '10万+' : item.through}}人</div> -->
        </div>
        <div class="content" v-html="item.content"></div>
      </div>
      <div class="wonderfulRecommendation box" v-if="zhengxin.length">
        <div class="top"><span>精彩推荐</span></div>
        <!--<div class="content1"><img src="./../images/zxBanner.png" alt="" @click="$root.openUrl({url: zhengxinURL, title: '征信查询'})"></div>-->
        <mt-swipe class="zxSearch" :auto="3000" :showIndicators="zhengxin.length>1" >
          <mt-swipe-item v-for="(v,i) in zhengxin" :key="i"  >
            <img :src="v.imgurl"  v-sina-ads="stat.recommend.refuse.clickBanner" @click="jump(v)" />
          </mt-swipe-item>
        </mt-swipe>


      </div>
      <div class="wonderfulRecommendation box" v-if="iframeUrl" >
          <credit-card class="section iframe-section" :style="`height: ${creditCardHeight};`" :iframeUrl="iframeUrl" />
      </div>

    </div>
    <!--<div class="copyright-bottom">-->
    <!--<p>【版权声明】本文为网络转载文章，若有权属异议请联系我们删稿。您可以通过“{{appName2}}-在线客服”与我们取得联系。</p>-->
    <!--</div>-->


  </div>
</template>

<script>
  import axios from "axios";
  import api from "@/services/api";
  import util from "@/utils";
  import helper from "@/utils/helper";
  import EventBus from "@/services/EventBus";
  import storage from "@/utils/storage";
  import creditCard from "@/components/view/cMarket";

  export default {
    components: {creditCard },
    data() {
      return {
        detailId: util.getParams("id") || "", // 资讯详情的id
        item: {}, // 资讯详情
        iframeUrl: '', // iframe链接  贷超的链接
        creditCardHeight: '', // iframe高度
        zhengxin: '', // 征信查询
      }
    },
    mixins: [require("../mixins").default],
    methods: {
      findData() {
        // 获取资讯详情的数据
        this.$api.pandaNews.getInformationInfo({informationid: util.getParams("id")||''}).then((res) => {
          if (res.code == 200) {
            this.item = res.data
          }
        })
      },
      // 获取资源位
      getCreditStaging(){
        this.$api.activity.getApprovaling({pageid: 1027,mjbname: util.getParams('mjbname'),productId: 2001}).then((res)=>{
          if (helper.isSuccess(res)) {
            console.log("getCreditStaging",res)
            this.zhengxin =res.data.pagedata.loanPageBanner2.pagedata
          }
        })
      },

      //获取贷超地址
      getmarketinfo() {
        return new Promise((resolve, reject) => {
          api.activity.getAppMarketInfo({
              pageid: "1027",
              token: util.getParams("token") || storage.get("token") || ""
            }).then(res => {
              if (res.code == 200 && res.data) {
                console.log(res)
                this.iframeUrl = res.data.jumplink;
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
      jump(v){
        if (v.jumptype == 1) { // h5内置打开
          this.$root.openUrl(v.jumplink)
        } else if (v.jumptype == 2) {
          this.$AppBridge.activityView({
            type: "open",
            url: v.jumplink,
            isFull: false,
            open_inner: false,
          });
        }
      },


      init() {
        this.findData()
        this.getmarketinfo() //获取贷超地址
        this.getCreditStaging() // 获取资源位

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
          }
        });
      }
    },
    created() {
      this.init()
    },
    mounted() {
    },
    onBack() {
      this.$AppBridge.activityView({
        type: "close"
      });
    },
    filters: {}
  };
</script>

<style type="text/css">

  div.content p {
    line-height: 1.5 !important;
    font-family: Helvetica, Arial, sans-serif !important;
    color: #666 !important;

  }

  div.content p a {
    color: #666 !important;
  }

  div.news-1004-img img {
    width: 100%;
    display: block;
    margin: 10px auto;
  }

  p a {
    color: #4586EE;
  }
</style>
<style lang="scss" scoped>
  *{
    box-sizing: border-box;
  }
  .header-layer {
    position: relative;
    z-index: 1;
  }
  .home-page-detail {
    background: #f7f7f7;
    .c-view-content {
      overflow-x: hidden;
      .new{
        padding: 0 16px;
        background: #fff;
        img {
          width: 100%;
        }
        .title {
          font-family: PingFangSC-Medium;
          padding: 12px 0px;
          font-size: 18px;
          color: #333;
          letter-spacing: 0.12px;
          text-align: left;
        }
        .nav {
          display: flex;
          color: #999;
          padding: 16px 0;
          justify-content: space-between;
        }
        .content {
          color: #666;
          text-align: justify;
          line-height: 22px;
          letter-spacing: 1px;
        }
        .copyright-bottom {
          position: absolute;
          bottom: 24px;
          border-radius: 4px;
          padding: 0 16px;
          p {
            background: #f5f5f5;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            padding: 6px;
            color: #999999;
            letter-spacing: 0;
          }
        }
      }
      .box{
        padding: 0 16px;
        padding-bottom: 16px;
        margin-top: 8px;
        background: #fff;
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
        .top{
          height: 62px;
          display: flex;
          justify-content: left;
          align-items: center;
          font-size: 18px;
          color: #353241;
        }
        img {
          width: 100%;
          height: 110px;
        }
      }
    }


  }


</style>
