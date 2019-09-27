<template lang="html">
  <div class="home-page-detail view c-view">
    <div class="c-view-content">
        <div class="m-question">
            <van-collapse v-model="activeNames">
                <van-collapse-item v-for="(item, i) in item" :key="i" :title="item.title" :name="i">
                    <div v-html="item.content"></div>
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from "@/services/api";
import util from "@/utils";
import helper from "@/utils/helper";
export default {
  data() {
    return {
      activeNames: [],
      item: [],
      data: [
        {
          id: 1,
          title: "如何注册账户？",
          content:
            "您通过APP进行注册，输入手机号码，点击获取手机验证码，验证码验证通过后，即注册成功！"
        },
        {
          id: 1,
          title: "交易密码忘记怎么办",
          content:
            "如果您忘记交易密码，请登录APP-我的-安全中心-修改交易密码，通过系统验证后，重置交易密码即可。"
        },
        {
          id: 1,
          title: "如何保证我的借款资金安全？",
          content:
            "您的借款资金仅会进入您指定的本人借记卡中。我们有严格的核身流程和风控体系，以确保您的资金安全。同时请务必保管好您的银行卡和卡密码。"
        },
        {
          id: 2,
          title: "银行卡可以绑定信用卡吗？",
          content: "不能使用信用卡，只能使用APP上所列示的支持绑定的银行借记卡"
        },
        {
          id: 2,
          title: "借款审核未通过能再次申请吗？",
          content:
            "过了借款等待期后您可以再次提交申请，系统会根据您提供的申请信息的完整性、准确性以及您的个人信用情况进行综合判断"
        },
        {
          id: 2,
          title: "贷款申请需要提供哪些资料？",
          content:
            "1、提交您的身份信息及填写一些基本信息即可申请贷款； <br>2.为提高审核的通过率，建议您根据资方要求进行京东、淘宝、运营商、公积金或社保的认证；认证越多，通过率越高。"
        },
        {
          id: 3,
          title: "如何提高借款申请通过率？",
          content:
            "1.保证您提交的信息真实准确；<br>2.根据要求完成更多授权项认证；<br>3.按时还款，没有逾期。"
        },
        {
          id: 3,
          title: "审核时间有多长？",
          content:
            "正常情况下一个工作日内会审核完毕，审核结果会及时已短信和APP站内信消息通知您。"
        },
        {
          id: 3,
          title: "为什么审核被拒？",
          content: "您的综合评分不足导致无法通过审核。"
        },
        {
          id: 4,
          title: "额度会变动吗？",
          content:
            "在申请借款或重新提交申请时，熊猫信用将根据您的信用进行综合评估。若您的信用发生变化，将影响授信额度提升或下降。"
        },
        {
          id: 4,
          title: "如何还款？",
          content:
            "还款分为代扣和主动还款两种方式，如下：<br> 1.代扣：您可以在“我的- 借款记录”中，查看本期应还金额及还款日期，并提前确保在还款日有足够金额在您绑定的换卡银行卡中，在还款日当天，系统会自动从您的还款银行卡中扣除当期应还金额；<br> 2.主动还款：可以进入“我的-还款记录--代还款账单”中点击还款按钮，进行手动还款操作。"
        },
        {
          id: 4,
          title: "逾期还款有什么危害？",
          content:
            "1.如果您未按时偿还产生逾期，该记录会上传到人行征信系统；<br> 2.逾期需要支付按照合同约定产生的逾期费用； <br>3.影响再次申请其他的贷款产品。"
        }
      ]
    };
  },
  mixins: [require("../../mixins").default],
  methods: {},
  activated() {
    this.$root.getRouteData().then(params => {
      console.log("params.id", params.id);
      this.item = this.data.filter(d => {
        return d.id == params.id;
      });

      console.log("this.item", this.item);
    });
  },
  mounted() {},
  onBack() {
    this.$AppBridge.activityView({
      type: "close"
    });
  },
  filters: {}
};
</script>

<style lang="scss" scoped>
.home-page-detail {
  padding-bottom: 82px;
  .c-view-content {
    //padding: 0 16px;
  }

  .title {
    padding: 12px 0;
    font-size: 18px;
    color: #444444;
    letter-spacing: 0.12px;
    text-align: left;
  }

  .nav {
    display: flex;
    color: #999;
    padding: 16px 0;
    justify-content: space-between;
  }
  .content {
    font-size: 14px;
    color: #797979;
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
      background: #f5f5f5;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      padding: 6px;
      color: #999999;
      letter-spacing: 0;
    }
  }
}
</style>
