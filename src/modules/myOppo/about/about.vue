<template lang="html">
  <div class="view c-bg-gray">
    <div class="introduce c-section">
      <div class="logo">

        <img v-if="channel=='akingloan'" src="~@/assets/images/my/about/logo-notext-pj.png" alt="">
        <img v-else-if="channel=='kingydk'" src="~@/assets/images/my/about/logo-notext-kingydk.png" alt="">

        <img v-else src="~@/assets/images/my/about/logo-notext.png" alt="">
      </div>

      <p class="detail">
          {{appName}}是一款由中盟盛世投资控股（深圳）有限公司提供综合贷款服务的平台型APP，专注于解决用户借款难的问题。{{appName}}不提供贷款资金，仅依托大数据分析、人工智能和机器学习技术，根据用户资质，为用户匹配合适的贷款产品，以轻松实现用户借款需求！</p>
    </div>

    <div class="cell-list c-section">
      <mt-cell title="版本信息">
        v{{appVersion}}
      </mt-cell>
      <!-- <mt-cell v-if='!iosPass' title="官网网站" @click.native="go" is-link v-sinaAds="adsInfo.about.about.clickGoWebsite">
         <span class="blue">www.sinawallent.com</span>
       </mt-cell>

       <mt-cell v-if='!iosPass' title="关注微博" @click.native="weibo" is-link v-sinaAds="adsInfo.about.about.clickGoWeibosite">
       </mt-cell>-->

      <mt-cell v-if="channel!='akingloan' && channel !='kingydk' && isShowHome" title="官网网站" @click.native="go" is-link v-sinaAds="adsInfo.about.about.clickGoWebsite">
        <span class="blue">{{homeLink}}</span>
      </mt-cell>

      <mt-cell v-if="false" title="关注微博" @click.native="weibo" is-link
               v-sinaAds="adsInfo.about.about.clickGoWeibosite">
        <span class="blue">weibo.com/6918855300</span>
      </mt-cell>

      <!--
        20190321 隐藏   需求=>>>极速熊猫app内容调整
        <mt-cell v-if="channel !='akingloan' && channel !='kingydk' && isShowWeibo" title="关注微博" @click.native="weibo" is-link
               v-sinaAds="adsInfo.about.about.clickGoWeibosite">
        <span class="blue">weibo.com/6918855300</span>
      </mt-cell> -->
    </div>

    <div v-if="channel =='akingloan'" class="copy">
      <p>版权归属 &copy; 陕西普金投资管理有限公司</p>
    </div>

  </div>
</template>

<script>
  import util from "@/utils";
  import helper from "@/utils/helper";
  import AppBridge from "@/services/AppBridge.js";

  export default {
    data() {
      return {
        isShowHome: false, //官网是否显示
        homeLink: '',  //官网地址
        isShowWeibo: false,
        appVersion: util.getParams("appVersion"),
        iosPass: util.getParams()["sinaifiosauditing"],
        channel: util.getParams()["channel"], //渠道  akingloan: 普金贷款
      };
    },
    computed: {},
    methods: {
        go() {
            if(this.homeLink){
                this.$root.openUrl({
                    url: this.homeLink,
                    title: this.appName
                });
            }
        },

        weibo() {

            this.$root.openUrl({
            url: "https://weibo.com/6918855300",
            title: "新浪微博"
            });
        },
        /*weibo(){
            AppBridge.launchApp({
            scheme: "sinaweibo://splash"
            }, res => {
            if(res && res.data.status != 'true'){
                Toast('请安装微博后重新尝试')
            }
            });
        }*/
    },
    created () {
        AppBridge.getInitData(res => {
            if(res && res.data.pageaddress) {
                let homeData = res.data.pageaddress.filter((item) => {
                    return item.type == 'HOME'
                })
                if(homeData.length > 0) {
                    this.isShowHome = homeData[0].url != ''
                    this.homeLink = homeData[0].url;
                }

                let weibo = res.data.pageaddress.filter((item) => {
                    return item.type == 'WEIBO'
                })
                if(weibo.length > 0) {
                    this.isShowWeibo = weibo[0].url != ''
                }

            }
        })
    },
    mounted() {
        this.$root.loadingClose();
    }
  };
</script>

<style lang="scss" scoped>
  .copy{
    position: fixed;  bottom: 10px;  padding: 5px 0; width: 100%;
    p{
      text-align: center;
    }
  }

  .introduce {
    padding-top: 30px;
    .logo {
      display: block;
      margin: 0 auto;
      width: 84px;
      img {
        width: 100%;
      }
    }
    .detail {
      font-size: $fontS;
      color: $gray;
      padding: $gap;
      text-align: left;
    }
  }

  .blue {
    color: #5490cc;
  }
</style>
