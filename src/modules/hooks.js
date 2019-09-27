// 全局事件监听插件

import Vue from 'vue';
import AppBridge from '@/services/AppBridge'
import EventBus from '@/services/EventBus'
import {seekForValue} from '@/utils'

// 刷新事件监听
// onRefresh(tag, data){}
const refreshData = {}
refreshData.install = function (_Vue, options) {
  // 注入组件
  _Vue.mixin({
    created: function () {
      if (this.$options.onRefresh) {
        // AppBridge.setWebAttribute({ asynRefresh: true })
        EventBus.$on('refreshData', res => {
          let tag = seekForValue(res, ['data', 'tag'])
          let data = seekForValue(res, ['data', 'data'])
          this.$options.onRefresh.call(this, tag, data)
        })
      }      
    }
  })
}
Vue.use(refreshData)

// 返回事件监听
// onBack(){}
const onBack = {}
onBack.install = function(_Vue, options) {
  // 注入组件
  _Vue.mixin({
    created () {
      if (this.$options.onBack) {
        AppBridge.setWebAttribute({ intercept: true })
        EventBus.$on('back', res => {
          this.$options.onBack.call(this)
        })
      }
    }    
  })
}
Vue.use(onBack)

// 页面title
const title = {}
title.install = function (_Vue, options) {
    _Vue.mixin({
        created() {
            if (this.$options.title){
                this.$root.setWebAttribute({
                    title: this.$options.title
                });
            }
        }
    })
}
Vue.use(title)
