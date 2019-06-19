<template>
  <div class="loading">
    <!--跳金币-->
    <div class="bg">
      <img src="~@/assets/images/loading/1@2x.gif" alt>
      <p>
        <span class="c-red">额度</span>计算中
      </p>
    </div>

    <!--流程动画-->
    <div class="step-info">
      <div class="wrap">
        <ul id="J_ul" :style="{transform: 'translateY(' + positionY + '%)'}">
          <li
            class="loading-item"
            v-for="(item, key) in list"
            :key="key"
            :class="{'complete' : key <= index , 'checking': (key === list.length-1 && index === key) || key === index + 1}"
          >
            <div class="loading-grid c-tl c-relative">
              <span class="loading-icon c-absolute"></span>
              <span class="loading-line c-absolute"></span>
              <span class="loading-text">
                <span>{{item}}</span>
                <span v-if="key === index + 2">检测中……</span>
                <span v-if="key === index + 1 || key===list.length-1">准备</span>
                <span v-else>完成</span>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!--流程进度条-->
    <div class="step-bar c-relative">
      <!--流程进度条 百分比线显示-->
      <div class="percent-redLine" :style="{width: percent + '%'}"></div>

      <!--流程进度条 百分比文字显示-->
      <div class="percent-text c-absolute c-font-m c-right">{{percent}}%</div>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator,MessageBox } from "@/utils/helper";

import api from "@/services/api.js";
import helper from "@/utils/helper";
import EventBus from "@/services/EventBus";

export default {
  name: "loading",
  data() {
    return {
      /**
       * 9.0909, 是每条数据占用列表总高度的比率
       * 一条数据高度为30px, 11条数据则为330
       * 9.0909 =  (30 / (30 * 11)) * 100
       * */
      listHeightPercent: 12.5,
      // 流程动画列表偏移量
      positionY: 12.5,
      // 流程动画标识指当前检测到哪一条信息
      index: -1,
      list: [
        "身份信息",
        "人脸识别",
        "联系人信息",
        "学历信息",
        "单位信息",
        "婚姻信息",
        "地址信息",
        "综合信用"
      ],
      percent: 0
    };
  },

  methods: {
    startMatch() {
      // Toast(`触发商户引擎`);
      api.loan
        .matchProduct()
        .then(e => {
          //商户引擎触发
          console.log(JSON.stringify(e));
          if (e.code == 200 || e.code == 620002 || e.code == 620001) {
            this.animationTransfrom();
            setTimeout(this.queryMatchResult, 6000);
          } else {

                // Toast(e.msg);
              this.errorAction(e.msg || "系统繁忙，请稍后再试")

          }
        })
        .catch((e) => {
            this.errorAction("系统繁忙，请稍后再试")
        });
    },

    errorAction(e) {
      //this.$root.openUrl(`${process.env.staticPath}/pages/home/index.html#/livingBodyAction`)
      MessageBox({
        title: "温馨提示",
        message:e,
        confirmButtonText: "确定",
        closeOnClickModal: false
      }).then(action => {
        console.log("===========>");

          this.$AppBridge.notify({tag: "home"});
        this.$root.backHome();
      });
    },

    queryMatchResult() {
      api.loan
        .matchResult()
        .then(res => {
          if (Number(res.code) === 200) {
            Indicator.close();
            // Todo
            this.animationEnd();
            setTimeout(() => {
              // 返回首页
              if (res.data.url.indexOf("#/recommend") > 0) {
                this.$root.backHome();
              } else {
                this.$root.replaceUrl(res.data.url, res.data);
              }
            }, 1000);
          } else {
            setTimeout(this.queryMatchResult, 6000);
          }
        })
        .catch(() => {
          setTimeout(this.queryMatchResult, 6000);
        });
    },
    init(from) {
      EventBus.$off("back");
      this.initWeb();
      this.startMatch();
    },
    initWeb() {
      this.$root.setWebAttribute({
        intercept: true
      });
    },
    animationTransfrom() {
      this.loadingTimer = setTimeout(() => {
        // 9.0909 每格所占比率
        this.index++;

        this.percent = Math.floor((this.index / this.list.length) * 100);
        // 执行到最后一个
        if (this.index < this.list.length - 1) {
          this.positionY -= this.listHeightPercent;
          this.animationTransfrom();
        }
      }, 1000);
    },
    animationEnd() {
      clearTimeout(this.loadingTimer);
      this.index = this.list.length;
      this.percent = 100;
      this.positionY = -((this.list.length - 2) * this.listHeightPercent);
    }
  },
  created() {
    this.init();
    this.animationTransfrom();
  },
  beforeRouteEnter(to, from, next) {
    // 导航进入该组件时调用
    // 不！能！获取组件实例 `this`
    // 因为组件实例还没被创建

    next(vm => {
      // 通过 `vm` 访问组件实例
      // vm.init(from)
    });
  },
  mounted() {
    // DOM ready
    this.$root.loadingClose();
  }
};
</script>

