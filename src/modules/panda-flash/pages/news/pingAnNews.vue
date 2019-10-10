<template>
  <div class="view c-view-gay">
    <div class="c-layer">
      <div class="pull-down-bg" :style='{height: activeHeight}'></div>
    </div>

    <div class="c-layer header-layer">
      <c-header ref="transparentHeader" class="header transparent"
                :style="`background: rgba(255, 255, 255, ${headerRgba}); color: black;`" title="发现" :show="true">
                <span slot="right" v-sina-ads='stat.recommend.message.mess'
                      @click="$root.openUrl(messageUrl);redIcon=false;" class="posi-r">
                        <mt-button><img class="c-icon icon_a" src="~@/assets/images/my/home/an_ao@2x.png"/></mt-button>
                </span>
      </c-header>
    </div>

    <div class="c-view-content">
      <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div>
      <div class="c-module" v-if="bannerData.list.length > 0">
        <div class="title">{{bannerData.title}}</div>
        <div class="sub-title">{{bannerData.subTitle}}</div>
        <!-- <mt-button class="btn-round handle-button"
            size="normal"
            type="primary"
            plain
            @click.native="handleGotoMore"
        >更多</mt-button> -->
        <div class="c-flex-row">
          <div class="c-flex-item el-banner-item" @click="handleInfoClick(item, i)"
               v-for="(item, i) in bannerData.list">
            <img class="c-full-img" :src="item.imgurl"/>
            <p class="title">{{item.icontext}}</p>
            <p class="sub-title">{{item.floattext}}</p>
          </div>
        </div>
      </div>

      <!-- 贷超 -->
      <credit-card class="section iframe-section" :style="`height: ${creditCardHeight};`"
                   v-if="iframeUrl && isShowIframeUrl == 1" :iframeUrl="iframeUrl"/>

      <div class="c-module">
        <div class="title">行业资讯</div>
        <div class="sub-title">精选资讯，洞悉行业动态</div>
        <div class="news-list" @click="handleInfoClick(item)" v-for="(item, i) in informationData.infoList" :key="i">
          <div class="list-left">
            <div class="list-title">{{item.title}}</div>
            <div class="list-time">{{item.createtime.substr(0,10)}}</div>
          </div>
          <div class="list-right">
            <div class="list-img" :style="`background-image: url(${item.iconurl})`"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import api from "@/services/api";
  import util from "@/utils";
  import helper from "@/utils/helper";
  import creditCard from "@/components/view/cMarket";
  import EventBus from "@/services/EventBus";
  import AppBridge from "@/services/AppBridge.js";

  export default {
    name: "nopass",
    data() {
      return {
        activeHeight: '40vh',
        token: util.getParams("token") || '',
        headerRgba: 1,
        active: 0,
        bannerData: {
          title: '',
          subTitle: '',
          list: [{
            keyword: '',
            title: '',
            link: ''
          }]
        },
        informationData: {
          topInfo: [],
          infoList: [],
        },
        moreLink: process.env.kingPath + "/pages/panda-flash/#/news/more", //更多资讯
        detailLink: process.env.kingPath + "/pages/panda-flash/#/news/detail", //资讯详情
        isShowIframeUrl: !!util.getParams("token"),
        iframeUrl: "", //商业化地址
        creditCardHeight: "0" //商业地址高度
      };
    },
    computed: {},
    components: {
      creditCard
    },
    methods: {
      handleGotoMore() {
        this.$root.openUrl({
          url: this.moreLink,
          title: '更多资讯'
        })
      },
      //获取贷超地址
      getmarketinfo() {
        return new Promise((resolve, reject) => {
          api.activity
                  .getAppMarketInfo({
                    pageid: "1002",
                    token: this.token
                  })
                  .then(res => {
                    if (res.code == 200 && res.data) {
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
            }, 1000);
          });
        }
      },
      getInfomationList() {
        api.mxk.getInfomationList({
          toptype: 4,
          type: 5
        }).then(res => {
          if (!helper.isSuccess(res)) return;
          if (res.data) {
            console.log('res.data', res.data)
            this.informationData.topInfo = res.data.topInfo;
            this.informationData.infoList = res.data.infoList;
          }
        });
      },
      getApprovaling() {
        api.activity
                .getApprovaling({
                  pageid: "1028",
                  productId: util.getParams()["productid"] || "2001"
                })
                .then(res => {
                  if (res.code == 200) {
                    if (res.data && res.data.pagedata) {
                      if (res.data.pagedata.findPageTitle.pageid == '1028001') {
                        this.bannerData.title = res.data.pagedata.findPageTitle.pagedata[0].icontext;
                        this.bannerData.subTitle = res.data.pagedata.findPageTitle.pagedata[0].floattext;
                      }
                      if (res.data.pagedata.findPageTitle.pageid == '1028001') {
                        this.bannerData.list = res.data.pagedata.findPageBanner.pagedata;
                        console.log('this.bannerData.list', this.bannerData.list)
                      }

                    }
                  }
                });
      },
      handleInfoClick(item, i) {
        let url = item.detailLink;
        console.log('item', item)
        if(item.openlink && item.openlink.includes('XM=0')){
          this.$root.openUrl({
            type: "open",
            url: item.openlink,
            isFull: false,
            open_inner: true,
          });
          return
        }
        if (i == 0) {
          this.sinaAds.click({
            currEvent: this.adsInfo.news.index.clickArea1
          });
          url = item.jumplink;
        } else if (i == 1) {
          this.sinaAds.click({
            currEvent: this.adsInfo.news.index.clickArea2
          });
          url = item.jumplink;
          //url = 'https://m.tianxiaxinyong.cn/cooperation/common/guanjia.html?txxychannel=alN2bTVlYndHbmVHakZQbWZVTzRBdz09&hsinaif=third';
        } else {
          url = this.detailLink + '?id=' + item.id;
        }
        console.log('item2', item)
        this.$root.openUrl({
          url: url,
          title: item.floattext || '详情'
        })
      }
    },
    created() {
      EventBus.$on("postMessage", this.postMessageHandle);
      this.getApprovaling();
      this.getInfomationList();
      if (this.token) {
        this.getmarketinfo();
      }
    },
    destroyed() {
      EventBus.$off("postMessage");
    },
    mounted() {
      this.$root.loadingClose();
    },
    onRefresh(tag, data) {
      console.log('tag ====>>>>>>>>', tag)
      if (tag == "2") {
        AppBridge.getUserInfo(res => {
          if (res && res.data && res.data.token) {
            if (res.data.token != this.token) {
              this.token = res.data.token;
              console.log("收到tag2通知了!,token是", this.token);
              this.isShowIframeUrl = true;
              this.getmarketinfo();
            }
          } else {
            this.iframeUrl = ''
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  .pull-down-bg {
    background-image: #fff;
    position: absolute;
    z-index: -1;
    width: 100%;
  }

  .header-layer {
    position: relative;
    z-index: 1;
  }

  .c-module {
    position: relative;
    padding: 0 16px;

    .mint-button {
      position: absolute;
      right: 16px;
      top: 2px;
      font-size: 12px;
      width: 44px;
      padding: 0;
      height: 24px;
    }
    .mint-button--primary.is-plain {
      border: 1px solid #999;
      background-color: transparent;
      color: #999;
    }
    & + .c-module {
      border-top: 8px solid #f8f8f8;
    }
    .title {
      margin-top: 12px;
      font-size: 20px;
      color: #333333;
    }
    .sub-title {
      margin-top: 2px;
      margin-bottom: 12px;
      font-size: 12px;
      color: #999999;
      letter-spacing: 0;
    }

    .c-flex-row {
      margin-left: -10px;
      margin-right: -10px;

      .c-flex-item {
        position: relative;
      }
      .el-banner-item {
        //min-height: 40px;
      }

      .title {
        position: absolute;
        top: 10px;
        left: 20px;
        color: #fff;
        font-size: 14px;
      }
      .sub-title {
        position: absolute;
        bottom: 20px;
        left: 20px;
        color: #fff;
        font-size: 14px;
      }
    }

  }

  .news-list {
    @extend %border-t;
    padding: 10px 0;
    display: flex;
    align-items: center;

    .list-left {
      width: 75%;
      .list-title {
        font-size: 16px;
        color: #333;
        letter-spacing: 0.12px;
        padding: 5px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .list-time {
        font-size: 12px;
        color: #999;
        letter-spacing: 0.12px;
      }
    }
    .list-right {
      width: 25%;
      text-align: right;
      .list-img {
        display: inline-block;
        margin-top: 4px;
        width: 74px;
        height: 54px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .header {
    background: #FFFFFF;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  }

  .block-header {
    display: block;
    background: transparent;
    height: 68px;
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
      height: 68px;
    }
    @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
      height: 88px;
    }
  }

</style>
