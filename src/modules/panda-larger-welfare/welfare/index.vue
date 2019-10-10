<template>
  <div class="welfare">
    <div class="view c-view-content">
      <div class="headerBox">
        <!--<div class="headerBg"></div>-->
        <c-header ref="transparentHeader" class="header transparent" :style="`color: #fff;`" :title="'福利'"
                  :show="true"></c-header>
        <div class="banner" v-if="welfareData">
        <span class="left" v-if="welfareData.welfareBanner2.pagedata.length>1" @click="$refs.mtSwipre.next()"><img
          src="./../images/left_ari.png" alt=""></span>
          <mt-swipe class="bannerList" ref="mtSwipre" :auto="5000" :showIndicators="false"
                    v-if="welfareData.welfareBanner2.pagedata.length">
            <mt-swipe-item v-for="(item,i) in welfareData.welfareBanner2.pagedata" :key="i" @click.native="jump1(item)"
                           v-if="item">
              <img :src="item.imgurl" v-sina-ads="stat.recommend.refuse.clickBanner"/>
            </mt-swipe-item>
          </mt-swipe>
          <span class="right" v-if="welfareData.welfareBanner2.pagedata.length>1" @click="$refs.mtSwipre.prev()"><img
            src="./../images/right_ari.png" alt=""></span>
        </div>
      </div>

      <div class="contentBox">
        <div class="box" v-if="welfareData">
          <!--邀请好友-->
          <mt-swipe class="invite" :auto="3000" :showIndicators="welfareData.welfareBanner.pagedata.length>1" v-if="">
            <mt-swipe-item v-for="(v,i) in welfareData.welfareBanner.pagedata" :key="i">
              <img :src="v.imgurl" v-sina-ads="stat.recommend.refuse.clickBanner" @click="jump1(v)"/>
            </mt-swipe-item>
          </mt-swipe>

          <!--导航栏-->
          <div class="nav">
            <div v-for="(v,i) in welfareData.welfareNav.pagedata" :key="i" @click="jump1(v)">
              <img :src="v.imgurl" alt="">
              <span>{{v.title}}</span>
            </div>
          </div>
          <!--福利专区-->
          <div class="welfareArea">
            <div class="top">福利专区</div>
            <div class="content">
              <img v-for="(v,i) in welfareData.welfareDryStrategy.pagedata" :key="i" :src="v.imgurl" @click="jump1(v)"/>
            </div>
          </div>
          <!--权益领取-->
          <div class="receive" v-if="memberRenderPage.length">
            <div class="top">
              <span class="left">权益领取</span>
              <span class="right" @click="jump()">领取更多</span>
            </div>
            <div class="content">
              <div v-for="(v,i) in memberRenderPage" :key="i" v-if="i<3">
                <div class="left">
                  <span class="name">{{v.name}}</span>
                  <span class="desc">{{v.desc}}</span>
                </div>
                <div class="right"><span @click="jump()">省{{v.saveMoney}}</span></div>
              </div>
            </div>
          </div>

        </div>
        <kefu_people class="kefu" :onlineServiceUrl="onlineServiceUrl" :isWelfare="true"></kefu_people>
      </div>
    </div>
  </div>
</template>

<script>
  import util from "@/utils";
  import storage from "@/utils/storage";
  import helper from "@/utils/helper";
  import kefu_people from "./../recommend/components/kefu_people";

  export default {
    components: {kefu_people},
    data() {
      return {
        welfareData: null, // 福利数据
        onlineServiceUrl: '', // 客服链接
        serverNum: 0, // 服务人数
        memberRenderPage: [], // 会员权益领取的数据
        memberRenderUrl: '', // 权益领取的url
      }
    },
    computed: {},
    watch: {},
    methods: {
      // 查询资源
      getResource() {
        this.$api.activity.getApprovaling({
          pageid: 1002,
          mjbname: util.getParams('mjbname'),
          productId: 2001
        }).then((res) => {
          if (helper.isSuccess(res)) {
            this.welfareData = res.data.pagedata
            console.log("welfareData", this.welfareData)
          }
        })
      },
      // banner上左右箭头点击事件
      move(str) {
        console.log(this.$refs)
        this.$refs.mtSwipre[str]()
      },
      getKf() {
        this.$AppBridge.getInitData({type: "pageaddress"}, res => {
          console.log("pageaddress", res);
          if (
            res.code == "200" &&
            res.data &&
            res.data.pageaddress &&
            res.data.pageaddress.length
          ) {
            let list = typeof res.data.pageaddress != "string" ? res.data.pageaddress : JSON.parse(res.data.pageaddress);
            list.map((item, index) => {
              if (item.type === "ONLINESERVICE" && item.showmodel === "2") {
                this.onlineServiceUrl = item.url;
                return;
              }
            });
          }
        });
      },
      // 会员权益领取的数据
      getMemberRenderPage() {
        console.log("mjbname", util.getParams('mjbname'))
        console.log("channelId", util.getParams('channel'))
        this.$api.member.getMemberRenderPage({
          mjbname: util.getParams('mjbname'),
          channelId: util.getParams('channel'),
          productId: 2001
        }).then((res) => {
          // this.$api.member.getMemberRenderPage({mjbname: 'dawang',channelId: 's2017018237831',productId: '2001'}).then((res)=>{
          console.log("getMemberRenderPage", res.data.cards)
          if (helper.isSuccess(res)) {
            if (res.data.cards.length > 0) {
              res.data.cards.sort((a, b) => (a.type - b.typeList))
              this.memberRenderPage = res.data.cards[0].privileges
            }

          }
        })
      },
      // 获取服务人数
      getServerNum() {
        this.$AppBridge.getInitData({}, res => {
          console.log("res", res)
          if (res.code == "200") {
            this.serverNum = util.moneyFormat(Number(res.data.peoplenum)).replace('.00', '')
            let list = typeof res.data.pageaddress != "string" ? res.data.pageaddress : JSON.parse(res.data.pageaddress);
            list.map((item, index) => {
              if (item.type === "VIP_RIGHTS" && item.showmodel === "2") {
                this.memberRenderUrl = item.url;
                console.log("this.memberRenderUrl", this.memberRenderUrl);
              }
            });
          }
        });
      },
      // 跳转
      jump() {
        this.$root.openUrl({url: this.memberRenderUrl, title: '权益领取'})
      },
      // 跳转
      jump1(v) {
        if (v.jumptype == 1) { // h5内置打开
          this.$root.openUrl(v.jumplink)
        } else if (v.jumptype == 2) {
          this.$AppBridge.activityView({
            type: "open",
            url: v.jumplink,
            isFull: false,
            open_inner: false,
          });
        }
      },


      init() {
        this.getResource()
        this.getKf()
        this.getMemberRenderPage()
        this.getServerNum()
      }
    },
    created() {
      this.init()
    },
    mounted() {
      this.$root.setStatusColor("white");
    },
  }
