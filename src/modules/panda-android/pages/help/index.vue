<template>
  <div class="view c-view-gay">
    <div class="c-layer">
      <div class="pull-down-bg" :style="{height: activeHeight}"></div>
    </div>

    <div class="c-layer header-layer">
      <c-header
        ref="transparentHeader"
        class="header"
        :style="`background: rgba(255, 255, 255, ${headerRgba}); color: black;`"
        title="帮助中心"
        :show="true"
      >
        <span
          slot="right"
          v-sina-ads="stat.recommend.message.mess"
          @click="$root.openUrl(messageUrl);redIcon=false;"
          class="posi-r"
        >
          <mt-button>
            <img class="c-icon icon_b" :src="require('../../assets/images/message@2x.png')">
          </mt-button>
        </span>
      </c-header>
    </div>

    <div class="c-view-content">
      <div id="blockHeaderContent" class="block-header" ref="transparentBlock"></div>

      <div class="m-banner">
        <div
          class="el-banner-btn"
          @click="$root.openUrl({url: onlineServiceURL, title: '在线客服'})"
        >点我咨询</div>
      </div>

      <div class="m-question">
        <div class="section-title">热门问题</div>
        <div class="el-question-list">
          <div
            class="el-question-item"
            v-for="(item, i) in hostData"
            :key="i"
            @click="handleHotClick(item)"
          >
            {{item.title}}
            <i class="mint-cell-allow-right"></i>
          </div>
        </div>
      </div>

      <div class="m-question-type">
        <div class="section-title">问题分类</div>
        <div class="el-question-typelist">
          <div
            class="el-question-typeitem"
            v-for="(item, i) in typeData"
            :key="i"
            @click="handleTypeClick(item)"
          >
            <div class="el-content">
              <img :src="item.iconurl">
              {{item.title}}
            </div>
          </div>
        </div>
      </div>
      <watermark/>
    </div>
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
      messageUrl: process.env.kingPath + "/pages/speed-panda/#/message", //消息中心
      onlineServiceUrl: "",
      activeHeight: "40vh",
      hostData: [
        {
          id: 1,
          title: "逾期会有哪些风险？"
        },
        {
          id: 2,
          title: "审核时间有多长？"
        },
        {
          id: 3,
          title: "熊猫钱包的申请条件？"
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
      moreLink: process.env.kingPath + "/pages/panda-loan/#/news/more", //更多资讯
      detailLink: process.env.kingPath + "/pages/panda-loan/#/news/detail" //资讯详情
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
    handleHotClick(item) {
      this.$root.nextTitle = "问题详情";
      this.$router.push({
        name: "help/detail",
        params: {
          id: item.id
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
.m-banner {
  position: relative;
  margin: 10px 16px;
  box-shadow: 0 2px 10px 0 rgba(13, 185, 131, 0.2);
  border-radius: 4px;
  background: url("../../assets/images/banner_help@2x.png");
  width: 343px;
  height: 122px;
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .el-banner-btn {
    position: absolute;
    bottom: 23px;
    left: 23px;
    background: #ffffff;
    padding: 6px 14px;
    font-size: 14px;
    color: #0db983;
    border-radius: 20px;
  }
}
.m-question {
  padding: 0 16px;

  .el-question-list {
    background: #ffffff;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 8px;

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
}
.m-question-type {
  padding: 0 16px;

  .el-question-typelist {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 20px;

    .el-question-typeitem {
      width: 50%;
      text-align: center;

      &:nth-child(even) {
        padding: 8px 0 8px 0;
      }
      &:nth-child(odd) {
        padding: 8px 8px 8px 0;
      }
      .el-content {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
        font-size: 16px;
        color: #444444;
        background: #ffffff;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.05);
        border-radius: 8px;

        img {
          margin-right: 6px;
          height: 36px;
          width: 36px;
        }
      }
    }
  }
}
.section-title {
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
</style>
