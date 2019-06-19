import Vue from 'vue'
import Router from 'vue-router'
import index from './index'
import detail from './detail'
import bannerDetail from './bannerDetail'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'info',
    component: index
  },
  {
    path: '/detail',
    name: 'detail',
    component: detail
  },
  {
    path: '/bannerDetail',
    name: 'bannerDetail',
    component: bannerDetail
  }
]

export {routes}

export default new Router({routes})
