<template lang="html">
  <div class="home-page-detail view c-view">
    <div class="c-view-content">
      <div class="title">还款方式有哪些？</div>
        <div class="nav">
          <div class="left">时间：2019年4月10日</div>
        </div>
        <div class="content">
            <p>还款方式主要有等额本息法和等额本金法两种，等额本息法每月还款额一样，总支付利息多；等额本金法每月还款额递减，总支付利息少。那么选择何种还贷方式更划算呢？</p>
            <p>一、等额本息还款</p>
            <p>等额本息还款是将按揭贷款的本金总额与利息总额相加，然后平均分摊到还款期限的每个月中。等额<br>

            本息还款中借款人每月月供不变，还款额中的本金比重逐月递增、利息比重逐月递减。<br>

            因每月承担相同的款项，方便借款人安排收支。优点是借款人每个月还给银行固定还款金额，利息比重逐月递减。缺点是总体利息支出较多。适用人群主要为工作收入稳定的企、事业单位职员等。</p>
            <p>二、等额本金还款</p>
            <p>所谓等额本金还款又称利随本清、等本不等息还款法。放款方会将本金分摊到每个月内，借款方需要<br>

            支付本金的同时需付清上一交易日至本次还款日之间的利息。这种还款方式相对等额本息而言，总的利息支出较低，但是前期支付的本金和利息较多，还款负担逐月递减。<br>

            采用这种方式还款，借款人在刚开始还贷时，每月负担会较大些。但是随着还款时间的推移，还款负<br>

            担会逐渐减轻。优点是总体利息支出较低。缺点是前期还款负担较重，适用人群主要为收入较高人士，如企业高层、个体工商业者等。</p><br><br><br>
        </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import api from "@/services/api";
    import util from "@/utils";
    import helper from "@/utils/helper";
    import AppBridge from "@/services/AppBridge.js";

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
        AppBridge.activityView({
            type: "close"
        });
        AppBridge.notify({tag: 'refresh'})
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