<style lang="scss" scoped>
.loading {
  .bg {
    width: 100%;
    height: 230px;
    background: url("~@/assets/images/loading/loadingbg@2x.png") no-repeat;
    background-size: contain;
    text-align: center;
    img {
      width: 220px;
      height: 220px;
    }
    p {
      font-size: 24px;
      text-align: center;
      // margin-top: 200px;
    }
  }
  .step-info {
    width: 310px;
    height: 130px;
    background: url("~@/assets/images/loading/bg@2x.png") no-repeat;
    background-size: contain;
    margin: 40px auto 16px;
    overflow: hidden;
    padding: 20px 30px;
    .wrap {
      // padding: 30px;
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    ul {
      // height: 100px;
      z-index: 1;
      /*animation: goTop 6s forwards;*/
      overflow: hidden;
      transition: 0.3s ease-in;
      .loading-item {
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        color: #564f59;
        .loading-grid {
          display: inline-block;
          height: 100%;
          width: 60%;

          .loading-text {
            padding-left: 24px;
          }

          .loading-icon {
            display: inline-block;
            width: 15px;
            height: 15px;
            top: 50%;
            margin-top: -7.5px;
            background-image: url("~@/assets/images/home/loading_ready@3x.png");
            background-color: #ffffff;
            background-repeat: no-repeat;
            background-size: cover;
            z-index: 2;
          }

          .loading-line {
            width: 2px;
            height: 100%;
            top: 0;
            left: 6px;
            background: linear-gradient(180deg, #cccccc 50%, #ffffff 50%);
            z-index: 1;
          }
        }

        &.complete {
          .loading-icon {
            background-image: url("~@/assets/images/home/loading_complete@3x.png");
          }

          .loading-line {
            background: #e8c096;
          }
        }
        &.checking {
          .loading-icon {
            background-image: url("~@/assets/images/home/loading_checking@3x.png");
          }

          .loading-line {
            background: linear-gradient(180deg, #e8c096 50%, #cccccc 50%);
          }
          &:last-child .loading-line {
            background: linear-gradient(
              180deg,
              #e8c096 50%,
              #ffffff 50%
            ) !important;
          }
        }
        &:first-child {
          .loading-line {
            background: linear-gradient(180deg, #ffffff 50%, #e8c096 50%);
          }

          &.checking {
            .loading-line {
              background: linear-gradient(180deg, #ffffff 50%, #cccccc 50%);
            }
          }
        }
        &:last-child {
          .loading-line {
            background: linear-gradient(180deg, #cccccc 50%, #ffffff 50%);
          }
          &.complete {
            .loading-line {
              background: linear-gradient(180deg, #e8c096 50%, #fff 0);
            }
          }
        }
      }
    }
  }
  .step-bar {
    margin: 0 auto;
    width: 280px;
    height: 4px;
    background: #efefef;
    border-radius: 20px;
    .percent-redLine {
      background: #e72427;
      width: 0%;
      transition: width 0.4s linear;
      height: 100%;
      border-radius: 20px;
    }

    .percent-text {
      top: 6px;
      color: #726c73;
    }
  }
}
@keyframes goTop {
  0% {
    transform: translateY(0);
  }
  16% {
    transform: translateY(-16%);
  }
  32% {
    transform: translateY(-32%);
  }
  48% {
    transform: translateY(-48%);
  }
  64% {
    transform: translateY(-64%);
  }
  80% {
    transform: translateY(-80%);
  }
  100% {
    transform: translateY(-88%);
  }
}
</style>
