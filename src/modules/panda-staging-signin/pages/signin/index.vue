<template lang="html">
    <div class="view">
        <!-- 头部背景 -->
        <div class="m-top-bg">
            <img class="el-bg-top" src="../../assets/images/bg-top.png"/>
            <img class="el-bg-bottom" src="../../assets/images/bg-bottom.png"/>
            <img class="el-hudu" src="../../assets/images/hudu.png"/>
        </div>
        <!-- 头部 -->
        <div class="m-header">
            <c-header 
                ref="transparentHeader" class="header header-content" 
                title="每日签到"
                :show="true"
                :style="`color: rgba(0, 0, 0, ${headerRgba}); background: rgba(255, 255, 255, ${headerRgba}); opacity: ${headerOpacity}`" >
                <span slot="left" class="posi-l" >
                    <c-icon type="backWhite" @click.native="handleBack"/>
                </span>
            </c-header>
        </div>
        <div class="el-block-space"></div>
        <div class="c-view-content">
            
            <!-- 积分明细 -->
            <div class="m-points">
                <div class="el-left">Hi，累计签到积分：<number-grow :value="110"></number-grow></div>
                <div class="el-right">积分明细 <c-icon type="arrowRightWhite"/></div>
            </div>

            <!-- 签到区域 -->
            <div class="m-signin animated slideInUp">
                <div class="el-gonglv" @click="isShowGongLv = true">攻略</div>
                <div class="el-day"><em>0</em>天</div>
                <div class="el-subtitle">再连续签到<em>X</em>天可获翻倍积分</div>
                <div class="el-main">
                    <div class="el-seven-space">
                        <div class="el-seven-item">
                            <div class="el-item-area el-gold-s">
                                <img class="el-jifen" src="../../assets/images/jifen.png"/>
                            </div>
                        </div>
                        <div class="el-seven-item">
                            <div class="el-item-area el-gold-s">
                                <img class="el-jifen" src="../../assets/images/jifen.png"/>
                            </div>
                        </div>
                        <div class="el-seven-item">
                            <div class="el-double animated heartBeat delay-3s infinite-2">翻倍</div>
                            <div class="el-item-area el-gold-l">
                                <img class="el-jifen" src="../../assets/images/jifen2.png"/>
                            </div>

                        </div>
                        <div class="el-seven-item">
                            <div class="el-item-area el-gold-s">
                                <img class="el-jifen" src="../../assets/images/jifen.png"/>
                            </div>
                        </div>
                        <div class="el-seven-item">
                            <div class="el-item-area el-gold-s">
                                <img class="el-jifen" src="../../assets/images/jifen.png"/>
                            </div>
                        </div>
                        <div class="el-seven-item">
                            <div class="el-item-area el-gold-s">
                                <img class="el-jifen" src="../../assets/images/jifen.png"/>
                            </div>
                        </div>
                        <div class="el-seven-item el-seven-itemlash">
                            <div class="el-double animated heartBeat delay-3s infinite-2">翻倍</div>
                            <div class="el-item-area el-gold-l">
                                <img class="el-jifen" src="../../assets/images/jifen2.png"/>
                            </div>
                        </div>
                    </div>
                    <div class="el-progress">
                        <div class="el-progress-content"></div>
                    </div>
                    
                    <div class="el-seven">
                        <div class="el-seven-item">1天</div>
                        <div class="el-seven-item">2天</div>
                        <div class="el-seven-item">3天</div>
                        <div class="el-seven-item">4天</div>
                        <div class="el-seven-item">5天</div>
                        <div class="el-seven-item">6天</div>
                        <div class="el-seven-item el-seven-itemlash">7天</div>
                    </div>
                </div>
                <div class="el-btn">
                    <div class="el-btn-main animated flipInY delay-1s">{{btnText}}</div>
                </div>
            </div>
            
            <!-- 幸运抽奖 邀请有礼 -->
            <div class="m-lottery c-flex-row c-v-center">
                <div class="c-flex-item" v-for="(item, i) in lotteryData" :key="i" :style="`background-image: url(${item.bgImg})`"></div>
            </div>
            <!-- 精彩推荐 -->
            <div class="m-recommend">
                <div class="el-recommend-title">精彩推荐</div>
                <div class="c-flex-row c-v-center" v-for="(item, i) in recommendData" :key="i" >
                    <div class="c-flex-item"></div>
                    <div class="c-flex-item">
                        <div class="el-title">阳光贷款</div>
                        <div class="el-sub-title">资金周转  信用助力生活</div>
                    </div>
                    <div class="c-flex-item">
                        <mt-button
                        class="btn-round handle-button"
                        size="normal"
                        type="primary"
                        plain
                        @click.native="jump(item)"
                      >立即申请
                      </mt-button>
                    </div>
                </div>
            </div>
            <div class="el-block-space"></div>
        </div>

        <c-dialog :isShow="isShowGongLv" :opacity="0.67">
            <div class="m-content1 animated bounceInDown" slot="content">
                <div class="el-colse" @click="isShowGongLv = false">
                    <c-icon type="close"></c-icon>
                </div>
                <img class="el-top" src="../../assets/images/gl-top.png" />
                <img class="el-bottom" src="../../assets/images/gl-bottom.png" />
                <div class="el-main">
                    <div class="el-title">签到攻略</div>
                    <div class="el-content">
                        1、每日可参加签到，获取一次拆红包机会；<br>
                        2、可通过拆红包获得积分奖励，一次只能拆开一个红包；<br>
                        3、连续签到3天及连续签到7天可获得双倍积分奖励；<br>
                        4、不通过任何作弊行为套取奖励，经发现将扣除您通过该活动获取的所有奖励；<br>
                        5、活动最终解释权归极速熊猫所有。<br>
                    </div>
                </div>
            </div>
        </c-dialog>

        <c-dialog :isShow="isShowSuccess" :opacity="0.67">
            <div class="m-content2 animated bounceInDown" slot="content">
                <div class="el-main1">
                    <div class="el-colse" @click="isShowSuccess = false">
                        <c-icon type="close"></c-icon>
                    </div>
                    <img class="el-icon" src="../../assets/images/signin-suc.png" />
                    <div class="el-title">签到成功</div>
                    <div class="el-content">
                        获得 +10X2 积分，已连续签到 7 天
                    </div>
                </div>
                <div class="el-main2">
                    <!-- <img class="el-icon" src="../../assets/images/gl-top.png" /> -->
                </div>
            </div>
        </c-dialog>
    </div>
