<template lang="html">
    <div class="c-flex-row ">

        <!--progress-wrap <div class="c-flex-item">
            <div class="progress" v-for="(item, i) in progressWidth" :key="i"></div>
        </div> -->

    </div>
</template>

<script>
;
export default {
  props: ["step"],
  methods: {
    progressWidth() {
      console.log(
        "设置的图片地址",
        process.env.kingPath +
          "/pages/panda/static/icon/publicInfo/step" +
          [3, 2, 1][this.step - 1] +
          ".png"
      );
      this.$AppBridge.setWebTitleAttribute({
        btnType: "img",
        btnVal:
          process.env.kingPath +
          "/pages/panda/static/icon/publicInfo/step" +
          [3, 2, 1][this.step - 1] +
          ".png"
      });
    }
  },
  created() {
    this.progressWidth();
  }
};
</script>

<style lang="scss" scoped>
.progress-wrap {
  height: 4px;
  background-color: #ccc;
}

.c-flex-item {
  display: flex;

  .progress {
    background: #ffca00 !important;
    height: 4px;
    width: 33.33334%;
  }
}
</style>
