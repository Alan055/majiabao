<template lang="html">
  <div class="c-view c-view-content page-no-data" v-min-height>
    <div class="el-pagenodata-img" :style="`top: ${top};`" v-if="imgUrl">
        <img :style="`width: ${width}px;`" :src="imgUrl"/>
    </div>
    <div class="el-pagenodata-text">{{text}}</div>
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
    },
    width: {
      type: String,
      default: "128"
    },
    top: {
      type: String,
      default: "-65%"
    }
  }
};
</script>

<style lang="scss" scoped>
.page-no-data {
  @include center-flex();

  .el-pagenodata-img {
    margin-top: -65%;
    width: 128px;
    height: auto;
    img {
      display: block;
      margin: 0 auto;
      width: 100%;
      height: auto;
    }
  }
  .el-pagenodata-text {
    font-family: PingFang-SC-Regular;
    font-size: 14px;
    color: #9e9e9e;
    letter-spacing: 0.08px;
    text-align: center;
  }
}
</style>

