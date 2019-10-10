<template lang="html">
    <!-- 一键申请  -->
    <div class="multi-apply-wrap" v-if="countMoney">
        <div class="multi-apply-img">
            <div class="el-title">可申请额度（元）</div>
            <div class="el-sub-title">{{countMoney}}</div>
            <mt-button class="btn-round handle-button" size="normal" type="primary" @click.native="apply">我要借款</mt-button>
        </div>
    </div>
</template>

<script>
import helper from "@/utils/helper";
import utils from "@/utils/index.js";



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
        count += item.maxamount;
      });
      this.countMoney = count? utils.moneyFormat(count) : count;
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
  margin-bottom: 0 !important;
  .title {
    font-size: 20px;
    color: #333333;
    padding: 12px 16px 0 16px;
  }

  .section-title {
    padding-left: 16px;
    border: 0;
  }
  .multi-apply-img {
    position: relative;
    padding: 16px 16px 0 ;
    margin: 0 16px;
    height: 165px;
    background: url("../../../assets/images/multi-apply-img.png") no-repeat;
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
    .el-title {
      display: block;
      text-align: center;
      font-size: 12px;
      color: #333;
    }
    .el-sub-title {
      display: block;
      text-align: center;
      margin-top: 14px;
      font-size: 30px;
      color: #333;
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
      display: block;
      text-align: center;
      margin: 0 auto;
      border-radius: 15px;
      margin-top: 14px;
      width: 274px;
      height: 44px;
      font-size: 16px;
      color: #fff;
      background-image: linear-gradient(-89deg, #edc882 0%, #bd8729 100%);
      box-shadow: 0 8px 16px 0 rgba(194, 141, 50, 0.3);
      border-radius: 24px;
    }
  }
}
</style>
