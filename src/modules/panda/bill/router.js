import Vue from 'vue'
import Router from 'vue-router'
import index from './index2'
import list from './list'
import list2 from './list2'
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
        path: '/detail',
        name: 'billDetail',
        component: detail
    }
]

export { routes }

export default new Router({ routes })
