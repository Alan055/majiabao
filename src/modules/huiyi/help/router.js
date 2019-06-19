import Vue from 'vue'
import Router from 'vue-router'
import index from './index'
import list from './list'
import detail from './detail'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'help',
    component: index
  },
  {
    path: '/list',
    name: 'helpList',
    component: list
  },
  {
    path: '/detail',
    name: 'helpDetail',
    component: detail
  }
]

export {routes}

export default new Router({routes})
