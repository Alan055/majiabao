<template>
  <div class="view get-trust-page">
    <div class="c-layer">
      <div class="pull-down-bg" :style="{height: activeHeight}"></div>
    </div>

    <c-header
      ref="transparentHeader"
      class="header transparent c-border-b"
      :style="`background: rgba(255, 255, 255, ${headerRgba}); color: black;`"
      title="信用生活"
      :show="true"
    >
      <span
        slot="right"
        v-sina-ads="stat.recommend.message.mess"
        @click="$root.openUrl(messageUrl);redIcon=false;"
        class="posi-r"
      >
        <mt-button>
          <img class="c-icon icon_a" src="~@/assets/images/my/home/an_ao@2x.png">
        </mt-button>
      </span>
    </c-header>

    <div class="c-view-content">
      <!-- <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div> -->

      <!-- 发现 -->
      <div class="m-discover">
        <p class="title">发现</p>
        <div class="c-flex-row">
          <div class="c-flex-item" @click="handleBannerIconClick(1)">
            <img src="../../assets/images/tab1.png">
          </div>
          <div class="c-flex-item" @click="handleBannerIconClick(2)">
            <img src="../../assets/images/tab2.png">
          </div>
          <div class="c-flex-item" @click="handleBannerIconClick(3)">
            <img src="../../assets/images/tab3.png">
          </div>
          <div class="c-flex-item" @click="handleBannerIconClick(4)">
            <img src="../../assets/images/tab4.png">
          </div>
        </div>
        <div class="c-flex-row">
          <div class="c-flex-item">息费透明</div>
          <div class="c-flex-item">还款灵活</div>
          <div class="c-flex-item">安全保障</div>
          <div class="c-flex-item">专业快捷</div>
        </div>
      </div>

      <div class="m-banner c-flex-row">
        <div class="c-flex-item" @click="handleBannerClick()">
          <img src="../../assets/images/getTrust-banner.png">
        </div>
      </div>

      <!-- 借款攻略 -->
      <div class="m-strategy">
        <p class="title">借款攻略</p>
        <div class="c-flex-row">
          <div class="c-flex-item">
            <div @click="handleRecordClick(1)" class="strategy-card card-1">
              <p>还款方式有哪些？</p>
            </div>
          </div>
          <div class="c-flex-item">
            <div @click="handleRecordClick(2)" class="strategy-card card-2">
              <p>你真的懂“征信”吗？</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Popup :value="isShowPopup" @maskingClose="isShowPopup = false">
      <div class="friends-rule" slot="content">
        <div class="el-title">严格遵守国家政策</div>
        <div class="el-content">
          极速熊猫平台费用透明，严格遵守国家监管政策要求，无任何违法或不符合政策要求的利率及费用。详细费率如下：
          <br>1. 综合年化，不高于年化36%。年利化率 = 日利率*365，当前年化利率35.7%。
          <br>2. 月利息不超过3%，无咨询费，无手续费等其他额外费用。
          <br>3. 严格遵守国家法律规定，谨防套路贷，暴力催收。
          <br>
        </div>
        <div class="el-btn">
          <mt-button
            class="btn-round handle-button"
            size="normal"
            type="primary"
            @click.native="handlePopupBtnClick"
          >我知道了</mt-button>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import axios from "axios";
import api from "@/services/api";
import util from "@/utils";
import Popup from "@/components/view/popup";
import { helper, MessageBox } from "@/utils/helper";

export default {
  name: "nopass",
  data() {
    return {
      isShowPopup: false,
      channel: util.getParams("channel"),
      activeHeight: "40vh",
      headerRgba: 1
    };
  },
  components: {
    Popup
  },
  methods: {
    handlePopupBtnClick() {
      this.isShowPopup = false;
      this.gotoNextPage(1);
    },
    handleRecordClick(id) {
      console.log("id", id);
      this.$root.nextTitle = "借款攻略";
      this.$router.push({
        name: "getTrust/detail" + id,
        params: {
          id: id
        }
      });
    },
    handleBannerClick() {
      this.$root.nextTitle = "借钱就找极速熊猫";
      this.$router.push({
        name: "getTrust/detail0",
        params: {}
      });
    },
    gotoNextPage(id) {
      this.$root.nextTitle = "极速熊猫";

      this.$router.push({
        name: "getTrust/desc",
        params: {
          id: id
        }
      });
    },
    handleBannerIconClick(id) {
      console.log("id", id);
      if (id == 1 && this.channel == "s2001010103449298") {
        this.isShowPopup = true;
      } else {
        this.gotoNextPage(id);
      }
    }
  },
  created() {},
  mounted() {
    this.$root.loadingClose();
  },
  onRefresh(tag, data) {
    if (tag == "refresh") {
    }
  }
};
</script>

<style lang="scss" scoped>
.pull-down-bg {
  background-image: #fff;
  position: absolute;
  z-index: -1;
  width: 100%;
}
.block-header {
  display: block;
  background: transparent;
  height: 64px;
}

.get-trust-page {
  .c-view-content {
    box-sizing: border-box;

    .title {
      font-size: 18px;
      color: #353241;
    }

    .m-discover {
      padding: 16px;
      .title {
        margin-bottom: 16px;
      }

      .c-flex-item {
        font-size: 12px;
        color: #333333;

        img {
          width: 44px;
          height: 44px;
        }
      }
    }

    .m-banner {
      height: 89px;
      width: 100%;
      margin: 24px auto;
      padding: 0 16px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
    }

    .m-strategy {
      color: #ffffff;
      .title {
        padding: 0 16px;
      }

      .strategy-card {
        border-radius: 6px;
        height: 100px;
        margin-top: 11px;
        text-align: left;
        font-size: 14px;

        p {
          margin-left: 20px;
          padding-top: 16px;
        }
      }
      .card-1 {
        background: url("../../assets/images/card_1@2x.png") no-repeat;
        background-size: cover;
        margin-left: 6px;
      }

      .card-2 {
        background: url("../../assets/images/card_2@2x.png") no-repeat;
        background-size: cover;
        margin-right: 6px;
      }
    }
  }

  .friends-rule {
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    width: 300px;
    position: relative;

    .el-title {
      //@extend %border-b;
      border: none !important;
      font-size: 16px;
      padding-bottom: 10px;
      text-align: center;
      position: relative;
      margin-bottom: 8px;
    }
    .el-content {
      padding: 15px 22px;
      line-height: 1.7;
      font-size: 14px;
      color: #333333;
    }
    .el-btn {
      text-align: center;
      .handle-button {
        width: 86px;
        height: 32px;
        font-size: 14px;
        position: relative;
        overflow: hidden;
        background: #5882ff;
      }
    }
  }
}
</style>
