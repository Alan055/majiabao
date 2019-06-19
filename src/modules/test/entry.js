// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "@/modules/App.vue";
import router from "./router";
import conifg from "@/modules/entryConfig";
import SINAIF from "../../services/sinaifCallApp";
import AppBridge from '@/services/AppBridge'

Vue.config.productionTip = false;
Vue.prototype.SINAIF = SINAIF;

/* eslint-disable no-new */
const RootAppConstructor = Vue.extend(App);
new RootAppConstructor({
  el: "#app",
  router
  // template: '<App/>',
  // components: { App }
});

AppBridge.loadingView({close: true, type: 2})