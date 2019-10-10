<template lang="html">
  <div class="home-page-detail view c-view">
    <div class="c-view-content">
      <div class="title">什么是征信？</div>
        <div class="nav">
          <div class="left">时间：2019年4月10日</div>
        </div>
        <div class="content">
            <p>简单来说，征信就是专业化的、独立的第三方机构为您建立信用档案，依法采集、客观记录您的信用信息，并依法对外提供您的信用报告的一种活动。征信记录了您过去的信用行为，这些行为将影响您未来的经济活动。经济和社会越发展，征信与个人的关系就越密切。</p>
            <b>为什么要征信？</b>
            <p>征信是为适应现代经济的需要而发展起来的，它可以方便您在更大的范围内从事经济金融交易，它在帮助每个人积累信用财富的同时，也激励每个人养成守信履约的行为习惯，整个社会的信用环境也会因此得到改善。<br>
            <b>个人信用报告</b>
            <p>个人信用报告是征信机构出具的记录您过去信用信息的文件，是个人的“经济身份证”，它可以帮助您的交易伙伴了解您的信用状况，方便您达成经济金融交易。</p>
            <b>如何拥有良好的个人信用记录？</b>
            <p>第一，尽早建立个人信用记录。简单的方法就是与银行发生借贷关系，例如可以向银行申请信用卡或申请贷款。这里要澄清的一个概念是：不借钱不等于信用就好。因为没有借贷关系，银行就失去了一个判断您信用风险的便捷方法。<br>
                第二，努力保持良好的信用记录。关键是要树立诚实守信的观念，及时归还贷款及信用卡透支款项,按时交纳各种费用,避免较长时间的拖欠。否则，不良行为就会如实反映在信用记录中，对个人信用形成不良影响。<br>
                第三，关心自己的信用记录。由于一些无法避免的原因，信用报告中的信息可能会出现错误。一旦发现自己的个人信用记录内容有错误，应尽快联系提供信用报告的机构，及时纠正错误信息，以免使自己受到不利的影响。</p><br><br><br>
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
