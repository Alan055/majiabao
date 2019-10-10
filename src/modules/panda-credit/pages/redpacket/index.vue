<template lang="html">
    <div style="overflow: hidden">
        <van-tabs v-model="active">
            <van-tab title="未使用"></van-tab>
            <van-tab title="已使用"></van-tab>
            <van-tab title="已过期"></van-tab>
        </van-tabs>
        <no-data
            :imgUrl="require('../../assets/images/no-red.png')"
            text="暂无可用奖励"
        ></no-data>
    </div>
</template>

<script>
import noData from "@/components/common/noData";

export default {
  data() {
    return {
      active: 0
    };
  },
  components: {
    noData
  },
  methods: {},
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  },
  filters: {}
};
</script>
<style lang="scss" scoped>

    /deep/ .van-tab--active{
        color: #4586EE !important;
        font-weight:normal;
    }

/deep/ .van-tabs__line {
  background: #4586ee !important;
  height: 1px;
}
</style>
