<template lang="html">
    <div class="page-step-progress">
        <p class="title">申请进度</p>
        <div class="c-flex-row progress-wrap">
            <div class="c-flex-item">
                <div class="progress" v-for="(item, i) in progressWidth" :key="i"></div>
            </div>
        </div>
        <div class="bottom">{{['40', '90', '100'][progressWidth - 1]}}%</div>
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
.page-step-progress {
    background: #FFFFFF;
    box-shadow: inset 0 0 0 0 #E6E6E6;
    padding: 12px 16px;
    margin-bottom: 8px;

    .title {
        font-family: PingFangSC-Regular;
        color: #333333;
        letter-spacing: -0.29px;
        margin-bottom: 6px;
    }
    .bottom {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #333333;
        letter-spacing: -0.29px;
        text-align: right;
        margin-top: 9px;
    }
}
.progress-wrap {
    height: 6px;
    background-color: #ccc;
    border-radius: 3px;
  }

  .c-flex-item {
    display: flex;
    border-radius: 3px;

    .progress {
        background: #019AFF !important;
        height: 6px;
        width: 33.33334%;
    }
  }
</style>
