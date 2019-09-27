<template lang="html">
    <!-- 一键申请  -->
    <div class="multi-apply-wrap" v-if="countMoney > 0">

        <div class="multi-apply-img">
            <img class="right-brigde" src="../../../assets/images/getTrust-right-brigde.png"/>
            <div class="c-flex-row c-v-center">
                <div class="c-col-60">
                    <div class="title">预估可提高额度</div>
                    <div class="desc">￥{{countMoney}}</div>
                </div>
                <div class="c-col-40">
                    <mt-button class="btn-round handle-button" size="normal" type="primary" @click.native="apply">快速提额</mt-button>
                </div>
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
  padding: 10px 13px;
  overflow: hidden;
  background: white;


  .multi-apply-img {
      position: relative;
    height: 129px;
    width: 100%;
    background: url("../../../assets/images/getTrust-bg.png") no-repeat;
    background-size: cover;
    padding: 32px 12px 0px 22px;
    text-align: left;

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

    .title {
      font-size: 18px;
      color: #353241;
      letter-spacing: 1px;
    text-align: left;
    }
    .desc {
      font-size: 24px;
      color: #5882ff;
      letter-spacing: 1px;
      line-height: 33px;
    text-align: left;
    margin-left: -4px;
    margin-top: 4px;
    }

    .handle-button {
      background: #5882ff;
      box-shadow: 0 2px 4px 0 rgba(88, 130, 255, 0.4);
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
