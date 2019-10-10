<template>
  <div class="view c-view-gay">
      <c-header title="帮助中心">
          <mt-button slot="left" >
              <c-icon type="back"/>
          </mt-button>
      </c-header>

    <div class="c-layer">
      <div class="pull-down-bg" :style="{height: activeHeight}"></div>
    </div>

    <div class="c-view-content" v-min-height>
        <div class="m-tabs c-flex-row">
            <div class="c-col-25" @click="handleHotClick(1)">
                <img src="../../assets/images/zhxg.png" alt>
                <p>账户相关</p>
            </div>
            <div class="c-col-25" @click="handleHotClick(2)">
                <img src="../../assets/images/jkxg.png" alt>
                <p>借款相关</p>
            </div>
            <div class="c-col-25" @click="handleHotClick(3)">
                <img src="../../assets/images/zxxg.png" alt>
                <p>征信相关</p>
            </div>
            <div class="c-col-25" @click="handleHotClick(4)">
                <img src="../../assets/images/hkxg.png" alt>
                <p>还款相关</p>
            </div>
        </div>
      <div class="section-title">常见问题</div>
      <div class="m-question">
        <van-collapse v-model="activeNames">
          <van-collapse-item v-for="(item, i) in hostData" :key="i" :title="item.title" :name="i">
            <div v-html="item.content"></div>
          </van-collapse-item>
        </van-collapse>
      </div>

      <div class="m-space"></div>
    </div>
    <!--<div class="m-bottom c-flex-row c-v-center c-justify-between">-->
      <!--<span class="el-left c-col-50" @click="$root.openUrl(onlineServiceUrl);">-->
        <!--<img src="../../assets/images/kefu@2x.png">-->
        <!--<em>在线客服</em>-->
      <!--</span>-->
      <!--<span class="el-right c-col-50" @click="$root.openUrl(feedbackUrl);">-->
        <!--<img src="../../assets/images/help-feedback.png">-->
        <!--<em>意见反馈</em>-->
      <!--</span>-->
    <!--</div>-->
  </div>
</template>

<script>
import axios from "axios";
import api from "@/services/api";
import util from "@/utils";
import helper from "@/utils/helper";
import watermark from "../../components/watermark";

