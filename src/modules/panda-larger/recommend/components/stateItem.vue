<template>
  <div class="container">
    <div class="front" ref="front">
      <slot name="before"></slot>
    </div>
    <div :class="{'top': !!data.prestatus}" ref="top">
      <slot name="after"></slot>
    </div>
  </div>
</template>
<script>
import api from '@/services/api'

export default {
  props: ['data'],  
  methods: {
    // 动画完成通知
    updateEvent() {
      let {orderid, billid} = this.data
      api.home.updateTempEvent({orderid, billid})
    }
  },
  mounted() {
    // 贷款状态变更
    if(this.data.prestatus) {
      setTimeout(() => {
        this.$refs.front.className = this.$refs.front.className.replace('front', 'bottom')
        this.$refs.top.className = this.$refs.top.className.replace('top', 'front')

        this.updateEvent()
      }, 1000)
      
    }
  }
}
</script>

<style lang="scss" scoped>
$time: 0.4s;
$size: 30px;

.front {
    transform: translateZ(-$size) rotateX(  0deg) translateZ($size);
    opacity: 1;
}

.top {
    transform: translateZ(-$size) rotateX(90deg) translateZ($size); 
    opacity: 0;
}

.bottom {
    transform: translateZ(-$size) rotateX( -90deg) translateZ($size);
    opacity: 0;
}

.top,.front,.bottom {
    position: absolute;
    top: 0;
    right: 0;
    background: white;

    backface-visibility: hidden;
    transition: transform $time ease-in-out, opacity $time ease-in-out;
}

.container {
    position:relative; min-width:100px;

    perspective: 1000;
}

</style>


