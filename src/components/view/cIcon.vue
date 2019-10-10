<template lang="html">
  <img class="c-icon" :class="className" :src="src" alt="">
</template>

<script>
const lib = {
  back: require("@/assets/images/login/ad_cj@2x.png"),
  backWhite: require("@/assets/images/money/ad_co@2x.png"),
  enter: require("@/assets/images/my/home/ae_cj@2x.png"),
  close: require("@/assets/images/login/ac_cl@2x.png"),
  clear: require("@/assets/images/login/aa_cl@2x.png"),
  arrowUp: require("@/assets/images/my/bank/aa_gj@2x.png"),
  arrowDown: require("@/assets/images/my/bank/ab_gj@2x.png"),
  arrowLeft: require("@/assets/images/login/ad_cj@2x.png"),
  arrowRight: require("@/assets/images/my/home/ae_cj@2x.png"),
  arrowRightWhite: require("@/assets/images/icon/icon-arrow-right.png")
};
export default {
  props: ["type", "path"],
  computed: {
    src() {
      if (this.type) {
        return lib[this.type];
      }
      // 动态依赖会把整个文件夹加载进来
      // if(this.path) {
      //   return require(`@/assets/images/${this.path}@2x.png`)
      // }
    },
    className() {
      if (this.type) {
        return "icon-" + this.type;
      }
      // if(this.path) {
      //   return 'icon-' + this.path.replace(/.*\//,'')
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
.c-icon {
  @include size(16px);
}
.icon-arrowUp,
.icon-arrowDown,
.icon-arrowLeft,
.icon-arrowRight {
  @include size(12px);
}
.icon-arrowUp {
  top: 2px;
}
.icon-arrowDown {
  top: -3px;
}
</style>
