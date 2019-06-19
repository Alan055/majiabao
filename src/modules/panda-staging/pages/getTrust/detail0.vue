<template lang="html">
  <div class="home-page-detail view c-view">
    <div class="c-view-content">
      <div class="title">借钱就找极速熊猫</div>
        <div class="nav">
          <div class="left">时间：2019年4月10日</div>
        </div>
        <div class="content">
            <p>极速熊猫是第三方贷款信息推荐服务平台，以“为用户提供触手可及的互联网金融服务”为宗旨，为有借贷需求的用户和贷款服务商搭建沟通的桥梁，致力于为用户提供便捷、高效、无抵押纯信用借款撮合服务，第一时间响应用户的资金需求。</p>
            <p>极速熊猫有何优点？</p>
            <p>一是息费透明。极速熊猫平台费用透明，严格遵守国家监管政策要求，无任何违法或不符合政策要求的利率及费用。并且，平台贷款是免费申请，无年费，无管理费！</p>
            <p>二是有安全保障。个人信息在平台中，会由加密算法全程加密，为隐私筑墙，杜绝任何形式的个人信息泄露。每次放款时，还需要审核密码等多项验证，而且款项只能放款到本人名下的银行卡，所以可以让人放心使用。</p>
            <p>三是专业快捷。无抵押贷款,无需抵押，免申请材料，无需上门，全线上超简流程，最快30分钟放款。</p>
            <br><br><br>
        </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import api from "@/services/api";
    import util from "@/utils";
    import helper from "@/utils/helper";
    ;

  export default {
    data() {
        return {
            detailId: util.getParams("id") || '',
            item: {
                title: '',
                source: '',
                releasetime: '',
                content: ''
            }
        }
    },

    methods: {
        getInfomationDetail() {
            if(!this.detailId) return
            api.mxk.getInformationDetails({
                id: this.detailId
            }).then(res => {
                if (!helper.isSuccess(res)) return;
                if(res.data){
                    this.item = res.data;
                }
            });
        }
    },
    created () {
        this.getInfomationDetail()
    },
    mounted () {

    },
    onBack() {
        this.$AppBridge.activityView({
            type: "close"
        });
        this.$AppBridge.notify({tag: 'refresh'})
    },
    filters: {
    }
  }
</script>

<style lang="scss" scoped>
.home-page-detail {

  .c-view-content {
    padding: 0 16px;
  }

  .title {
    font-family: PingFangSC-Medium;
    padding: 12px 16px;
    font-size: 18px;
    color: #333;
    letter-spacing: 0.12px;
    text-align: center;
  }

  .nav {
    display: flex;
    color: #999;
    padding: 16px 0;
    justify-content: space-between;
  }
  .content {
    color: #666;
    text-align: justify;
    line-height: 22px;
    letter-spacing: 1px;
  }
  .copyright-bottom {
    position: absolute;
    bottom: 24px;
    border-radius: 4px;
    padding: 0 16px;
    p {
        background: #F5F5F5;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        padding: 6px;
        color: #999999;
        letter-spacing: 0;
    }
  }
}

</style>
