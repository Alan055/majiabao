<template>
  <div class="redBagBox" v-if="res&&res.entranceData&&res.entranceData.midEntrance">
    <div class="top">
      <div class="left">
        <img :src="res.entranceData.midEntrance.gif" alt="">
        <span>{{res.entranceData.midEntrance.ltitle}}</span>
      </div>
      <div class="right"><span>{{res.entranceData.midEntrance.rtitle}}</span></div>
    </div>
    <div class="content">
      <div class="left">{{res.entranceData.midEntrance.ltxt}} <span>{{res.entranceData.sumGoodsAmount}}</span>
      </div>
      <div class="right">
        <mt-button class="btn-round handle-button" :class="color" size="normal" @click.native="handClick(res.entranceData.topEntrance.url)">
          {{res.entranceData.midEntrance.btn}}
        </mt-button>
      </div>
    </div>
  </div>
</template>

<script>
	export default {
	  props: ['res'],
		data() {
			return {

      }
		},
		computed: {
	    color(){
	      let remark = this.res.entranceData.midEntrance.color
        if (remark == 1) {
          return "red";
        }
        if (remark == 2) {
          return "blue";
        }
        if (remark == 3) {
          return "black";
        }
        if (remark == 4) {
          return "gray";
        }
      }
    },
		watch: {
      'res.entranceData'(cur){
        if(cur){
          this.sinaAds.display({currEvent: this.stat.redEnvelope.records.showRedBagCell,}, () => {});
        }
      }
    },
		methods: {
      handClick(url){
        this.sinaAds.click({currEvent: this.stat.redEnvelope.records.clickRedBagCell,currEventParams:{url:url}}, () => {});
        this.$root.openUrl(url)
      }
    },
		created() {
		},
		mounted() {
		},
	}
</script>

<style lang='scss' scoped>
  .redBagBox {
    padding: 0 16px;
    background: #F5F5F5;
    border-radius: 8px;
    margin-bottom: 12px;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      height: 30px;
      .left {
        display: flex;
        align-items: center;
        img {
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
        span {
          color: #333;
        }
      }
      .right {
        span {
          color: #999;
        }
      }
    }
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      .left {
        color: #999;
        span {
          color: #333;
          font-weight: bold;
          font-size: 20px;
        }
      }
      .right {
        .handle-button {
          height: 30px;
          font-size: 14px;
          width: 86px;
          overflow: hidden;
        }
      }
    }
  }
</style>
