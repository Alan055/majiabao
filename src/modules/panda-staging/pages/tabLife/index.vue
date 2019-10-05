<template>

  <scroller :head="head" :init="init" >


    <div class="tabLife" v-if="tabLife.length||imgList.length">
      <div class="banner">
        <mt-swipe class="bannerList" :auto="3000" :showIndicators="tabLife.length>1">
          <mt-swipe-item v-for="(v,i) in tabLife" :key="i">
            <!--<img :src="v.imgurl" @click="jump(v,'bannerClick')" height="100%" width="100%"/>-->
            <img src="./blackName.png" @click="jump(v,'bannerClick')" height="100%" width="100%"/>
          </mt-swipe-item>
        </mt-swipe>
        <img src="./radian.png" alt="" class="radian">
        <div class="integral">
          <div class="left">
            <span v-if="!$root.isLogin" class="login">可用积分：<em>{{10}}</em></span>
            <span v-else class="noLogin">登录签到赚积分</span>
          </div>
          <div class="right">
            <span v-if="!$root.isLogin" class="login">签到赚积分<img src="./rightTri.png"></span>
            <span v-else class="noLogin">登录查看</span>
          </div>
        </div>
      </div>

      <!--资源位-->
      <div class="nav">
        <div class="item">
          <img src="./yiyuan.png" alt="" class="navIcon">
          <span class="title">手机回收</span>
          <div class="tip">
            <span>推荐</span>
            <img src="./star.png" class="starleft" alt="">
            <img src="./star.png" class="starright" alt="">
            <img src="./star.png" class="starbottom" alt="">
          </div>
        </div>
        <div class="item">
          <img src="./yiyuan.png" alt="" class="navIcon">
          <span>手机回收</span>
          <!--<div class="tip">-->
          <!--<span>推荐</span>-->
          <!--<img src="./star.png" class="left" alt="">-->
          <!--<img src="./star.png" class="right" alt="">-->
          <!--<img src="./star.png" class="bottom" alt="">-->
          <!--</div>-->
          <!--<img src="" alt="" class="tip">-->
        </div>
        <div class="item">
          <img src="./yiyuan.png" alt="" class="navIcon">
          <span>手机回收</span>
          <!--<div class="tip">-->
          <!--<span>推荐</span>-->
          <!--<img src="./star.png" class="left" alt="">-->
          <!--<img src="./star.png" class="right" alt="">-->
          <!--<img src="./star.png" class="bottom" alt="">-->
          <!--</div>-->
          <!--<img src="" alt="" class="tip">-->
        </div>
        <div class="item">
          <img src="./yiyuan.png" alt="" class="navIcon">
          <span>手机回收</span>
          <!--<div class="tip">-->
          <!--<span>推荐</span>-->
          <!--<img src="./star.png" class="left" alt="">-->
          <!--<img src="./star.png" class="right" alt="">-->
          <!--<img src="./star.png" class="bottom" alt="">-->
          <!--</div>-->
          <!--<img src="" alt="" class="tip">-->
        </div>
        <div class="item">
          <img src="./yiyuan.png" alt="" class="navIcon">
          <span>手机回收</span>
          <!--<div class="tip">-->
          <!--<span>推荐</span>-->
          <!--<img src="./star.png" class="left" alt="">-->
          <!--<img src="./star.png" class="right" alt="">-->
          <!--<img src="./star.png" class="bottom" alt="">-->
          <!--</div>-->
          <!--<img src="" alt="" class="tip">-->
        </div>
        <div class="item">
          <img src="./yiyuan.png" alt="" class="navIcon">
          <span>手机回收</span>
          <!--<div class="tip">-->
          <!--<span>推荐</span>-->
          <!--<img src="./star.png" class="left" alt="">-->
          <!--<img src="./star.png" class="right" alt="">-->
          <!--<img src="./star.png" class="bottom" alt="">-->
          <!--</div>-->
          <!--<img src="" alt="" class="tip">-->
        </div>
        <div class="item">
          <img src="./yiyuan.png" alt="" class="navIcon">
          <span>手机回收</span>
          <!--<div class="tip">-->
          <!--<span>推荐</span>-->
          <!--<img src="./star.png" class="left" alt="">-->
          <!--<img src="./star.png" class="right" alt="">-->
          <!--<img src="./star.png" class="bottom" alt="">-->
          <!--</div>-->
          <!--<img src="" alt="" class="tip">-->
        </div>
        <div class="item">
          <img src="./yiyuan.png" alt="" class="navIcon">
          <span>手机回收</span>
          <!--<div class="tip">-->
          <!--<span>推荐</span>-->
          <!--<img src="./star.png" class="left" alt="">-->
          <!--<img src="./star.png" class="right" alt="">-->
          <!--<img src="./star.png" class="bottom" alt="">-->
          <!--</div>-->
          <!--<img src="" alt="" class="tip">-->
        </div>
        <div class="item">
          <img src="./yiyuan.png" alt="" class="navIcon">
          <span>手机回收</span>
          <!--<div class="tip">-->
          <!--<span>推荐</span>-->
          <!--<img src="./star.png" class="left" alt="">-->
          <!--<img src="./star.png" class="right" alt="">-->
          <!--<img src="./star.png" class="bottom" alt="">-->
          <!--</div>-->
          <!--<img src="" alt="" class="tip">-->
        </div>
      </div>

      <!--超级福利-->
      <div class="welfare">
        <div class="label">超级福利</div>
        <div class="cell"><img src="./welcell.png" alt=""></div>
        <div class="box">
          <div class="item">
            <img src="./welfare1.png" alt="">
          </div>
          <div class="item">
            <img src="./welfare1.png" alt="">
          </div>
          <div class="item">
            <img src="./welfare1.png" alt="">
          </div>
        </div>
      </div>

      <!--熊猫信用-->
      <div class="credit">
        <div class="label">熊猫信用</div>
        <div class="box" :style="showMore?`height:${imgList.length*24+2.667}vw`:''">
          <div class="item">
            <div class="left"><img src="./creditIcon.png" alt=""></div>
            <div class="center">
              <span class="title">阳光贷款</span>
              <span class="des">资金周转  信用助力生活</span>
            </div>
            <div class="right">
              <span>立即申请</span>
            </div>
          </div>
          <div class="item">
            <div class="left"><img src="./creditIcon.png" alt=""></div>
            <div class="center">
              <span class="title">阳光贷款</span>
              <span class="des">资金周转  信用助力生活</span>
            </div>
            <div class="right">
              <span>立即申请</span>
            </div>
          </div>
          <div class="item">
            <div class="left"><img src="./creditIcon.png" alt=""></div>
            <div class="center">
              <span class="title">阳光贷款</span>
              <span class="des">资金周转  信用助力生活</span>
            </div>
            <div class="right">
              <span>立即申请</span>
            </div>
          </div>
          <div class="item">
            <div class="left"><img src="./creditIcon.png" alt=""></div>
            <div class="center">
              <span class="title">阳光贷款</span>
              <span class="des">资金周转  信用助力生活</span>
            </div>
            <div class="right">
              <span>立即申请</span>
            </div>
          </div>
          <div class="item">
            <div class="left"><img src="./creditIcon.png" alt=""></div>
            <div class="center">
              <span class="title">阳光贷款</span>
              <span class="des">资金周转  信用助力生活</span>
            </div>
            <div class="right">
              <span>立即申请</span>
            </div>
          </div>
        </div>
        <div class="tools">
          <div @click="showMore=!showMore">
            <img src="./showMore.png" alt="" :class="{'retract':showMore}"><span>{{showMore?'收起':'展示更多'}}</span>
          </div>
        </div>
      </div>

      <!--会员专区-->
      <div class="vip">
        <div class="label">会员专区</div>
        <div class="box">
          <div class="boxMove" :style="`width:${8.534+vipList.length*74.667+(vipList.length-1)*2.667}vw`">
            <div v-for="(v,i) in vipList" :key="i" class="item">
              <div class="left">
                <div class="province">
                  <span>省</span> <b>¥600</b>
                </div>
                <div class="des1">五星级酒店自助餐</div>
                <div class="des2">每年2次双人行二免一</div>
              </div>
              <div class="right"><span>立即领取</span></div>
            </div>
          </div>

        </div>
      </div>


      <!--<div class="content" v-if="imgList.length">-->
      <!--<div class="label">熊猫生活</div>-->
      <!--<div class="box">-->
      <!--<img v-for="(v,i) in imgList" :key="i" :src="v.imgurl" @click="jump(v,'cellClick')">-->
      <!--</div>-->
      <!--</div>-->
      <div class="bottom">
        <span>一站触达美好生活</span>
      </div>
    </div>

  </scroller>
