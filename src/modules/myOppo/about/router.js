import Router from 'vue-router'
import about from './index'

const routes = [{
        path: '/',
        name: 'about',
        component: about
    },
    {
        path: '/aboutOppo', //oppo渠道專用
        name: 'aboutOppo',
        component: resolve => require(['./about'], resolve)
    },
]

export { routes }

export default new Router({ routes })