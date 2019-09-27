<template lang="html">
    <div class="view">
        <div class="c-view-content">
          <div class="box">
            <div class="m-banner">
              <img src="../images/friends_bg.png"/>
            </div>
            <div class="m-section section-one">
              <div class="el-title"><img src="./../images/friendLiftIcon.png" alt="">邀请注册 奖<em class="el-red-color">10</em>元<img src="./../images/friendRightIcon.png" alt=""></div>
              <div class="el-sub-title">每成功邀请一位好友注册且实名，您可获得10元免息红包奖励</div>
            </div>
            <div class="m-section section-two">
              <div class="el-title"><img src="./../images/friendLiftIcon.png" alt="">好友借款 奖<em class="el-red-color">50</em>元<img src="./../images/friendRightIcon.png" alt=""></div>
              <div class="el-sub-title">好友注册成功后30天内完成首笔借款，您可获得<em>50元</em>免息红包</div>
            </div>
            <div class="m-section section-three" style="margin-bottom: 30px;">
                 <div class="el-title"><img src="./../images/friendLiftIcon.png" alt="">排行榜<img src="./../images/friendRightIcon.png" alt=""></div>
                 <div class="el-table">
                     <div class="c-flex-row el-title tab-title">
                         <div class="c-col-43">用户名</div>
                         <div class="c-col-33">奖励总额(元)</div>
                         <div class="c-col-23">邀请好友数</div>
                     </div>
                     <div class="c-flex-row el-content tab-content" v-for="(item, i) in data" :key="i">
                         <div class="c-col-43 el-tel">{{item.tel}}</div>
                         <div class="c-col-33 el-number">{{item.number}}</div>
                         <div class="c-col-23 el-count">{{item.count}}</div>
                     </div>
                      <div class="nodata" v-if="!data.length">
                        暂无数据
                      </div>
                 </div>
             </div>
            <div class="m-btn">
              <mt-button
                class="btn-round handle-button"
                size="normal"
                type="primary"
                plain
              >活动暂未开始
              </mt-button>
            </div>
          </div>
        </div>

        <Popup :value="isShow" @maskingClose="maskingClose">
      <!--  <Popup :value="true" @maskingClose="maskingClose">-->

            <div class="friends-rule" slot="content">
                <i class="close" @click="maskingClose">×</i>
                <div class="el-title">活动规则</div>
                <div class="el-content">
                    1、活动时间：2019年8月06日至2019年9月06日；<br>
                    2、邀请流程：邀请人分享链接给好友，好有完成注册侧邀请成功；<br>
                    3、邀请奖励：<br>
                    1）好友完成注册且实名，邀请人可获得10元免息券奖励；<br>
                    2）好友注册成功后，30天内完成借款，邀请人可获得50元免息券。<br>
                    4、如有作弊，则平台有权收回相应奖励，活动最终解释权归极速熊猫贷款所有。
                </div>
            </div>
        </Popup>
    </div>

</template>

<script>
import Popup from "@/components/view/popup";
import { Toast } from "@/utils/helper";

export default {
  data() {
    return {
      isShow: false,
      data: [
      ]
    };
  },
  components: {
    Popup
  },
  methods: {
    maskingClose() {
      this.isShow = false;
    },
    handleBtnClick() {
      //Toast("活动已结束");
      Toast("活动未开始");
    }
  },
  mounted() {
    // 设置右上角
    this.$AppBridge.setWebTitleAttribute(
      {
        btnType: "text",
        btnVal: "活动规则"
      },
      () => {
        this.isShow = true;
      }
    );
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  },
  filters: {}
};
</script>

<style scope lang="scss">
.c-view-content {
  >.box{
    overflow: hidden;
    position: relative;
  }
}

.friends-rule {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  width: 300px;
  position: relative;

  i.close {
    width: 24px;
    height: 24px;
    border-radius: 24px;
    display: block;
    margin: 0px auto;
    z-index: 4;
    position: absolute;
    text-align: center;
    color: #030303;
    font-size: 20px;
    font-weight: 100;
    line-height: 22px;
    right: 11.3px;
    top: 11.3px;
  }

  .el-title {
    //@extend %border-b;
    border: none !important;
    font-size: 16px;
    padding-bottom: 10px;
    text-align: center;
    position: relative;
    margin-bottom: 8px;

    &:before {
      background: #333333;
      width: 64px;
      height: 4px;
      content: " ";
      position: absolute;
      bottom: 0px;
    }
  }
  .el-content {
    padding: 15px 22px;
    line-height: 1.7;
    font-size: 14px;
    color: #333333;
  }
}

.m-banner {
  height: 500px;
  position: relative;
  img {
    position: absolute;
    width: 100%;
    left: 0 ;
    top: 0;
  }
}

.m-section {
  position: relative;
  background: #ffffff;
  box-shadow: 0 4px 10px 0 rgba(144, 103, 213, 0.27);
  border-radius: 6px;
  margin: 0 16px;
  padding: 34px 16px;
  margin-bottom: 20px;
  .el-red-color {
    color: #e02020;
    font-size: 32px;
    margin: 0 4px 8px 4px;
  }
  &.section-one {
    margin-top: -40px;
  }

  .el-title {
    font-size: 20px;
    color: #333333;
    text-align: center;
    line-height: 25px;
    margin-bottom: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      width: 38px;
      &:first-child{
        margin-right: 4px;
      }
      &:last-child{
        margin-left: 4px;
      }
    }
  }
  .el-sub-title {
    font-size: 14px;
    color: #666666;
  }

  .el-table {
    text-align: left;
    background: #fff2f1;
    border-radius: 4px;
    overflow: hidden;
    .el-title {
      background: #ff695e;
      font-size: 14px;
      color: #fff;
      padding: 10px;
      text-align: left;
      height: 40px;
    }
    .el-content {
      font-size: 14px;
      padding: 8px 10px;
      text-align: left;

      .el-tel {
        color: #666666;
      }
      .el-number {
        color: #fe632b !important;
      }
      .el-number {
        color: #666666;
      }
    }
    .nodata{
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fd9743;
      font-size: 14px;
    }
  }
}

.handle-button {
  background-image: linear-gradient(to bottom, #ffcf66 0%, #ffa44c 100%);
  box-shadow: 0 0 0 0 rgba(194, 141, 50, 0.3);
  font-size: 18px;
  color: #ff695e !important;
  border: 0 !important;
  width: 100%;
  border-radius: 0;
  height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
}

.tab-title {
  padding: 0 !important;
  div {
    font-size: 14px;
    &:nth-child(1) {
      text-indent: 12px;
    }

    &:nth-child(2) {
      text-indent: 2px;
    }
  }
}

div.tab-content {
  div.el-count {
    padding-left: 3px;
  }
}

.c-col-43 {
  width: 38%;
}

.c-col-23 {
  width: 25%;
}
</style>
