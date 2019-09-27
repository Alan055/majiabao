// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "@/modules/App.vue";
import router from "./router";
import conifg from '@/modules/entryConfig'
import adsInfo from './statisticsInfo';
import diversion from '@/statistic/diversion'
import stat from '@/statistic/home'
import { Swipe, SwipeItem, Tab, Tabs } from 'vant';
import 'vant/lib/index.css';
import AppBridge from "@/services/AppBridge.js";

Vue.prototype.stat = stat;
Vue.prototype.stat_diversion = diversion;
Vue.prototype.adsInfo = adsInfo;
Vue.prototype.$AppBridge = AppBridge;

Vue.config.productionTip = false;

Vue.use(Swipe).use(SwipeItem);
Vue.use(Tab).use(Tabs);

if (process.env.NODE_ENV != "production") {
  let VConsole = require("../../assets/lib/console/vconsole.min.js").VConsole;
  new VConsole()
}

/* eslint-disable no-new */
const RootAppConstructor = Vue.extend(App);
new RootAppConstructor({
  el: "#app",
  router
  // template: '<App/>',
  // components: { App }
});
