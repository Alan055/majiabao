<template lang="html">
    <!-- 一键申请  -->
    <div class="multi-apply-wrap" v-if="countMoney > 0">
        <div class="multi-apply-img c-flex-row c-v-center">
            <div class="c-col-65">
                <div class="el-title">专属分期额度（元）</div>
                <div class="el-sub-title">{{countMoney}}</div>
            </div>
            <div class="c-col-35">
                <mt-button class="btn-round handle-button" size="normal" type="primary" @click.native="apply">立即使用</mt-button>
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
        count += item.maxamount;
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

  .section-title {
    padding-left: 16px;
    border: 0;
  }
  .multi-apply-img {
    position: relative;
    padding: 16px;
    margin: 0 16px;
    height: 120px;
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
      font-size: 12px;
      color: #ffffff;
    }
    .el-sub-title {
      font-size: 30px;
      color: #ffffff;
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
      border-radius: 15px;
      width: 102px;
      height: 32px;
      font-size: 14px;
      color: #4586ee;
      letter-spacing: 1.17px;
      background: #ffffff !important;
      border-radius: 4px !important;
    }
  }
}
</style>
