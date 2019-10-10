import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import routerView from '@/modules/routerView'
import {
    transformRoutes
} from '@/modules/routerView'
import {
    routes as feedback
} from './pages/feedback/router'

export default new Router({
    routes: [
        // 资讯
        {
            path: "/news",
            name: "news",
            component: r => require.ensure([], () => r(require("./pages/news/index.vue")), 'news'),
        },
        // 更多资讯
        {
            path: "/news/more",
            name: "news/more",
            component: r => require.ensure([], () => r(require("./pages/news/more.vue")), 'newsmore'),
        },
        // 资讯详情
        {
            path: "/news/detail",
            name: "news/detail",
            component: r => require.ensure([], () => r(require("./pages/news/detail.vue")), 'detail'),
        },
        // 新手攻略
        {
            path: "/news/newbie",
            name: "news/newbie",
            component: r => require.ensure([], () => r(require("./pages/news/newbie.vue")), 'newbie'),
        },

        // 首页
        {
            path: "/recommend",
            name: "recommend",
            component: r => require.ensure([], () => r(require("./pages/recommend/index")), 'recommend'),
        },
        // 待还账单
        {
            path: "/recommend/repayList",
            name: "recommend/repayList",
            component: r => require.ensure([], () => r(require("./pages/recommend/repayList")), 'repayList'),
        },

        // 结清记录
        {
            path: "/recommend/finishList",
            name: "recommend/finishList",
            component: r => require.ensure([], () => r(require("./pages/recommend/finishList")), 'finishList'),
        },
        // 注册协议
        {
            path: "/agreements/register",
            name: "/agreements/register",
            component: r => require.ensure([], () => r(require("./pages/agreements/register.vue")), 'register'),
        },
        // 隐私协议
        {
            path: "/agreements/disclaimer",
            name: "/agreements/disclaimer",
            component: r => require.ensure([], () => r(require("./pages/agreements/disclaimer.vue")), 'disclaimer'),
        },
        // 平台服务协议
        {
            path: "/agreements/service",
            name: "/agreements/service",
            component: r => require.ensure([], () => r(require("./pages/agreements/service.vue")), 'service'),
        },
        // 服务及授权条款
        {
            path: "/agreements/authorization",
            name: "/agreements/authorization",
            component: r => require.ensure([], () => r(require("./pages/agreements/authorization.vue")), 'authorization'),
        },
        //意见反馈
        {
            path: '/feedback',
            component: routerView,
            children: transformRoutes(feedback)
        },
        // 关于我们
        {
            path: "/about",
            name: "about",
            component: r => require.ensure([], () => r(require("./pages/about/index.vue")), 'about'),
        },
        // 优惠券
        {
            path: "/ticket",
            name: "ticket",
            component: r => require.ensure([], () => r(require("./pages/ticket/index.vue")), 'ticket'),
        },
    ]
});
