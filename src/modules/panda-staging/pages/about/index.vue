<template lang="html">
  <div class="view c-bg-gray">
    <div class="introduce c-section">
      <div class="logo">
        <img src="../../assets/images/logo_prod@2x.png">
        <p>{{appName2}}</p>
      </div>

      <p class="detail">
          公司是全国领先的金融科技以及数据资讯产品的平台，秉承深厚的技术服务，金融行业研究，独立自主的专业能力，致力于面向全国各行各业，企业，个人提供领先的产品与解决方案以及专业优质的服务。
      </p>
      <p class="detail">
          秉承“科技改变生活”的经营理念，以成为全国一流的企业为使命，立志成为受人尊敬的，技术领先的，服务最优秀的领航者。改变个人，企业生活现状，并为社会带来价值。
      </p>

    </div>

    <div class="cell-list c-section">
        <mt-cell title="版本号">
        v{{appVersion}}
      </mt-cell>
      <mt-cell title="隐私协议" v-if="disclaimerLink" @click.native="go" is-link >
        <span class="blue">{{disclaimerLink}}</span>
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
      isShowdisclaimer: false, //官网是否显示
      disclaimerLink: "", //官网地址
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
      if (this.disclaimerLink) {
        this.$root.openUrl({
          url: this.disclaimerLink,
          title: this.appName
        });
      }
    }
  },
  created() {
    this.$AppBridge.getInitData(res => {
      if (res && res.data.pageaddress) {
        let disclaimerData = res.data.pageaddress.filter(item => {
          return item.type == "disclaimer";
        });
        if (disclaimerData.length > 0) {
          this.isShowdisclaimer = disclaimerData[0].url != "";
          this.disclaimerLink = disclaimerData[0].url;
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
