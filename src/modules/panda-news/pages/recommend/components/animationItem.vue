<template>
<div class="container" :class="{'apply-animation': !!data.prestatus}">
  <div class="cross-wrap" v-if="!!data.prestatus">
    <div v-for="index in 20" :key="index" class="img-wrap" :style="`opacity: ${random(0.5)+0.4};transform: translate(${random(85)-5}px, ${random(20)}px) scale(${random(0.5)+0.5});`">
      <img class="cross" :class="'cross'+index" src="~@/assets/images/recommend/cross.png" alt="" :style="`animation-delay: ${random(0.1)}s`" >
    </div>
    
  </div>
  <div class="label-wrap">
    <span v-for="(word, index) in labels" :key="word" class="word" :class="'word'+index" :style="`animation-delay: ${index*0.1}s`">{{word}}</span>
  </div>
</div>  
</template>
<script>
import api from '@/services/api'

export default {
  props: ['data', 'label'],  
  computed: {
    labels() {
      let label = this.label || ''
      return label.split('')
    }
  },
  methods: {
    // 动画完成通知
    updateEvent() {
      let {orderid, billid} = this.data
      api.home.updateTempEvent({orderid, billid})
    },
    random(limit) {
      return Math.random() * limit
    }
  },
  mounted() {
    // 贷款状态变更
    if(this.data.prestatus) {
      setTimeout(() => {
        
        this.updateEvent()
      }, 1000)
      
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes cross-pop {
  0%{
    opacity: 0.3;
    transform: translateY(5px);
  }
  80%{
    opacity: 1;
    transform: translateY(-80px);
  }
  100%{
    opacity: 0;
    transform: translateY(-80px);
  }
}

.img-wrap{
  position: absolute;
  left: 0;
  bottom: 0;
}
.cross{
  width: 14px;
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  animation-name: cross-pop;
  animation-duration: 1.3s;
  animation-fill-mode: both;
  animation-timing-function: ease-out;
  // animation-iteration-count: infinite;
}


@keyframes word-pop {
  0%{
    opacity: 0.3;
    transform: translateY(40px);
  }  
  100%{
    opacity: 1;
    transform: translateY(0);
  }
}

.apply-animation{
  .word{
    display: inline-block;
    
    animation-name: word-pop;
    animation-duration: 0.9s;
    animation-fill-mode: both;
    animation-timing-function: ease-out;
  }
}


</style>


