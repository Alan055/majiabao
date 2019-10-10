import Vue from 'vue'
import Router from 'vue-router'
import loanList from './loanList'
import service from './service'
import disclaimer from './disclaimer'
import register from './register'
import authorization from './authorization'

const routes = [
  {
    path: '/loanList/:fundproductids/:orderid?',
    name: 'loanListAgreements',
    component: loanList
  },
  {
    path: '/service',
    name: 'serviceAgreements',
    component: service
  },
  {
    path: '/disclaimer',
    name: 'disclaimerAgreements',
    component: disclaimer
  },
  {
    path: '/register',
    name: 'registerAgreements',
    component: register
  },
  {
    path: '/authorization',
    name: 'authAgreements',
    component: authorization
  }
];

export {routes}

export default new Router({routes})