</template>

<script>
  import scroller from "@/components/view/view.vue";


  export default {
    data() {
      return {
        // 框架头部
        head: {
          left: '',
          title: '生活',
          right: [
            {img: '/static/images/close.png', needLogin: true, jumpUrl: 'http://www.baidu.com'},
            {img: '/static/icon/my/help/ap_at@2x.png', needLogin: false, jumpUrl: 'http://www.baidu.com'},
          ],
          border: false,
        },

        messageUrl: process.env.staticPath + "/panda-staging/#/message", // 消息中心
        redPacketsUrl: process.env.staticPath + "", // 红包


        isLoading: false,

        tabLife: [
          {},
          {},
          {},
          {},
        ],
        showMore: false, // 是否展示更多
        imgList: [
          {},
          {},
          {},
          {},
          {},
        ],
        vipList: [
          {},
          {},
          {},
          {},
          {},
        ],
        height: 0
      }
    },
    components: {scroller},
    computed: {},
    methods: {
      // 获取广告位数据
      findBanner() {
        this.$AppBridge.loadingView({type: 2}) // 加载中...
        this.$api.activity.getApprovaling({pageid: 1037, productId: 2001}).then((res) => {
          if (res.code == 200) {
            this.tabLife = res.data.pagedata.tab3Banner.pagedata
            this.imgList = res.data.pagedata.tab3Banner2.pagedata
            this.$AppBridge.loadingView({close: true, type: 2}) // 关闭加载中...
          }
        })
      },
      // 跳转
      jump(v, str) {
        this.sinaAds.click({currEvent: this.stat.tabLife[str], currEventParams: {url: v.jumplink}}, () => {
        });
        if (v.jumptype == 1) { // h5内置打开
          this.$root.openUrl({title: v.title, url: v.jumplink})
        } else if (v.jumptype == 2) {
          this.$AppBridge.activityView({
            type: "open",
            url: v.jumplink,
            isFull: false,
            title: v.title,
            open_inner: false,
          });
        }
      },

      // vant的下拉刷新
      onRefresh() {
        setTimeout(() => {
          this.isLoading = false;
          this.init()
        }, 1000);
      },


      init(cb) {
        // this.findBanner()	// 获取广告位数据

        cb && cb()
      }
    },
    created() {
      // this.$root.setWebAttribute({title: "生活"});
      this.init()

    },
    mounted() {
      this.$root.setStatusColor('white') // 设置状态栏为白色
      this.sinaAds.display({currEvent: this.stat.tabLife.pageShow, currEventParams: {url: location.href}}, () => {
      });
    },
    onRefresh(tag, data) {
      console.log('下拉刷新回传参数：', tag, data)
      if (tag == "home" || tag == "refresh") {
        this.init(tag);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @-webkit-keyframes loadingRotate {
    0% {
      -webkit-transform: rotateZ(0deg);
    }
    100% {
      -webkit-transform: rotateZ(360deg);
    }
  }

  @-webkit-keyframes starAniR {
    0% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(0.4);
    }
  }

  @-webkit-keyframes starAniL {
    0% {
      transform: scale(0.7);
    }
    25% {
      transform: scale(1.2)
    }
    50% {
      transform: scale(0.7)
    }
    75% {
      transform: scale(0.4)
    }
    100% {
      transform: scale(0.7);
    }
  }

  @-webkit-keyframes starAniB {
    0% {
      transform: scale(0.4);
    }
    100% {
      transform: scale(1.2);
    }
  }
  /deep/ .header{
    color: transparent;
  }
  .tabLife {
    background: #fff;
    position: relative;

      .banner {
        height: 290px;
        width: 100% !important;
        position: relative;

        .radian {
          position: absolute;
          bottom: -12px;
          left: 0;
          width: 100%;
          z-index: 99;
        }

        .integral {
          margin: 0 16px;
          width: calc(100% - 32px);
          background: url("./integral.png") no-repeat;
          background-size: cover;
          height: 46px;
          position: absolute;
          bottom: 4px;
          font-size: 14px;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          padding-bottom: 7px;
          border-radius: 4px;

          .left {
            .login {
              em {
                font-size: 16px;
              }
            }

            .noLogin {
            }
          }

          .right {
            .login {
              display: flex;
              align-items: center;

              img {
                width: 16px;
                transform: rotate(180deg);
              }
            }

            .noLogin {
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 20px;
              width: 80px;
              height: 24px;
              background: #fff;
              color: #8c8d9d;
              font-size: 12px;
              box-shadow: 0 0px 2px 0px #8c8d9d;
            }
          }
        }

        /deep/ .mint-swipe-indicators {
          text-align: right;
          bottom: 22%;
          right: 0;
          width: 90%;

          .mint-swipe-indicator {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #fff;
            opacity: 1;

            &.is-active {
              opacity: 0.4;
              width: 8px;
              height: 4px;
              border-radius: 6px;
            }
          }
        }
      }

      .nav {
        margin: 10px 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;

        .item {
          width: 25%;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          position: relative;

          .navIcon {
            width: 40px;
            height: 40px;
            margin-bottom: 5px;
          }

          .title {
            font-size: 14px;
            color: #333333;
          }

          .tip {
            position: absolute;
            border: 1px solid #fff;
            border-radius: 8px 10px 10px 0;
            background: #F95F61;
            box-shadow: 0 1px 2px 0 rgba(196, 1, 1, 0.6);
            min-width: 32px;
            height: 16px;
            left: 50%;
            padding: 0 4px;
            top: 6px;
            display: flex;
            justify-content: center;
            align-items: center;

            span {
              font-size: 8px;
              color: #fff;
            }

            .starleft {
              animation: starAniB 0.4s infinite alternate linear;

              position: absolute;
              top: -5px;
              left: 15%;
              width: 9px;
              height: 9px;
            }

            .starright {
              animation: starAniR 0.4s infinite alternate linear;
              position: absolute;
              top: -5px;
              right: 15%;
              width: 9px;
              height: 9px;
            }

            .starbottom {
              animation: starAniR 0.4s infinite alternate linear;
              position: absolute;
              bottom: -5px;
              left: calc(50% - 4px);
              width: 9px;
              height: 9px;
            }
          }
        }
      }

      .welfare, .credit, .vip {
        margin: 0 16px;
        margin-top: 8px;

        .label {
          height: 48px;
          font-size: 18px;
          color: #333333;
          display: flex;
          justify-content: left;
          align-items: center;
          font-weight: bold;
        }
      }

      .welfare {
        .cell {
          width: 100%;

          img {
            width: 100%;
          }
        }

        .box {
          display: flex;
          justify-content: left;
          align-items: center;
          flex-wrap: wrap;

          .item {
            width: calc(50% - 4px);
            height: 70px;
            margin-top: 8px;

            &:nth-child(odd) {
              margin-right: 8px;
            }

            img {
              width: 100%;
            }
          }
        }
      }

      .credit {
        margin-left: 0;
        margin-right: 0;

        .label {
          margin: 0 16px;
        }

        .box {
          width: 100%;
          padding: 0 16px;
          height: 280px;
          transition: height 0.5s;
          overflow: hidden;

          .item {
            width: 100%;
            height: 80px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-right: 16px;
            box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
            border-radius: 4px;
            background: url(./creditBg.png);
            background-size: 100% 100%;
            margin: 10px 0 0;

            > div {
              height: 100%;
            }

            .left {
              width: 70px;
              display: flex;
              justify-content: center;
              align-items: center;

              img {
                width: 46px;
                height: 46px;
              }
            }

            .center {
              width: 140px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              flex: 1;

              .title, .des {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .title {
                font-size: 16px;
                color: #333333;
                margin-bottom: 4px;
                font-weight: 600;
              }

              .des {
                font-size: 12px;
                color: #999999;
              }
            }

            .right {
              width: 80px;
              height: 32px;
              background: #4E67FF;
              box-shadow: 0 2px 20px 0 rgba(78, 103, 255, 0.30);
              border-radius: 16px;
              display: flex;
              justify-content: center;
              align-items: center;

              span {
                color: #fff;
                font-size: 14px;
              }
            }
          }
        }

        .tools {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;

          div {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          img {
            width: 16px;
            height: 16px;
            margin-right: 4px;
            transition: transform 0.5s;
          }

          .retract {
            transform: rotate(180deg);
          }

          span {
            font-size: 12px;
            color: #333333;
          }
        }
      }

      .vip {
        margin: 18px 0;

        .label {
          padding: 0 16px;
        }

        .box {
          height: 132px;
          overflow: auto;

          .boxMove {
            height: 100%;
            padding: 0 16px;

            .item {
              background: url("./vipBg.png") no-repeat;
              background-size: 100% 100%;
              border-radius: 4px;
              width: 280px;
              height: 132px;
              margin-right: 10px;
              float: left;
              display: flex;
              padding: 0 16px;

              &:last-child {
                margin: 0;
              }

              .left {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                flex-grow: 1;

                .province {
                  display: flex;
                  justify-content: left;
                  align-items: center;
                  margin-left: -22px;

                  span {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 44px;
                    height: 28px;
                    background: url("./sheng.png") no-repeat;
                    background-size: 100% 100%;
                    color: #fff;
                    margin-top: 4px;
                    font-size: 14px;
                  }

                  b {
                    font-size: 24px;
                    color: #E94854;
                    font-weight: normal;
                  }
                }

                .des1 {
                  font-size: 16px;
                  color: #98745D;
                  margin: 8px 0;
                }

                .des2 {
                  font-size: 14px;
                  color: #957157;
                }
              }

              .right {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 80px;

                span {
                  width: 80px;
                  height: 32px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: #D0A252;
                  border-radius: 16px;
                  font-size: 14px;
                  color: #FFFFFF;
                }
              }
            }
          }
        }
      }

      .content {
        width: 100%;
        padding: 30px 16px 0;

        .label {
          font-size: 18px;
          color: #333333;
          font-weight: bold;
        }

        .box {
          img {
            width: 100%;
            height: 90px;
            margin-top: 14px;
            box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.10);
          }
        }
      }

      .bottom {
        height: 100px;
        background: #F8F8F8;
        border-radius: 20px 20px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        color: #ccc;
        margin-top: 40px;

        span {
          display: flex;
          height: 40px;
          align-items: center;

        }

      }
  }
</style>
