import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import routerView from '@/modules/routerView'
import { transformRoutes } from '@/modules/routerView'

export default new Router({
    routes: [
        {
            path: "/drawLottery",
            name: "/drawLottery",
            component: r => require.ensure([], () => r(require("./pages/drawLottery/index")), 'drawLottery'),
        },
        {
            path: "/integral",
            name: "/integral",
            component: r => require.ensure([], () => r(require("./pages/integral/index")), 'integral'),
        },
        {
            path: "/myPrize",
            name: "/myPrize",
            component: r => require.ensure([], () => r(require("./pages/myPrize/index")), 'myPrize'),
        },
        {
            path: "/scroller",
            name: "/scroller",
            component: r => require.ensure([], () => r(require("./pages/view/index")), 'scroller'),
        },
    ]
});
