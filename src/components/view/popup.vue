<!--弹框-->

<!-- props: -->
<!-- option   必传  弹框显示时发送的埋点数据 -->

<!-- isCenter 选传  是否采用居中方案 -->
<!-- 0: 为不居中 -->
<!-- 1: 为居中方案1 -->
<!-- 2: 位居中方案2 -->
<!-- 默认为 1-->

<!-- v-model -->
<!-- content  必传  弹框内容-->

<template>
  <transition name="fade">

    <div class="popup-view c-top c-right c-left c-bottom" v-show="value">
      <div class="wrap c-top c-right c-left c-bottom"  @click="()=>{ $emit('maskingClose') }"  @touchmove.prevent></div>
      <div :class="'content' + isCenter">
        <slot name="content"></slot>
      </div>
    </div>

  </transition>
</template>

<script>
  import SinaAds from '@/utils/SinaAds';
  export default {
    name: "wrap",
    props: {

      // 控制遮罩显示隐藏
      value: {
        default: false,
        type: Boolean
      },

      // 是否需要居中 0不居中 12居中
      isCenter : {
        default: 1,
        type: [Number, String]
      },

      // 埋点需要传的参数（如无则不发送埋点数据）
      option : {
        type: [String, Object]
      }

    },

    watch: {
      value (newVal) {
        if (newVal && this.option) {
          SinaAds.popover(this.option);
        }
      }
    },

  }
</script>

<style lang="scss" scoped>

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .popup-view {
    position: fixed;
    z-index: 100;
    .wrap {
      position: absolute;
      background: rgba(0,0,0,0.6);
      z-index: 99;
    }

    /*第一种居中方案 （不需定义宽高）*/
    .content1 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 100;

      /*第二种居中方案 （需定义宽高）*/
      /*top: 0;*/
      /*left:0;*/
      /*right: 0;*/
      /*bottom: 0;*/
      /*margin: auto;*/

    }
    /*第二种居中方案 （需定义宽高）*/
    .content2 {
      position: absolute;
      top: 0;
      left:0;
      right: 0;
      bottom: 0;
      margin: auto;
      z-index: 100;
    }
    .content0 {
      position: relative;
      z-index: 100;
    }
  }

</style>
