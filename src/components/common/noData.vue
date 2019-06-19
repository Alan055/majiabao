<template lang="html">
    <div class="c-view c-view-content page-no-data" v-min-height>
        <div class="no-data-img" v-if="imgUrl"><img :src="imgUrl"/></div>
        <div class="no-data-text">{{text}}</div>
    </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      defalut: "暂无数据"
    },
    imgUrl: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
.page-no-data {
  @include center-flex();

  .no-data-img {
    margin-top: -65%;
    width: 128px;
    height: auto;

    img {
      height: 100%;
      display: block;
      margin: 0 auto;
      width: 100%;
    }
  }
  .no-data-text {
    font-family: PingFang-SC-Regular;
    font-size: 14px;
    color: #9e9e9e;
    letter-spacing: 0.08px;
    text-align: center;
  }
}
</style>

