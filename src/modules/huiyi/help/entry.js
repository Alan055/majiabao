// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/modules/App.vue'
import router from './router'
import conifg from '@/modules/entryConfig'
import helpAds from './helpAds';

Vue.config.productionTip = false;
Vue.prototype.adsInfo = {
  help: helpAds
};

/* eslint-disable no-new */
const RootAppConstructor = Vue.extend(App)
new RootAppConstructor({
  el: '#app',
  router
  // template: '<App/>',
  // components: { App }
})
