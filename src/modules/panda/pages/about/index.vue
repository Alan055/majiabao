<template lang="html">
  <div class="view c-bg-gray">
    <div class="introduce c-section">
      <div class="logo">
        <img src="../../assets/images/logo@2x.png">
      </div>

      <p class="detail">
          APP产品结合普惠金融发展和互联网技术创新，致力于面向大众提供专业、快捷的服务，帮助客户解决资金难的问题。未来，{{appName2}}将秉承谷誉“普惠金融，服务人人” 的服务宗旨，以方便快捷，健康诚信为本，通过持续不断的产品创新，为客户提供安全可靠的服务，持续为客户创造价值。
      </p>
    </div>

    <div class="cell-list c-section">
      <mt-cell title="版本信息">
        V{{$root.appVersion()}}
      </mt-cell>

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
      homeLink: "", //官网地址
      isShowWeibo: false,
      appVersion: util.getParams("appVersion"),
      iosPass: util.getParams()["sinaifiosauditing"],
      channel: util.getParams()["channel"] //渠道  akingloan: 普金贷款
    };
  },
  computed: {},
  mixins: [require("../../mixins").default],
  methods: {
    go() {
      if (this.homeLink) {
        this.$root.openUrl({
          url: this.homeLink,
          title: this.appName
        });
      }
    }
  },
  created() {
    AppBridge.getInitData(res => {
      if (res && res.data.pageaddress) {
        let homeData = res.data.pageaddress.filter(item => {
          return item.type == "HOME";
        });
        if (homeData.length > 0) {
          this.isShowHome = homeData[0].url != "";
          this.homeLink = homeData[0].url;
        }

        let weibo = res.data.pageaddress.filter(item => {
          return item.type == "WEIBO";
        });
        if (weibo.length > 0) {
          this.isShowWeibo = weibo[0].url != "";
        }
      }
    });
  },
  mounted() {
    this.$root.loadingClose();
    console.log("appName", this.appName);
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
  padding-top: 30px;
  .logo {
    display: block;
    margin: 0 auto;
    width: 180px;
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
