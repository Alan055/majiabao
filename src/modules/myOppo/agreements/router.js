import Router from 'vue-router'
import register from './register'

const routes = [{
    path: '/register',
    name: 'registerAgreements',
    component: register
}];

export { routes }

export default new Router({ routes })