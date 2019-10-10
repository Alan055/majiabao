<template lang="html">
  <div class="page-message view">
    <div class="c-layer">
      <c-header ref="transparentHeader" class="header transparent" :style="`color:#333;border-bottom:1px solid #e6e6e6`"
                :title="appName2" :show="true">
         <span slot="left" class="posi-r">
                <c-icon type="back" @click.native="handleBack"/>
            </span>
        <span slot="right" class="posi-l">
          <em @click="$root.openUrl(onlineServiceURL)">在线客服</em>
            </span>
      </c-header>
    </div>

    <div class="c-view-content">
      <div class="c-flex-row m-message-list" v-for="(item, i) in data" :key="i" @click="goDetail(item)">
        <div class="c-col-20 left">
          <img src="../../assets/images/my-message.png" v-if="item.msgtype == 1"/>
          <img src="../../assets/images/system-message.png" v-if="item.msgtype == 0"/>
        </div>
        <div class="c-col-80 right">
          <div class="c-flex-row c-justify-between">
            <div class="c-flex-item el-title">
              {{item.msgtitle}}
            </div>
            <div class="c-flex-item el-time">
              {{item.createtime}}
            </div>
          </div>
          <div class="c-flex-row c-flex-wrap el-content" v-if="item.msgtype == 1">
            <img class="he-full-img" v-if="item.msgimgurl" :src="item.msgimgurl"/>
          </div>
          <div class="c-flex-row c-flex-wrap el-content" v-if="item.msgtype == 0">
            {{item.msgcontent}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mixins: [require("../../mixins").default],
    data() {
      return {
        pageSize: 1000,
        pageNo: 1,
        token: '',
        data: [],
        onlineServiceURL: '',
      };
    },
    methods: {
      handleBack() {
        this.$AppBridge.activityView({
          type: "close"
        });
      },
      getData(type) {

        return new Promise((resolve, reject) => {
          this.$api.user.message
            .lists({
              msgType: type, //活动消息
              pageNum: this.pageNo,
              pageSize: this.pageSize,
              productId: '2001',
              token: this.token
            })
            .then(res => {
              if (!this.$helper.isSuccess(res)) return;

              resolve(res.data.pageData)

            });
        });
      },
      goDetail(item) {
        if (item.openurl) {
          this.$root.openUrl(item.openurl);
        } else {
          this.$router.replace({
            name: "messageDetail",
            query: {
              item: JSON.stringify(item),
              productid: this.productId
            }
          });
        }
      },
      pushData() {
        this.data = [{
          msgtype: 0,
          msgtitle: '系统公告',
          createtime: '2019-05-08',
          msgcontent: '温馨提示：谨防诈骗！',
          openurl: process.env.kingPath + "/pages/speed-panda/#/message/example", //消息中心
        }]
      },
      // 获取在线客服地址
      getOnlineService() {
        this.$AppBridge.getInitData({type: "pageaddress"}, res => {
          console.log("pageaddress", res);
          if (res.code == "200" && res.data && res.data.pageaddress && res.data.pageaddress.length) {
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
      }
    },
    watch: {},
    async created() {
      this.token = this.$route.query.token;

      if (this.token) {
        let data1 = await this.getData(1);//系统消息
        let data2 = await this.getData(0);//活动消息

        this.data = data1.concat(data2);

        if (this.data.length == 0) {
          this.pushData()
        }
      } else {
        this.pushData()
      }
    },
    mounted() {
      this.getOnlineService()
    }
  };
</script>

<style lang="scss" scoped>
  .page-message {
    background: #FFFFFF;
    .c-layer {
      height: unset;
      .header {
        position: relative;
        z-index: 1;
        // transition: background .3s;
        &.show {
          background: #514353 !important;
          color: white !important;
        }
        .posi-l {
          position: relative;
          img {
            width: 26px;
          }
          .he-inline-block {
            margin-left: 10px;

          }
        }
      }
    }

    .m-message-list {
      overflow: hidden;
      padding: 20px 16px;
      .left {
        text-align: left;
        img {
          width: 48px;
        }
      }
      .right {
        @extend %border-b;
        .el-title {
          font-size: 18px;
          color: #444444;
          text-align: left;
        }
        .el-time {
          font-size: 12px;
          color: #BFBFBF;
        }
        .el-content {
          height: 100%;
          font-size: 14px;
          color: #797979;
          letter-spacing: 0;
          padding-bottom: 10px;
          text-align: left;
        }
      }
    }
  }
</style>
