import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import routerView from '@/modules/routerView'
import { transformRoutes } from '@/modules/routerView'

export default new Router({
    routes: [
        {
            //黑名单用户首页
            path: "/nopass/level1",
            name: "/nopass/level1",
            component: r => require.ensure([], () => r(require("./pages/nopass/level1.vue")), 'nopasslevel1'),
        },
        {
            //分流失败用户首页
            path: "/nopass/level2",
            name: "/nopass/level2",
            component: r => require.ensure([], () => r(require("./pages/nopass/level2.vue")), 'nopasslevel2'),
        },
    ]
});