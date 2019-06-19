<template lang="html">
    <!-- 三级商户，线下大额贷款 -->
    <div class="model offline-wrap" v-if="data">
        <div class="offline-content" @click="$root.openUrl({url: data.nextpage.url, isFull: true}, resdata)">

        </div>
    </div>
</template>

<script>
export default {
  props: ["resdata"],
  data() {
    return {};
  },
  computed: {
    resecondproducts() {
      let count = 0;
      this.resdata.resecondproducts.forEach(item => {
        count += item.maxamount;
      });
      return count <= 0;
    },
    data() {
      return this.resdata.thirdproducts;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/sass/variables";
.offline-wrap {
  background: #ffffff;
  padding: 10px 16px 0 16px;
}
.title {
  font-size: 20px;
  color: #333333;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  margin-top: 10px;
}

.offline-content {
  border-radius: 8px;
  height: 90px;
  background: url("../../../assets/images/offline-content.png") no-repeat;
  background-size: 100% 100%;

  .el-btn {
    text-align: right;
  }
  .moeny {
    font-size: 29px;
    color: #444444;
    letter-spacing: 1px;
    text-align: left;
  }

  .desc {
    font-size: 14px;
    color: #999;
    letter-spacing: 0.78px;
    text-align: left;
  }

  .step3 {
    margin-top: 17px;
    border-top: 1px dashed #ededed;
    border-radius: 4px;
    height: 40px;
    text-align: justify;

    img {
      height: 18px;
      width: 18px;
      display: inline-block;
      vertical-align: text-bottom;
    }
  }

  .mint-button--primary {
    background: $base-color;
    border-radius: 16px;
    color: #fff;
    height: 32px;
    width: 72px;
    font-size: 14px;
    letter-spacing: 0.78px;
    margin-top: 14px;
  }
}

.model {
  img {
    width: 100%;
    display: block;
    margin: 0 auto;
  }
}
.section-title {
  border: 0;
}
</style>
