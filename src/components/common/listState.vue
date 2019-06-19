<!-- 列表状态提示 -->
<template>
<div class="c-list-state" :class="{'no-list': !hasData}">
  <!-- 正在刷新 -->
  <slot name="refreshing" v-if="state=='refreshing'">
    <div class="weui-loading_toast" transition="fade">
      <div class="weui-mask_transparent"></div>
      <div class="weui-toast loading-toast">
        <i class="weui-loading weui-icon_toast"></i>
        <!-- <p class="weui-toast__content">loading</p> -->
      </div>
    </div>
  </slot>
  <!-- 正在加载 -->
  <slot name="loading" v-if="state=='loading'">
    <p class="c-list-state-text"><mt-spinner type="triple-bounce"></mt-spinner></p>
  </slot>
  <!-- 已加载全部 -->
  <slot name="noMore" v-if="state=='noMore'">
    <!-- <p class="c-list-state-text gray">已加载全部</p> -->
  </slot>
  <!-- 可以加载更多 -->
  <slot name="moreToLoad" v-if="state=='moreToLoad'">
    <!-- <p class="c-list-state-text gray">加载更多</p> -->
  </slot>
  <!-- 没有数据 -->
  <div v-if="state=='noData'" class="no-data">
    <slot name="noData">
      <p>暂无数据</p>
    </slot>
  </div>
  <!-- 默认状态，还未开始请求 -->
  <div v-if="state=='defaultState'" class="no-data default-state">
    <slot name="defaultState"></slot>
  </div>
  <!-- 网络连接失败 -->
  <div v-if="state=='badNetwork'" class="no-data bad-network">
    <slot name="badNetwork">
      <p>暂无网络</p>
      <button type="button" class="btn btn-lg btn-primary" @click="pageControl.refresh()">刷新重试</button>
    </slot>
  </div>
</div>
</template>
<script type="text/ecmascript-6">
export default {

  //==数据配置===
  data() {
    return {}
  },
  props: {
    pageControl: {
      default() {
        return {};
      },
      type: Object
    },
  },
  computed: {
    hasData() {
      return this.pageControl.dataList && this.pageControl.dataList.length;
    },
    state() {

      if(this.pageControl.refreshing){
        return 'refreshing';
        // return 'loading';
      }
      if(this.pageControl.loading){
        return 'loading';
      }
      if(this.pageControl.badNetwork){
        return 'badNetwork';
      }
      if(this.hasData){
        if(!this.pageControl.hasNextPage){
          return 'noMore';
        }
        else{
          return 'moreToLoad';
        }
      }
      if(this.pageControl.hasNextPage){
        return 'defaultState';
      }
      return 'noData';
    }
  },

}
</script>
