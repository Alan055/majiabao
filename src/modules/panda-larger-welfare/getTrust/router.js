import Vue from 'vue'
import Router from 'vue-router'
import index from './index'

Vue.use(Router)


const routes = [
    {
        path: '/',
        name: 'getTrust',
        component: index
    }
]

export {routes}

export default new Router({routes})