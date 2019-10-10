import Vue from 'vue'
import Router from 'vue-router'
import index from './index'
import system from './system'
import detail from './detail'
import example from './example'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'message',
    component: index
  },
  {
    path: '/system',
    name: 'system',
    component: system
  },
  {
    path: '/detail',
    name: 'messageDetail',
    component: detail
  },
  {
    path: '/example',
    name: 'example',
    component: example
  }
]

export {routes}

export default new Router({routes})
