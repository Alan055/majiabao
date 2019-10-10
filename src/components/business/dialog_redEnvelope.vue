<!-- 首复贷红包的弹框 -->
<template>
  <van-dialog v-model="showDialog" class="dialog_redEnvelope" title="极速熊猫专享红包" v-if="res&&res.dialogRelData&&res&&res.dialogRelData.length" :showConfirmButton="false">
    <div class="content">
      <h3>立即领取吧</h3>
      <div class="list" :class="{'listCenter':res.dialogRelData.length<3}">
        <div class="itemBox" v-for="(v,i) in res.dialogRelData" :key="i">
          <div class="item" >
            <div class="left"><span>{{v.amount}}</span>元</div>
            <div class="right">
              <span class="title">{{v.title}}</span>
              <span class="tip">{{v.validateDate}}</span>
            </div>
          </div>
        </div>

      </div>
      <div class="btn" @click="handClick(res.entranceData.topEntrance.url);close()"><img src="./../../assets/images/recommend/redBagDialog_light.png" alt="">立即查看</div>
    </div>
    <img src="./../../assets/images/recommend/redBagDialog_close.png" @click="closeMD();close()" class="close" alt="">
  </van-dialog>
</template>

<script>
  import {Dialog} from 'vant';
  import Vue from 'vue'
  Vue.use(Dialog)

  export default {
    props: ['res', 'showDialog','close'],
    data() {
      return {
      }
    },
    computed: {},
    watch: {
      showDialog(){
        if(this.showDialog){ // 打开弹框的时候增加埋点
          this.sinaAds.display({currEvent: this.stat.redEnvelope.index.showDialog,}, () => {});
        }
      }
    },
    methods: {
      handClick(url){
        this.sinaAds.click({currEvent: this.stat.redEnvelope.index.clickdialogBtn,currEventParams:{url:url}}, () => {});
        this.$root.openUrl(url)
      },
      closeMD(){
        this.sinaAds.click({currEvent: this.stat.redEnvelope.index.closedialogBtn,}, () => {});
      }
    },
    created() {
    },
    mounted() {
    },
  }
</script>

<style lang='scss' scoped>
  .dialog_redEnvelope {
    background: url("./../../assets/images/recommend/redBagDialog_bg.png") no-repeat;
    background-size: cover;
    max-height: 375px;
    overflow: unset;
    /deep/ .van-dialog__header{
      padding-top: 44px;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
    }
    .content{
      padding: 0 15px;
      margin-bottom: 30px;
      h3{
        color: #fff;
        font-size: 14px;
        text-align: center;
      }
      .list{
        max-height: 226px;
        min-height: 140px;
        overflow: auto;
        margin-top: 20px;
        &.listCenter{
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .itemBox{
          height: 70px;
          overflow: hidden;
          margin-bottom: 8px;
          &:last-child{
            margin-bottom: 0px;
          }
          .item{
            border-radius: 4px;
            height: 70px;
            background: #fff;
            display: flex;
            justify-content: left;
            align-items: center;

            position: relative;
            &::before{
              position: absolute;
              display: inline-block;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              top: -8px;
              left: calc(30% - 8px);
              content: '';
              background: #fe3c2f;
            }
            &::after{
              position: absolute;
              display: inline-block;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              bottom: -8px;
              left: calc(30% - 8px);
              content: '';
              background: #fe3c2f;
            }

            .left{
              width: 30%;
              color: #EB242A ;
              font-size: 12px;
              vertical-align: baseline;
              text-align: center;
              span{
                font-size: 24px;
                font-weight: bold;
              }
            }
            .right{
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
              border-left: 1px dashed #ccc;
              height: 100%;
              padding-left: 30px;
              .title{
                font-size: 16px;
                color: #333;
                font-weight: bold;
                margin-bottom: 4px;
              }
              .tip{
                color: #666;
                font-size: 12px;
              }
            }
          }
        }

      }
      .btn{
        height: 50px;
        font-weight: bold;
        color: #E72527;
        background: yellow;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 12px;
        border-radius: 30px;
        box-shadow: 0px 5px #fc9608;
        position: absolute;
        width: calc(100% - 32px);
        img{
          height: 4px;
          position: absolute;
          left: 10px;
          top: 10px;
        }
      }
    }
    .close{
      width: 24px;
      height: 24px;
      position: absolute;
      bottom: -80px;
      left: calc(50% - 12px);
    }
  }
</style>
