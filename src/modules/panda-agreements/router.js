import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import routerView from '@/modules/routerView'
import { transformRoutes } from '@/modules/routerView'

export default new Router({
    routes: [
        {
            path: "/userProtocol/:fundproductids/:orderid?",
            name: "/userProtocol",
            component: r => require.ensure([], () => r(require("./pages/userProtocol/index")), 'refuse'),
        },
        {
            path: "/userProtocol",
            name: "/userProtocol",
            component: r => require.ensure([], () => r(require("./pages/userProtocol/index")), 'refuse'),
        },
    ]
});