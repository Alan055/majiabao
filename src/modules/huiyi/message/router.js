import Vue from 'vue'
import Router from 'vue-router'
import index from './index'
import detail from './detail'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'message',
    component: index
  },
  {
    path: '/detail',
    name: 'messageDetail',
    component: detail
  }
]

export {routes}

export default new Router({routes})