</template>

<script>
import util from "@/utils";
import cDialog from "@/components/view/dialog";
import numberGrow from "@/components/common/numberGrow";

export default {
  data() {
    return {
      headerOpacity: 1,
      headerRgba: 0,
      btnText: "重新开始签到",
      isShowSuccess: true, //签到成功显示
      isShowGongLv: false, //攻略显示
      lotteryData: [
        {
          bgImg: require("../../assets/images/lottery.png")
        },
        {
          bgImg: require("../../assets/images/invite.png")
        }
      ],
      recommendData: [{}, {}, {}]
    };
  },
  components: {
    cDialog,
    numberGrow
  },
  computed: {},
  methods: {
    handleBack() {
      this.$AppBridge.activityView({
        type: "close"
      });
    }
  },
  created() {
    //测试神策埋点
    //this.$root.sendShence("aaaaa");
  },
  mounted() {
    this.$root.loadingClose();
  }
};
</script>

<style lang="scss" scoped>
.m-top-bg {
  position: absolute;
  z-index: 0;
  background-image: linear-gradient(-35deg, #1d1b3c 6%, #352f55 100%);
  width: 100%;
  height: 383px;

  .el-bg-top {
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
  }
  .el-bg-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 152px;
  }
  .el-hudu {
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
  }
}

.m-header {
  position: fixed;
  width: 100%;
  z-index: 2;
  left: 0;
  top: 0;
  /deep/ .mint-header {
    border: 0 !important;
    .mint-header-title {
      color: white !important;
    }
  }
}
.el-block-space {
  width: 100%;
  height: 54px;
}

.m-points {
  margin-top: 8px;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  width: 100%;
  background-color: #524f6a;

  .el-left {
    color: #ebeaf1;

    em {
      color: #ee6723;
      font-size: 18px;
    }
  }
  .el-right {
    color: #ebeaf1;
  }
}