</script>

<style lang='scss' scoped>
  .welfare {
    .view {
      background: #f7f7f7;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      width: 100%;
      .headerBox{
        width: 100%;
        z-index: 15;
        background: url("./../images/werfare_headBg.png") no-repeat;
        background-size: cover;
        .headerBg {
          width: 100%;
          height: 100%;
          position: absolute;
        }
        .banner {
          height: 151px;
          padding-top: 28px;
          display: flex;
          justify-content: center;
          align-items: center;
          .left, .right {
            z-index: 9;
            flex-grow: 0.5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            img {
              width: 14px;
              height: 20px;
            }
          }
          /deep/ .bannerList {
            width: 295px;
            height: 100%;
            > div {
              img {
                width: 100%;
                /*height: 100%;*/
                height: 123px;
              }
            }
          }
        }
      }
      .contentBox{
        flex-grow: 1;
        overflow: auto;
        background: #f7f7f7;
        .box {
          > div {
            margin-bottom: 8px;
          }
          .invite {
            width: 100%;
            height: 86px;
            /deep/ .mint-swipe-items-wrap {
              height: 110px;
            }
            /deep/ .mint-swipe-indicator {
              width: 8px;
              height: 3px;
              background: #bac9ef;
              &.is-active {
                background: #648CFF;
              }
            }
            img {
              width: 100%
            }
          }
          .nav {
            background: #fff;
            display: flex;
            justify-content: left;
            align-items: center;
            height: 75px;
            > div {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 25%;
              img {
                width: 28px;
                margin-bottom: 4px;
              }
              span {
                font-size: 12px;
                color: #535370;
              }
            }
          }
          .welfareArea {
            width: 100%;
            background: #fff;
            padding: 0 16px;
            padding-bottom: 20px;
            .top {
              display: flex;
              height: 58px;
              justify-content: left;
              align-items: center;
              color: #353241;
              font-size: 18px;
            }
            .content {
              display: flex;
              justify-content: left;
              align-items: center;
              width: 100%;
              flex-wrap: wrap;
              img {
                width: calc(50% - 4px);
                height: 86px;
                margin-bottom: 10px;
                &:nth-child(odd) {
                  margin-right: 8px;
                }
              }
            }
          }
          .receive {
            background: #fff;
            padding: 16px;
            .top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 25px;
              margin-bottom: 8px;
              .left {
                font-size: 18px;
                color: #353241;
              }
              .right {
                color: #666;
                font-size: 14px;
              }
            }
            .content {
              width: 100%;
              > div {
                height: 80px;
                width: 100%;
                background: url("./../images/quanyiBg.png") no-repeat;
                background-size: 100% 100%;
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 16px;
                .left {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: flex-start;
                  .name {
                    margin-bottom: 4px;
                    font-size: 16px;
                    color: #604a25;
                  }
                  .desc {
                    font-size: 14px;
                    color: #604A25;
                  }
                }
                .right {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 70px;
                  height: 32px;
                  span {
                    width: 100%;
                    height: 100%;
                    background-image: linear-gradient(to left, #EDC882 0%, #BD8729 100%);
                    box-shadow: 0 4px 8px 0 rgba(206, 157, 72, 0.21);
                    border-radius: 15px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 12px;
                    color: #604A25;
                  }
                }
              }
            }
          }
        }
        .kefu {
          background: transparent !important;
        }
      }

    }
  }
</style>
