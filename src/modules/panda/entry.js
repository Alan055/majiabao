// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "@/modules/App.vue";
import router from "./router";
import conifg from '@/modules/entryConfig'
import adsInfo from './statisticsInfo';
import stat from '@/statistic/home'
import {
    Swipe,
    SwipeItem,
    Tab,
    Tabs
} from 'vant';
import 'vant/lib/index.css';
import mixins from "./mixins.js";

Vue.prototype.stat = stat;
Vue.prototype.adsInfo = adsInfo;

console.log('appName2', mixins)
document.title = mixins.appName2;
Vue.config.productionTip = false;

Vue.use(Swipe).use(SwipeItem);
Vue.use(Tab).use(Tabs);

import AppBridge from "@/services/AppBridge.js";
Vue.prototype.$AppBridge = AppBridge;
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