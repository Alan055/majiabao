<template lang="html">
  <div class="home-page-detail view c-view">
    <div class="c-view-content">
      <div class="title">{{item.title}}</div>
        <div class="nav">
          <div class="left">来源：{{item.source}}</div>
          <div class="right">{{item.releasetime}}</div>
        </div>
        <div class="content" v-html="item.content"></div>
    </div>
  </div>
</template>

<script>
  import Api from '@/services/api'
  import helper from '@/utils/helper'
  import EventBus from '@/services/EventBus'
  import {Toast, Indicator} from '@/utils/helper'
  import AppBridge from '@/services/AppBridge'

  export default {
    data() {
      return {
        item: {
          title: '',
          source: '',
          releasetime: '',
          content: ''
        }
      }
    },


    methods: {

    },
    created () {
      helper.get("huiyi-information-content").then(item => {
        item = JSON.parse(item);
        this.item = item;

        this.$nextTick(() => {
            this.$root.loadingClose();
        })
        console.log('this.item', this.item)
      });

    },
    mounted () {

    },
    filters: {
    }
  }
</script>

<style lang="scss" scoped>
.home-page-detail {
  padding-bottom: 40px;
  .c-view-content {
    padding: 0 16px;
  }

  .title {
    font-family: PingFangSC-Medium;
    padding: 12px 16px;
    font-size: 18px;
    color: #333;
    letter-spacing: 0.12px;
    text-align: center;
  }

  .nav {
    display: flex;
    color: #999;
    padding: 16px 0;
    justify-content: space-between;
  }
  .content {
    color: #666;
    text-align: justify;
    line-height: 22px;
    letter-spacing: 1px;
  }
}

</style>
