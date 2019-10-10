<template lang="html">
    <!-- 一键申请  -->
    <div class="multi-apply-wrap" v-if="countMoney > 0">
        <div class="section-title">钱包提额</div>
        <div class="multi-apply-img">
            <div class="sub-title">你的钱包预计还有{{countMoney}}元现金</div>
            <mt-button class="btn-round handle-button" size="normal" type="primary" @click.native="apply">钱包提额</mt-button>
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

    .section-title {
        padding-left: 16px;
        border: 0;
    }
    .multi-apply-img {
        position: relative;
        padding: 24px;
        margin: 0 16px;
        height: 120px;
        background: url("../../../assets/images/multi-apply-img.png") no-repeat;
        background-size: 100% 100%;
        text-align: center;

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
            text-align: center;
            font-size: 20px;
            color: #FFFFFF;
            img {
                height: 24px;
                width: 24px;
                content: normal !important;
                vertical-align: middle;
            }
            span {
                //vertical-align: inherit;
            }
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
            margin-top: 16px;
            border-radius: 15px;
            width: 102px;
            height: 32px;
            font-size: 14px;
            color: #FF7D4E;
            letter-spacing: 1.17px;
            background: #FFFFFF !important;
            box-shadow: 0 2px 10px 0 rgba(235,36,42,0.20) !important;
            border-radius: 18px !important;
        }
    }
}
</style>