.m-signin {
  position: relative;
  box-sizing: border-box;
  height: auto;
  //   height: 259px;
  width: 343px;
  margin-top: 30px;
  margin-left: 16px;
  background-image: linear-gradient(
    -269deg,
    rgba(255, 255, 255, 0) 11%,
    rgba(255, 255, 255, 0) 41%,
    rgba(255, 255, 255, 0.13) 94%
  );
  background-image: url("../../assets/images/signin-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  text-align: center;

  .el-gonglv {
    background-image: url("../../assets/images/gonglv.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 46px;
    height: 26px;
    font-size: 12px;
    color: #fff;
    display: flex;
    justify-content: center;
    position: absolute;
    right: -5px;
    top: 17px;
    padding-top: 4px;
  }
  .el-day {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.71);
    letter-spacing: 0.42px;
    padding-top: 30px;
    margin: 0 auto;
    em {
      color: #fff;
      font-size: 36px;
      font-weight: 600;
      margin-right: 2px;
    }
  }
  .el-subtitle {
    font-size: 14px;
    color: #dfe0e8;
    margin-top: 14px;
    margin: 0 auto;
    em {
      color: #ee6723;
    }
  }

  .el-main {
    position: relative;
    width: 100%;
    padding: 0 16px;

    .el-progress {
      background: #20296c;
      box-shadow: inset 0 0 5px 0 rgba(0, 0, 0, 0.37);
      border-radius: 4.5px;
      border-radius: 4.5px;
      height: 6px;
      width: 100%;

      .el-progress-content {
        border-radius: 4.5px;
        border-radius: 4.5px;
        height: 100%;
        width: 46px;
        background: #ffdd31;
      }
    }
    .el-seven-space {
      font-size: 12px;
      color: #ffffff;
      height: 60px;
      margin-top: 6px;
      display: flex;
      align-items: flex-end;
      position: relative;
      bottom: -10px;

      .el-seven-item {
        width: 46px;
        text-align: left;
        float: left;
        .el-double {
          position: relative;
          background: #f95f61;
          width: 38px;
          font-size: 12px;
          color: #ffffff;
          text-align: center;
          border-radius: 2px;
          margin-bottom: 5px;

          &::after {
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #f95f61;
            content: "";
            position: absolute;
            width: 0;
            left: 15px;
            bottom: -4px;
          }
        }
        .el-item-area {
          overflow: hidden;
          border-radius: 50%;
          background: #1c2561;
          box-shadow: inset 0 0 9px 0 rgba(0, 0, 0, 0.57);

          &.el-gold-s {
            height: 20px;
            width: 20px;
          }
          &.el-gold-l {
            height: 36px;
            width: 36px;
          }
        }
        .el-jifen {
          width: 100%;
        }
      }
      .el-seven-itemlash {
        width: 34px !important;
      }
    }
    .el-seven {
      display: flex;
      width: 100%;
      margin-top: 6px;

      .el-seven-item {
        width: 46px;
        font-size: 12px;
        color: #ffffff;
        text-align: left;
      }
      .el-seven-itemlash {
        width: 34px !important;
      }
    }
  }
  .el-btn {
    position: relative;
    text-align: center;
    margin-top: 19px;
    padding-bottom: 19px;
    .el-btn-main {
      margin: 0 auto;
      width: 222px;
      height: 48px;
      background-image: url("../../assets/images/signin-btn.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      font-size: 16px;
      color: #ffffff;
      padding-top: 9px;
    }
  }
}

.m-lottery {
  padding: 30px 16px;
  background-color: #fff;
  .c-flex-item {
    height: 72px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    &:nth-child(odd) {
      margin-right: 3px;
    }
    &:nth-child(even) {
      margin-left: 4px;
    }
  }
}
.m-recommend {
  background-color: #fff;
  .el-recommend-title {
    padding: 11px 16px;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #333333;
  }
  .c-flex-row {
    margin: 8px 16px 0 16px;
    background: #ffffff;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    border-radius: 4px;
    background-image: url("../../assets/images/recommend-bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 80px;
    padding: 16px 0;

    .c-flex-item {
      height: 100%;
      text-align: left;

      .el-title {
        font-size: 16px;
        color: #333333;
      }
      .el-sub-title {
        margin-top: 2px;
        font-size: 12px;
        color: #999999;
      }

      &:first-child {
        padding: 0 8px 0 16px;
        width: 70px;
        flex: none;
      }

      &:last-child {
        width: 111px;
        flex: none;
      }

      /deep/ .mint-button {
        height: auto !important;
        padding: 8px 12px;
        font-size: 14px;
        color: #ffffff;
        background: #4e67ff;
        border: 0;
        box-shadow: 0 2px 20px 0 rgba(78, 103, 255, 0.3);
      }
    }
  }
}

.component-dialog {
  .m-content1 {
    background-color: #fff;
    width: 310px;
    height: 310px;
    border-radius: 4px;
    position: absolute;
    top: 160px;
    .el-colse {
      position: absolute;
      z-index: 2;
      right: 20px;
      top: 20px;
      .icon-close {
        width: 23px !important;
        height: 23px !important;
      }
    }
    .el-top {
      position: absolute;
      top: 0;
      right: 0;
      width: 96px;
      height: 114px;
    }
    .el-bottom {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 60px;
      height: 48px;
    }
    .el-main {
      padding: 18px 20px;
      .el-title {
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #333333;
        &::after {
          background: #ff9f0a;
          display: block;
          margin-top: 2px;
          width: 18px;
          height: 3px;
          content: "";
          border-radius: 2px;
          border-radius: 2px;
        }
      }
      .el-content {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        margin-top: 29px;
        letter-spacing: 0.42px;
        line-height: 20px;
      }
    }
  }
  .m-content2 {
    text-align: center;
    .el-main1 {
      padding: 18px;
      width: 310px;
      height: 240px;
      border-radius: 8px;
      border-radius: 8px;
      background-color: #fff;
      .el-icon {
        width: 110px;
        margin-top: -25px;
      }
      .el-colse {
        text-align: right;
        .icon-close {
          width: 23px !important;
          height: 23px !important;
        }
      }
      .el-title {
        font-size: 18px;
        color: #333333;
        font-weight: bold;
      }
      .el-content {
        margin-top: 9px;
        font-size: 14px;
        color: #666666;
      }
    }
    .el-main2 {
      width: 310px;
      height: 80px;
      border-radius: 8px;
      border-radius: 8px;
    }
  }
}
</style>

