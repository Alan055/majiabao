import Vue from 'vue'
import Router from 'vue-router'
import getTrust from './getTrust'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/getTrust',
      name: 'getTrust',
      component: getTrust
    },
  ]
})
