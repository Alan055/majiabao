<template lang="html">
  <div class="view c-bg-gray">
    <div class="introduce c-section">
      <div class="logo">
        <img src="../images/about-logo.png" alt="">
      </div>

      <p class="detail">
        “极速熊猫”是惠义旗下的贷款服务产品。产品结合普惠金融发展和互联网技术创新，致力于面向大众提供专业、快捷的服务，帮助客户解决资金难的问题。未来，闪光贷将秉承谷誉“普惠金融，服务人人” 的服务宗旨，以方便快捷，健康诚信为本，通过持续不断的产品创新，为客户提供安全可靠的服务，持续为客户创造价值</p>
    </div>

    <div class="cell-list c-section">
      <mt-cell title="版本信息">
        v{{appVersion}}
      </mt-cell>
      <mt-cell title="免责声明" @click.native="clickGoAgreements" is-link v-sinaAds="adsInfo.about.about.clickGoAgreements"></mt-cell>

      <mt-cell title="官网网站" @click.native="go" is-link v-sinaAds="adsInfo.about.about.clickGoWebsite">
        <span class="blue">www.huiyidaikuan.com</span>
      </mt-cell>

    </div>
  </div>
</template>

<script>
  import util from "@/utils";
  import helper from "@/utils/helper";

  export default {
    data() {
      return {
        appVersion: util.getParams("appVersion"),
        iosPass: util.getParams()["sinaifiosauditing"],
        channel: util.getParams()["channel"], //渠道  akingloan: 普金贷款
      };
    },
    computed: {},
    methods: {
      go() {
        this.$root.openUrl({
          url: "http://www.huiyidaikuan.com",
          title: "极速熊猫"
        });
      },

      clickGoAgreements() {
        this.$root.openUrl({
          url: `${process.env.path}/pages/huiyi/#/agreements/disclaimer`,
          title: "免责声明"
        });
      },
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
