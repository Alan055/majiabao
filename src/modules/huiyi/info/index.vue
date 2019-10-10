<template lang="html">
  <div class="home-page view">
    <div class="content" ref="contentView">
      <div class="title">资讯</div>
      <div class="news-list" @click="handleClick(item)" v-for="(item, i) in informationData" :key="i">
        <div class="list-left">
          <div class="list-title">{{item.title}}</div>
          <div class="list-time">{{item.releasetime}}</div>
        </div>
        <div class="list-right">
          <div class="list-img" :style="`background-image: url(${item.iconurl})`"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/services/api'
  import helper from '@/utils/helper'
  import EventBus from '@/services/EventBus'
  import {Toast, Indicator} from '@/utils/helper'
  import AppBridge from '@/services/AppBridge'

  export default {
    data() {
      return {
        informationData: []
      }
    },

    created () {
      this.getInformation();
    },

    methods: {
      //type 0.内部文章 1.外部链接
      handleClick(item){
        if(item.type == 0){
          helper.set("huiyi-information-content", JSON.stringify(item));
        }
        this.$root.openUrl({
          url: item.openlink,
          title: '详情'
        })
      },
      getInformation() {
        //this.informationData = JSON.parse('{"msg":"ok","code":200,"data":[{"through":0,"createtime":"2018-11-26 19:07:26","orderno":1,"productid":"2001","subhead":null,"remark":null,"source":"安贷客","title":"新手贷款 如何让借钱更安全？","type":0,"content":"content","businesstype":"0000","createby":"czx","openlink":"http://static.sinawallent.com/v1.1.0/pages/#/home/detail","releasetime":"2018-11-21 00:00:00","updateby":"czx","iconurl":"http://k8s-tmp1.sinaif.com/information1.png","id":"2018112618580000","updatetime":"2018-11-26 19:11:08","status":1}]}').data
        //console.log('informationData', this.informationData)
        api.huiyi.getInformation({
          params: {}
        })
        .then(res => {
          if (!helper.isSuccess(res)) return;
          if(res.code == 200){
            this.informationData = res.data;

            this.$nextTick(() => {
              setTimeout(() => {
                console.log('当前元素的高度12', this.$refs.contentView.offsetHeight)
                AppBridge.webViewHeight({
                  height: this.$refs.contentView.offsetHeight || 222
                })
                this.$root.loadingClose();
              }, 1000)
            })
          }else{
            Toast(res.msg)
          }
        })
        .catch(() => {
          console.log('接口请求失败')
        })
      }
    },
    mounted () {

    },
    filters: {

    }
  }
</script>

<style lang="scss" scoped>
.home-page {

  .title {
    border-top: 8px solid #F5F5F5;
    padding: 12px 16px;
    font-size: 16px;
    color: #333;
    text-align: left;
  }

  .news-list {
    @extend %border-t;
    padding: 10px 16px;
    display: flex;
    align-items: center;

    .list-left {
      width: 75%;
      .list-title {
        font-size: 16px;
        color: #333;
        letter-spacing: 0.12px;
        padding: 5px 0;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .list-time {
        font-size: 12px;
        color: #999;
        letter-spacing: 0.12px;
      }
    }
    .list-right {
      width: 25%;
      text-align: right;
      .list-img {
        display: inline-block;
        margin-top: 4px;
        width: 74px;
        height: 54px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}

</style>
