<template lang="html">
  <div class="view c-bg-gray">
    <div class="cell-list c-section">
      <mt-cell title="产品介绍" @click.native="go(descLink)" is-link>
        <span class="blue"></span>
      </mt-cell>
    </div>

    <div class="cell-list c-section">
      <mt-cell title="去好评" @click.native="goGood" is-link>
        <span class="blue"></span>
      </mt-cell>
    </div>

    <aboutCell class="doubleWei" :showPrivacy="showPrivacy"></aboutCell>

  </div>
</template>

<script>
  import util from "@/utils";
  import helper from "@/utils/helper";
  import AppBridge from "@/services/AppBridge.js";
  import aboutCell from "@/components/common/aboutCell.vue";

  export default {
    components: {aboutCell},
    data() {
      return {
        descLink: '', //产品介绍
        homeLink: '',  //官网地址
        appVersion: util.getParams("appVersion"),
        iosPass: util.getParams()["sinaifiosauditing"],
        channel: util.getParams()["channel"], //渠道  akingloan: 普金贷款
      };
    },
    computed: {
      showPrivacy(){
        return util.getParams('mjbname') == 'suppanda'
      }
    },
    methods: {
      goGood() {
        this.sinaAds.click(this.adsInfo.about.index.clickGoMarket);
        AppBridge.goMarket();
      },
      go(url) {
        if (url) {
          this.$root.openUrl({
            url: url,
            title: this.appName
          });
        }
      },
    },
    created() {
      this.$AppBridge.getInitData(res => {
        if (res && res.data.pageaddress) {

          res.data.pageaddress.forEach(item => {
            if (item.type == 'US') {
              this.descLink = item.url
            }
            /*if(item.type == 'HOME'){
                this.homeLink = item.url
            }*/

          });


          console.log('res.data.pageaddress', res.data.pageaddress)
          console.log('this.descLink', this.descLink)
        }
      })
    },
    mounted() {
      this.$root.loadingClose();
    }
  };
</script>

<style lang="scss" scoped>
  .view {
    padding-top: 8px;
    /deep/ .doubleWei {
      background: transparent;
      .mint-cell{
        margin-bottom: 8px;
        .mint-cell-wrapper{
          border: none;
        }
      }
    }
  }
  .copy {
    position: fixed;
    bottom: 10px;
    padding: 5px 0;
    width: 100%;
    p {
      text-align: center;
    }
  }
  .introduce {
    padding-top: 30px;
    .logo {
      display: block;
      margin: 0 auto;
      width: 258px;
      img {
        width: 100%;
      }
    }

  }
  .detail {
    font-size: $fontS;
    color: $gray;
    padding: $gap;
    text-align: left;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    letter-spacing: -0.31px;
    text-align: justify;
  }
  .blue {
    color: #5490cc;
  }
</style>
