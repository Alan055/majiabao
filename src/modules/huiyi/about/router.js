import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import about from './index'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'about',
    component: about
  }
]

export {routes}

export default new Router({routes})
