<template lang="html">
    <!-- 三级商户，线下大额贷款 -->
    <div class="model offline-wrap" v-if="data">
        <div class="offline-content" @click="$root.openUrl({url: data.nextpage.url, isFull: false}, resdata)"></div>
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
.offline-wrap {
  padding: 0 16px;

}
.title {
  font-size: 20px;
  color: #333333;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  margin-top: 10px;
}

.offline-content{
  margin: 14px 0;
  border-radius: 8px;
  height: 90px;
  background: url("../../images/offline-content1.png") no-repeat;
  background-size: 100% 100%;
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
