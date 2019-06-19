import Vue from 'vue'
import Router from 'vue-router'
import index from './index'
import list from './list'
import list2 from './list2'
import list3 from './list3'
import detail from './detail'

Vue.use(Router)

const routes = [{
        path: '/',
        name: 'bill',
        component: index
    },
    {
        path: '/list',
        name: 'billList',
        component: list
    },
    {
        path: '/list2',
        name: 'billList2',
        component: list2
    },
    {
        path: '/list3',
        name: 'billList3',
        component: list3
    },
    {
        path: '/detail',
        name: 'billDetail',
        component: detail
    }
]

export { routes }

export default new Router({ routes })
