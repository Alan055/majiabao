<template lang="html">
  <div class="view c-bg-gray">
    <div class="introduce c-section">
      <div class="logo">
        <img src="../images/logo_prod2@2x.png">
      </div>

      <p class="detail">
        {{appName2}}属{{mjbCompanyName}}旗下产品。公司核心团队由来自消费金融领域领先的传统金融机构及国内知名互联网企业，精英荟萃。在风险管理、科技研发、产品设计等金融核心领域拥有丰富的业务经验和扎实的专业能力。公司将严格遵守国家金融法律法规和监管政策，秉承“创新普惠金融，为您此刻好生活”的企业愿望，朝着“金融+互联网+大数据”的创新方向，以诚信、合规、稳健、创新的经营理念，致力于为普罗大众、小微企业提供有特色、优质便捷的金融服务。
      </p>


    </div>

    <div class="cell-list c-section">
<!--

      <mt-cell title="官网网站" v-if="homeLink" @click.native="go" is-link v-sinaAds="adsInfo.about.about.clickGoWebsite">
        <span class="blue">{{homeLink}}</span>
      </mt-cell> -->
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
  mixins: [require("../mixins").default],
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
    width: 88px;
    img {
      width: 100%;
    }
  }
  .detail {
    font-size: $fontS;
    color: $gray;
    padding: $gap;
    text-align: left;
    text-indent: 28px;
  }
}

.blue {
  color: #5490cc;
}
</style>