export default {
  name: "help",
  data() {
    return {
      messageUrl: process.env.staticPath + "/#/message", //消息中心
      onlineServiceUrl: "",
      feedbackUrl: "",
      activeHeight: "40vh",
      activeNames: [],
      hostData: [
        {
          id: 1,
          title: "逾期还款有什么危害？",
          content:
            "1.如果您未按时偿还产生逾期，该记录会上传到人行征信系统； <br>2.逾期需要支付按照合同约定产生的逾期费用；<br>3.影响再次申请其他的贷款产品。"
        },
        {
          id: 2,
          title: "如何还款？",
          content:
            "还款分为代扣和主动还款两种方式，如下： <br>1.代扣：您可以在“我的- 借款记录”中，查看本期应还金额及还款日期，并提前确保在还款日有足够金额在您绑定的换卡银行卡中，在还款日当天，系统会自动从您的还款银行卡中扣除当期应还金额； <br>2.主动还款：可以进入“我的-还款记录--代还款账单”中点击还款按钮，进行手动还款操作。"
        },
        {
          id: 3,
          title: "审核时间有多长？",
          content:
            "正常情况下一个工作日内会审核完毕，审核结果会及时已短信和APP站内信消息通知您。"
        },
        {
          id: 4,
          title: "额度会变动吗？",
          content:
            "在申请借款或重新提交申请时，熊猫信用将根据您的信用进行综合评估。若您的信用发生变化，将影响授信额度提升或下降。"
        },
        {
          id: 5,
          title: "如何提高借款申请通过率？",
          content:
            "1.保证您提交的信息真实准确；<br>2.根据要求完成更多授权项认证；<br>3.按时还款，没有逾期。"
        },
        {
          id: 7,
          title: "交易密码忘记怎么办？",
          content:
            "如果您忘记交易密码，请登录APP-我的-安全中心-修改交易密码，通过系统验证后，重置交易密码即可。"
        }
      ],
      typeData: [
        {
          type: 1,
          iconurl: require("../../assets/images/helptype1.png"),
          title: "借款申请"
        },
        {
          type: 2,
          iconurl: require("../../assets/images/helptype2.png"),
          title: "授信问题"
        },
        {
          type: 3,
          iconurl: require("../../assets/images/helptype3.png"),
          title: "账户管理"
        },
        {
          type: 4,
          iconurl: require("../../assets/images/helptype4.png"),
          title: "还款问题"
        }
      ],
      moreLink: process.env.staticPath + "/pages/panda-loan/#/news/more", //更多资讯
      detailLink: process.env.staticPath + "/pages/panda-loan/#/news/detail" //资讯详情
    };
  },
  components: {
    watermark
  },
  computed: {},
  methods: {
    //获取客服链接地址
    getServiceLink(item) {
      this.$AppBridge.getInitData({ type: "pageaddress" }, res => {
        console.log("pageaddress", res);

        if (
              res.code == "200" &&
              res.data &&
              res.data.pageaddress &&
              res.data.pageaddress.length
          ) {
              let list =
                  typeof res.data.pageaddress != "string"
                      ? res.data.pageaddress
                      : JSON.parse(res.data.pageaddress);
              list.map((item, index) => {
                  if (item.type == "ONLINESERVICE") {
                      this.onlineServiceUrl = item.url;
                      console.log("this.onlineServiceUrl", this.onlineServiceUrl);
                  }
                  if (item.type == "SUGGESTION") {
                      this.feedbackUrl = item.url;
                      console.log("this.feedbackUrl", this.feedbackUrl);
                  }
              });
          }
      });
    },
    handleHotClick(item) {
        let arr = ['账户相关','借款相关','征信相关','还款相关']
      this.$root.nextTitle =arr[item-1];
      this.$router.push({
        name: "help/detail",
        params: {
          id: item,
        }
      });
    },
    handleTypeClick(item) {
      this.$root.nextTitle = item.title;
      this.$router.push({
        name: "help/list",
        params: {
          type: item.type
        }
      });
    }
  },
  created() {
    this.getServiceLink();
    //this.getInfomationList();
  },
  mounted() {
    this.$root.loadingClose();
  },
  onRefresh(tag, data) {
    if (tag == "refresh") {
      //this.getInfomationList();
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .mint-header {
  background-color: #fff !important;
  border: 0;
}
.pull-down-bg {
  background-image: #fff;
  position: absolute;
  z-index: -1;
  width: 100%;
}
.header-layer {
  position: relative;
  z-index: 1;
}
.c-module {
  position: relative;
  padding: 0 16px;

  .mint-button {
    position: absolute;
    right: 16px;
    top: 2px;
    font-size: 12px;
    width: 44px;
    padding: 0;
    height: 24px;
  }
  .mint-button--primary.is-plain {
    border: 1px solid #999;
    background-color: transparent;
    color: #999;
  }
  & + .c-module {
    border-top: 8px solid #f8f8f8;
  }
  .title {
    margin-top: 12px;
    font-size: 20px;
    color: #333333;
  }
  .sub-title {
    margin-top: 2px;
    margin-bottom: 12px;
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
  }

  .c-flex-row {
    margin-left: -10px;
    margin-right: -10px;

    .c-flex-item {
      position: relative;
    }

    .title {
      position: absolute;
      top: 10px;
      left: 20px;
      color: #fff;
      font-size: 14px;
    }
  }
}
.m-question {
  .el-question-list {
    background: #ffffff;

    .el-question-item {
      position: relative;
      padding: 13px 0;
      margin-left: 16px;
      font-size: 16px;
      color: #444444;
      &:not(:last-child) {
        @extend %border-b;
      }
    }
  }

  /deep/ .van-cell__title {
    font-size: 16px;
    color: #1f2b5a;
  }
  /deep/ .van-collapse-item__content {
    font-size: 14px;
    color: #66668a;
  }
}

.section-title {
  font-size: 14px;
  color: #666666;
  border: 0 !important;
}

.news-list {
  @extend %border-t;
  padding: 10px 0;
  display: flex;
  align-items: center;

  .list-left {
    width: 75%;
    .list-title {
      font-size: 16px;
      color: #333;
      letter-spacing: 0.12px;
      padding: 5px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .list-time {
      font-size: 12px;
      color: #999;
      letter-spacing: 0.12px;
    }
  }
  .list-right {
    width: 25%;
    text-align: right;
    .list-img {
      display: inline-block;
      margin-top: 4px;
      width: 74px;
      height: 54px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
}

.header {
  //background: #FFFFFF;
  //box-shadow: 0 2px 4px 0 rgba(0,0,0,0.05);
}
.block-header {
  display: block;
  background: transparent;
  height: 68px;
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    height: 68px;
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
    height: 88px;
  }
}

.icon_b {
  width: 22px;
  height: 22px;
}
.m-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 13px 0;
  background: #ffffff;
  box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.06);
  width: 100%;
  img {
    width: 24px;
  }
  .el-left {
    width: 50%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #d1d1e6;

    em {
      margin-left: 4px;
    }
  }
  .el-right {
    width: 50%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    em {
      margin-left: 4px;
    }
  }
}
.m-tabs {
    height: 124px;
    display: flex;
    align-items: center;
  img {
    width: 40px;
  }
}
.m-space {
  height: 100px;
  width: 100%;
  display: block;
}
</style>
