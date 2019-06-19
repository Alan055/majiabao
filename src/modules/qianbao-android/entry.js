// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/modules/App.vue'
import router from './router'
import conifg from '@/modules/entryConfig'
import stat from '@/statistic/getTrust'

Vue.prototype.stat = stat

Vue.config.productionTip = false

/* eslint-disable no-new */
const RootAppConstructor = Vue.extend(App)
new RootAppConstructor({
  el: '#app',
  router
  // template: '<App/>',
  // components: { App }
})
