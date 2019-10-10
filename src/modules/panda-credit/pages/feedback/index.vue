<template lang="html">
  <div class="view c-view">

    <!--格子-->
    <div class="grid">
      <!--格子主体-->
      <div class="grid-content c-bg-white">
        <!--富文本输入框-->
        <div class="input text">
          <textarea class="c-font-m"
                    placeholder="请写下你的宝贝意见或建议~"
                    v-model="str"
                    v-sinaAds="adsInfo.feedback.index.clickContent"
          ></textarea>
        </div>
      </div>
    </div>

    <!--提交按钮-->
    <div class="submitBtn c-font-l c-white c-tc" @click="submit">
      告知我们
    </div>

    <!-- <div class="bottom-tips">
        问题未解决？<span @click="$root.openUrl({url: onlineServiceURL, title: '在线客服'})">联系客服</span>为你解答
    </div> -->

  </div>
</template>

<script>
import Api from "@/services/api";
import helper from "@/utils/helper";
import EventBus from "@/services/EventBus";
import { Toast, Indicator } from "@/utils/helper";

export default {
  data() {
    return {
      onlineServiceURL: "",
      str: "", // 输入内容
      link: "" // 联系方式
    };
  },

  methods: {
    setTitle() {
      this.$root.setWebAttribute({
        title: "意见反馈",
        isFull: false
      });
    },
    // 获取在线客服地址
    getOnlineService() {
      this.$AppBridge.getInitData({ type: "pageaddress" }, res => {
        console.log("pageaddress", res);
        if (
          res.code === "200" &&
          res.data &&
          res.data.pageaddress &&
          res.data.pageaddress.length
        ) {
          let list =
            typeof res.data.pageaddress != "string"
              ? res.data.pageaddress
              : JSON.parse(res.data.pageaddress);

          list.map((item, index) => {
            if (item.type === "ONLINESERVICE" && item.showmodel === "2") {
              this.onlineServiceURL = item.url;
              console.log("this.onlineServiceURL", this.onlineServiceURL);
              return;
            }
          });
        }
      });
    },
    // 提交
    submit() {
      this.sinaAds.click(this.adsInfo.feedback.index.clickSubmit);

      // 校验
      if (!this.checkStr(this.str)) return false;
      if (!this.checkLink(this.link)) return false;

      // loading开始
      Indicator.open();

      // 请求
      Api.user.help
        .feedback({
          suggestcontent: this.str,
          contactway: this.link,
          helptypeid: this.$route.params.helptypeid || undefined,
          helpid: this.$route.params.helpid || undefined
        })
        .then(res => {
          if (!helper.isSuccess(res)) return false;

          Toast("感谢您的反馈！我们会尽快进行处理~");

          if (this.$route.params.helptypeid && this.$route.params.helpid) {
            this.$AppBridge.notify({
              data: JSON.stringify({ type: "success" }),
              tag: "noUse"
            });
          }
          // 延时调用伪协议关闭
          setTimeout(() => {
            if (this.$AppBridge.isApp) {
              this.$AppBridge.activityView({
                type: "close"
              });
            } else {
              window.history.back();
            }
          }, 1500);
        })
        .finally(Indicator.close);
    },

    // 校验输入的意见反馈
    checkStr(str) {
      let maxLength = 140; // 字数不能超过1000
      let minLength = 2; // 字数少于2

      // 安全校验
      let htmlReg = "[";
      htmlReg += "<style[^>]*?>[\\s\\S]*?<\\/style>" + "|"; // 匹配style
      htmlReg += "<script[^>]*?>[\\s\\S]*?<\\/script>" + "|"; // 匹配script
      htmlReg += "<div[^>]*?>[\\s\\S]*?<\\/div>" + "|"; // 匹配div
      htmlReg += "<p[^>]*?>[\\s\\S]*?<\\/p>" + "|"; // 匹配 p
      htmlReg += "<span[^>]*?>[\\s\\S]*?<\\/span>" + "|"; // 匹配 span
      htmlReg += "<link[^>]*?>[\\s\\S]*?<\\/link>" + "|"; // 匹配 link
      htmlReg += "<link.*?>" + "|"; // 匹配 link
      htmlReg += "<img.*?>" + "|"; // 匹配img
      htmlReg += "]";

      str = str.replace(new RegExp(htmlReg, "g"), " ");

      // 业务校验
      // 是否为空
      if (str.trim().length === 0) {
        Toast("请写下你的宝贝意见或建议");
        return false;
      }

      // 是否超过140字
      if (str.length < minLength || str.length > maxLength) {
        Toast("字数限制为2-140个内，请重新输入！");
        return false;
      }

      this.str = str;
      return true;
    },

    // 校验输入的联系方式
    checkLink(str) {
      return true;
    }
  },
  created() {
    this.getOnlineService();
    this.$root.setWebAttribute({
      title: "意见反馈",
      isFull: false
    });
  },
  mounted() {
    this.$root.loadingClose();
  },
  filters: {}
};
</script>

<style lang="scss" scoped>
/*格子*/
.grid {
  color: #666666;

  /*格子标题*/
  .grid-title {
    display: flex;
    align-items: center;
    padding-left: 16px;
    height: 34px;
    line-height: 1;
    color: #666666;
  }

  /*格子内容*/
  .grid-content {
    /*输入框*/
    .input {
      height: 48px;
      padding: 10px 15px;
      box-sizing: border-box;

      input,
      textarea {
        width: 100%;
        height: 100%;
        border: none;
        resize: none;
      }

      textarea {
        font-size: 14px;
        letter-spacing: 0.1px;
        background: #f8f8f8;
        border-radius: 4px;
        padding: 14px;
      }

      &.text {
        height: 146px;
      }

      &.tel {
        input {
          line-height: normal;
        }
      }
    }
  }
}

/*提交按钮*/
.submitBtn {
  width: 343px;
  height: 48px;
  line-height: 48px;
  margin: 30px auto 0;
  background-image: linear-gradient(-89deg, #edc882 0%, #bd8729 100%);
  box-shadow: 0 2px 11px 0 rgba(194, 141, 50, 0.3);
  border-radius: 20px;
  font-size: 16px;
  color: #fff;
  letter-spacing: 0;
  text-align: center;
}
.bottom-tips {
  margin: 12px auto;
  font-size: 12px;
  color: #666666;

  span {
    color: #4586ee;
  }
}
</style>
