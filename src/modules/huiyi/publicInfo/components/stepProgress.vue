<template lang="html">
    <div class="c-flex-row progress-wrap">
        <div class="c-flex-item">
            <div class="progress" v-for="(item, i) in progressWidth" :key="key"></div>
        </div>

    </div>
</template>

<script>
export default {
  props: ['step'],
  computed: {
      progressWidth() {
          console.log('this.step', this.step)
          if(this.step == 3){
              return 1
          }else if(this.step == 2){
              return 2
          }else if(this.step == 1){
              return 3
          }
      }
  }
}
</script>

<style lang="scss" scoped>
.progress-wrap {
    height: 4px;
    background-color: #ccc;
  }

  .c-flex-item {
    display: flex;

    .progress {
      background: #FF6F36 !important;
      height: 4px;
      width: 33.33334%;
    }
  }
</style>
