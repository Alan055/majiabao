<template>
  <em ref="numberGrow" :data-time="time" class="number-grow" :data-value="value">0</em>
</template>

<script>
export default {
  props: {
    time: {
      type: Number,
      default: 2
    },
    value: {
      type: Number,
      default: 720000
    },
    speed: {
      type: Number,
      default: 5
    }
  },
  methods: {
    numberGrow(ele) {
      let _this = this;

      let step = (_this.value * 10) / (_this.time * 1000);
      let current = 0;
      let start = 0;
      let t = setInterval(function() {
        start += step;
        if (start > _this.value) {
          clearInterval(t);
          start = _this.value;
          t = null;
        }
        if (current === start) {
          return;
        }
        current = start.toFixed(0);
        ele.innerHTML = current
          .toString()
          .replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, "$1,");
      }, this.speed);
    }
  },
  mounted() {
    this.numberGrow(this.$refs.numberGrow);
  }
};
</script>

<style lang="scss" scoped>
em {
  line-height: 1;
}
.number-grow-warp {
  transform: translateZ(0);
}
</style>
