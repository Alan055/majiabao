<template lang="html">
  <div class="view c-bg-gray">
    <c-header title="关于我们">
      <mt-button slot="left">
        <c-icon type="back"/>
      </mt-button>
    </c-header>

    <div class="introduce c-section">
      <div class="logo">
        <img src="../../assets/images/logo_prod@2x.png">
      </div>
    </div>

    <div class="cell-list c-section">
      <mt-cell title="版本号">
        v{{appVersion}}
      </mt-cell>
      <mt-cell title="公司简介"  is-link @click.native="goCompany()">
        <!--$root.openUrl({url:'/'});">-->
      </mt-cell>
      <mt-cell title="隐私协议" v-if="disclaimerLink" @click.native="go" is-link>
        <!--<span class="blue">{{disclaimerLink}}</span>-->
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
      },
      goCompany(){
        this.$root.openUrl( process.env.staticPath + "/panda-credit/#/companyProfile");
      },
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
    padding: 18px 0;
    .logo {
      display: block;
      margin: 0 auto;
      padding-bottom: 20px;
      text-align: center;
      img {
        width: 200px;
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
  .cell-list{
    background: transparent;
    a{
      margin-bottom: 8px;
    }
  }

  .blue {
    color: #5490cc;
  }
</style>
