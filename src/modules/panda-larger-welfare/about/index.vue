<template lang="html">
  <div class="view c-bg-gray">
    <div class="introduce c-section">
      <div class="logo">
        <img src="../images/logo@2x.png">
      </div>
    </div>

    <p class="detail">
    公司核心团队由来自消费金融领域领先的传统金融机构及国内知名互联网企业，精英荟萃。在风险管理、科技研发、产品设计等金融核心领域拥有丰富的业务经验和扎实的专业能力。
    </p>
    <p class="detail">
    公司将严格遵守国家金融法律法规和监管政策，秉承“创新普惠金融，为您此刻好生活”的企业愿望，朝着“金融+互联网+大数据”的创新方向，以诚信、合规、稳健、创新的经营理念，致力于为普罗大众、小微企业提供有特色、优质便捷的金融服务。
    </p>

    <!--<div class="cell-list c-section">-->
      <!--<mt-cell title="版本信息">-->
        <!--V{{Version}}-->
      <!--</mt-cell>-->

      <!--<mt-cell title="官网网站" v-if="homeLink" @click.native="go" is-link v-sinaAds="adsInfo.about.about.clickGoWebsite">-->
        <!--<span class="blue">{{homeLink}}</span>-->
      <!--</mt-cell>-->
    <!--</div>-->


    <aboutCell class="doubleWei" :showVersion="true" :showPrivacy="false"></aboutCell>

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
        isShowHome: false, //官网是否显示
        homeLink: '',  //官网地址
        isShowWeibo: false,
        appVersion: util.getParams("appVersion"),
        code: util.getParams("verno"),
        testVersion: util.getParams("tc"),
        envVersion: util.getParams("et"),
        iosPass: util.getParams()["sinaifiosauditing"],
        channel: util.getParams()["channel"], //渠道  akingloan: 普金贷款
      };
    },
    computed: {
      Version(){
        let arr = []
        this.appVersion && arr.push(this.appVersion)
        this.code && arr.push(this.code)
        this.testVersion && arr.push(this.testVersion)
        this.envVersion && arr.push(this.envVersion)
        return arr.join('.')
      }
    },
    methods: {
        go() {
            if(this.homeLink){
                this.$root.openUrl({
                    url: this.homeLink,
                    title: this.appName
                });
            }
        },
    },
    created () {
        var isIOS = !!navigator.userAgent.match(
          /\(i[^;]+;( U;)? CPU.+Mac OS X/
        ); //ios终端
        this.isIOS = isIOS;

        /*
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
        */
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
      width: 258px;
      img {
        width: 100%;
      }
    }

  }
  .detail {
    font-size: $fontS;
    color: $gray;
    padding: 0 $gap $gap $gap;
    text-align: left;
    font-family: PingFangSC-Regular;
    letter-spacing: -0.31px;
    text-align: justify;
    text-indent: 28px;
    background: #fff;
}

  .blue {
    color: #5490cc;
  }
</style>
