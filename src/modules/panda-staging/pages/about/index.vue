<template lang="html">
  <div class="view c-bg-gray">
    <div class="introduce c-section">
      <div class="logo">
        <img src="../../assets/images/logo_prod@2x.png">
        <p>{{appName2}}</p>
      </div>

      <p class="detail">
          APP产品结合普惠金融发展和互联网技术创新，致力于面向大众提供专业、快捷的服务，帮助客户解决资金难的问题。未来，{{appName2}}将秉承谷誉“普惠金融，服务人人” 的服务宗旨，以方便快捷，健康诚信为本，通过持续不断的产品创新，为客户提供安全可靠的服务，持续为客户创造价值。
      </p>

    </div>
    <aboutCell :showPrivacy="false" :showVersion="true"></aboutCell>
  </div>
</template>

<script>
  import util from "@/utils";
  import helper from "@/utils/helper";
  import aboutCell from "@/components/common/aboutCell.vue";



  export default {
    data() {
      return {
        iosPass: util.getParams()["sinaifiosauditing"],
        channel: util.getParams()["channel"] //渠道  akingloan: 普金贷款
      };
    },
    computed: {},
    components: {aboutCell},
    mixins: [require("../../mixins").default],
    methods: {
    },
    created() {

    },
    mounted() {
      this.$root.loadingClose();
    }
  };
</script>

<style lang="scss" scoped>
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
    padding: 30px 0;
    .logo {
      display: block;
      margin: 0 auto;
      padding-bottom: 20px;
      text-align: center;
      img {
        width: 88px;
      }
      p {
        font-size: 16px;
        color: #1f2b5a;
        margin-top: 10px;
      }
    }
    .detail {
      font-size: $fontS;
      color: $gray;
      padding: 0 $gap;
      text-align: left;
      text-indent: 24px;
    }
  }

  .blue {
    color: #5490cc;
  }
</style>
