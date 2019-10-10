import Vue from 'vue'
import Router from 'vue-router'
import index from './index'
import routerView from '@/modules/routerView'
import { transformRoutes } from '@/modules/routerView'

import { routes as about } from './about/router'
import { routes as agreements } from './agreements/router'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'my',
            component: index
        },
        {
            path: '/about',
            component: routerView,
            children: transformRoutes(about)
        },
        {
            path: '/agreements',
            component: routerView,
            children: transformRoutes(agreements)
        }
    ]
})