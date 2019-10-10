import Vue from 'vue'
import Router from 'vue-router'
import index from './index'
import list from './list'
import detail from './detail'

Vue.use(Router)

const routes = [
  {
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
    path: '/detail',
    name: 'billDetail',
    component: detail
  }
]

export {routes}

export default new Router({routes})
