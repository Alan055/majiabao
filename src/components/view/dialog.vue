<template lang="html">
    <transition name="fade">
        <div class="component-dialog"
            :style="`background: rgba(0, 0, 0, ${opacity})`"
            v-if="isShow"
        >
            <slot name="content"></slot>
        </div>
    </transition>
</template>

<script>
import "@/assets/sass/lib/animate.css";
export default {
  data() {
    return {};
  },
  props: {
    isShow: {
      default: false,
      type: Boolean
    },
    opacity: {
      default: 0.6,
      type: Number
    },
    init: {
      //初始化
      type: Function,
      default: () => {
        console.log("init");
      }
    },
    onShow: {
      //打开
      type: Function,
      default: () => {
        console.log("onShow");
      }
    },
    onClose: {
      //关闭前
      type: Function,
      default: () => {
        console.log("onClose");
      }
    }
  },
  methods: {},
  created() {
    this.init();
  },
  watch: {
    isShow(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.onShow();
        console.log("弹窗打开");
      }
      if (!newVal && oldVal) {
        this.onClose();
        console.log("弹窗关闭");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.component-dialog {
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100vw;
  height: 100% !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
