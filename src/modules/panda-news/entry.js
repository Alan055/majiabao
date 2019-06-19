import 'vant/lib/index.css';
import './assets/sass/index.scss';

import Vue from "vue";
import App from "@/modules/App.vue";
import router from "./router";
import conifg from '@/modules/entryConfig'
import stat from '@/statistic/home'

import api from "@/services/api.js";
import AppBridge from "@/services/AppBridge.js";
import helper from "@/utils/helper";
import EventBus from "@/services/EventBus";
import util from "@/utils/index.js";
import mixins from "./mixins.js";
import {
    Swipe,
    SwipeItem,
    Tab,
    Tabs
} from 'vant';

console.log('appName2', mixins)
document.title = mixins.appName2;

Vue.prototype.stat = stat;

Vue.prototype.$api = api;
Vue.prototype.$AppBridge = AppBridge;
Vue.prototype.$helper = helper;
Vue.prototype.$EventBus = EventBus;
Vue.prototype.$util = util;

Vue.config.productionTip = false;

Vue.use(Swipe).use(SwipeItem);
Vue.use(Tab).use(Tabs);

if (process.env.NODE_ENV != "production") {
    let VConsole = require("../../assets/lib/console/vconsole.min.js").VConsole;
    new VConsole()
}

const RootAppConstructor = Vue.extend(App);
new RootAppConstructor({
    el: "#app",
    router
});
