// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "@/modules/App.vue";
import router from "./router";
import conifg from '@/modules/entryConfig'
import adsInfo from './statisticsInfo';
import stat from '@/statistic/home'

Vue.prototype.stat = stat;
Vue.prototype.adsInfo = adsInfo;

Vue.config.productionTip = false;

if (process.env.NODE_ENV != "production") {
  //let VConsole = require("../../assets/lib/console/vconsole.min.js").VConsole;
  //new VConsole()
}

/* eslint-disable no-new */
const RootAppConstructor = Vue.extend(App);
new RootAppConstructor({
  el: "#app",
  router
  // template: '<App/>',
  // components: { App }
});
