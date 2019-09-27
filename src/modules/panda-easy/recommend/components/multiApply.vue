<template lang="html">
    <!-- 一键申请  -->
    <div class="multi-apply-wrap" v-if="countMoney > 0">
        <div class="title">更多额度</div>
        <div class="multi-apply-img c-flex-row">
            <!-- <img class="right-brigde" src="../../images/getTrust-right-brigde.png"/> -->
            <div class="c-col-60">
                <div class="sub-title">
                    <img src="../../images/zhuanshu.png"/>
                    <span>专属快速提额通道</span>
                </div>
                <div class="desc">￥{{countMoney}}</div>
            </div>
            <div class="c-col-40">
                <mt-button class="btn-round handle-button" size="normal" type="primary" @click.native="apply">快速提额</mt-button>
            </div>
        </div>

    </div>

</template>

<script>
import helper from "@/utils/helper";

export default {
  props: ["resdata"],
  data() {
    return {
        countMoney: 0
    };
  },
  computed: {
    data() {
      return this.resdata.resecondproducts;
    },
    url() {
      return this.resdata.onekeyapplypage;
    },
    titleColor() {
      let { newcards, applyproducts } = this.resdata;
      return (!newcards || !newcards.length) &&
        (!applyproducts || !applyproducts.length)
        ? "white"
        : "";
    }
  },
  components: {},
  methods: {
    apply() {
      this.$root.openUrl(this.url, this.resdata);
    }
  },
  mounted() {
    if (this.resdata.resecondproducts) {
        let count = 0;
      this.resdata.resecondproducts.forEach(item => {
        count += item.maxamount
      });
      this.countMoney = count;
    }
  },
  filters: {
    amount(value) {
      if (value < 10000) {
        return value;
      } else {
        value = (value / 10000).toFixed(1).replace(".0", "");
        return value + "万";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.c-list-title {
  &.white {
    color: white;
  }
}
.multi-apply-wrap {
  overflow: hidden;
  background: white;

    .title {
        font-size: 20px;
        color: #333333;
        padding: 12px 16px 0 16px;
    }

  .multi-apply-img {
    position: relative;
    padding: 16px;
    margin: 16px;
    height: 100px;
    
    background: url("../../images/getTrust-bg.png") no-repeat;
    background-size: 100% 100%;
    text-align: left;

    .c-col-40 {
        padding-top: 20px;
        text-align: right;
    }
    .right-brigde {
      width: 48px;
      height: 48px;
      position: absolute;
      right: 0;
      top: 0;
    }
    img {
      width: 100%;
      height: auto;
    }

    .sub-title {
        img {
            height: 24px;
            width: 24px;
            content: normal !important;
            vertical-align: middle;
        }
        span {
            //vertical-align: inherit;
        }
        font-size: 16px;
        color: #333333;
        letter-spacing: -0.46px;
        letter-spacing: 1px;
        text-align: left;
    }
    .desc {
      font-size: 30px;
        color: #333333;
      letter-spacing: 1px;
      line-height: 33px;
    text-align: left;
    margin-left: -4px;
    margin-top: 4px;
    }

    .handle-button {
      background: #EB242A;
      border-radius: 15px;
      width: 102px;
      height: 32px;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 1.17px;
    }
  }
}
</style>
