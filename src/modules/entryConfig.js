import Vue from "vue";
import appBridge from "@/services/AppBridge";
import MintUI from "mint-ui";
import filter from "./filter";
import validate from "./validate";
import component from "@/components";

import 'babel-polyfill'
import Es6Promise from 'es6-promise'

require('es6-promise').polyfill()
Es6Promise.polyfill()

import "normalize.css";
import "mint-ui/lib/style.css";
import "@/assets/sass/common/index.scss";
import "@/assets/sass/view/index.scss";

import SINAIF from "@/services/sinaifCallApp";
import SinaAds from "@/utils/SinaAds";
import './hooks'
import './directives'
import './mixins'

import helper from "@/utils/helper.js";
import diversion from '@/statistic/diversion'
import market from '@/statistic/market'

document.body.addEventListener('touchstart', function() {}); //解决移动端&:active伪类无效

Vue.prototype.SINAIF = SINAIF;
Vue.prototype.sinaAds = SinaAds;
Vue.prototype.stat_market = market;
Vue.prototype.stat_diversion = diversion;

let res = localStorage.getItem('openProdLog')
if (res && res == 1) {
    let vConsoleObj = require("@/assets/lib/console/vconsole.min.js").VConsole;
    new vConsoleObj()
}

// 注册一个全局自定义指令 `v-sinaAds` 埋点
// 调用时自需要在dom 上 绑定 v-sinaAds.click="埋点参数" 即可
// v-sinaAds="埋点参数" 默认为click类型的埋点事件
// v-sinaAds.click.hover="埋点参数" 可以绑定多个类型的埋点事件
Vue.directive('sinaAds', {
    // 当被绑定的元素插入到 DOM 中时……
    bind: function(el, binding) {

        // 埋点参数
        let option = binding.value;

        // 对象
        let type = binding.modifiers;

        // 是否需要绑定默认事件 （v-sinaAds 无指定事件时，则默认为click类型）
        let isNeedBindDefaultEvent = true;

        // 遍历对象绑定事件 (暂只对click，hover事件进行处理)
        el.addEventListener('click', () => {

            // 遍历type
            for (let i in type) {
                isNeedBindDefaultEvent = false;
                if (SinaAds[i]) {
                    SinaAds[i](option);
                } else {
                    console.warn('暂未支持此埋点类型: ' + i);
                }
            }

            // 默认click
            if (isNeedBindDefaultEvent) {
                SinaAds['click'](option);
            }

        });

    }
});

Vue.use(MintUI);