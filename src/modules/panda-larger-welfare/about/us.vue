<template lang="html">
  <div class="view c-bg-gray">
    <div class="cell-list c-section">
      <mt-cell title="产品介绍" @click.native="go(descLink)" is-link >
        <span class="blue"></span>
      </mt-cell>
    </div>
<!--
    <div class="cell-list c-section">
      <mt-cell title="公司官网" @click.native="go(homeLink)" is-link >
        <span class="blue"></span>
      </mt-cell>
    </div> -->

    <div class="cell-list c-section">
      <mt-cell title="用户协议" @click.native="go(userLink)" is-link >
        <span class="blue"></span>
      </mt-cell>
    </div>

    <div class="cell-list c-section">
      <mt-cell title="隐私协议" @click.native="go(privateLink)" is-link >
        <span class="blue"></span>
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
                descLink: '', //产品介绍
                homeLink: '',  //官网地址
                userLink: '',  //用户协议
                privateLink: '',  //隐私协议
                appVersion: util.getParams("appVersion"),
                iosPass: util.getParams()["sinaifiosauditing"],
                channel: util.getParams()["channel"], //渠道  akingloan: 普金贷款
        };
    },
    computed: {},
    methods: {
        go(url) {
            if(url){
                this.$root.openUrl({
                    url: url,
                    title: this.appName
                });
            }
        },
    },
    created () {
        AppBridge.getInitData(res => {
            if(res && res.data.pageaddress) {

                res.data.pageaddress.forEach(item => {
                    if(item.type == 'ABORT'){
                        this.descLink = item.url
                    }
                    /*if(item.type == 'HOME'){
                        this.homeLink = item.url
                    }*/
                    if(item.type == 'USER_AGREEMENT'){
                        this.userLink = item.url
                    }
                    if(item.type == 'PRIVACY_AGREEMENT'){
                        this.privateLink = item.url
                    }
                });

                console.log('res.data.pageaddress', res.data.pageaddress)
                console.log('this.descLink', this.descLink)
                console.log('this.userLink', this.userLink)
                console.log('this.privateLink', this.privateLink)
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
    }
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
